import React, { FormEvent } from 'react'
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  Text,
  Checkbox,
  SpinButton,
  Dropdown,
  IDropdownOption
} from 'office-ui-fabric-react'
import StudentCard from './StudentCard'
import Student from '../../model/Student'
import _ from 'lodash'
import { Task } from '../../model/Task'
import api from '../../util/api'
import TaskSessionModel from '../../model/TaskSessionModel'
import ClassSessionModel from '../../model/ClassSessionModel'

type TState = {
  students: Student[]
  selectedStudents: Map<Student, boolean>
  groups: Student[][]
  differentSchoolsMode: boolean,
  groupSize: string | undefined,
  tasks: Task[],
  selectedTaskId: Task | null
}

type TProps = {
  onSessionCreate: (classSession: ClassSessionModel) => void
  classSessionId: number
  students: Student[]
}

class TaskSessionCreator extends React.Component<TProps> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleGroupCreate = this.handleGroupCreate.bind(this)
    this.handleRandomGroupsCreate = this.handleRandomGroupsCreate.bind(this)
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
    this.onIncrementChange = this.onIncrementChange.bind(this)
    this.onDecrementChange = this.onDecrementChange.bind(this)
    this.handleStartSession = this.handleStartSession.bind(this)

    this.state = {
      students: this.props.students,
      selectedStudents: new Map<Student, boolean>(),
      groups: [],
      differentSchoolsMode: false,
      groupSize: undefined,
      tasks: [],
      selectedTaskId: null
    }
  }

  onCheckboxChange (event?: FormEvent<HTMLInputElement | HTMLElement> | undefined) {
    const target = (event!.target as HTMLInputElement)
    this.setState({ [target.name]: target.checked })
  }

  onIncrementChange = (value: string, event: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => {
    this.setState(() => {
      return { groupSize: (parseInt(value) + 1).toString() }
    })
  }

  onDecrementChange = (value: string, event: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => {
    this.setState(() => {
      return { groupSize: (parseInt(value) - 1).toString() }
    })
  }

  handleSelection (student: Student) {
    this.setState((prevState: any) => {
      const newSelected: Map<Student, boolean> = new Map<Student, boolean>(prevState.selectedStudents)
      newSelected.set(student, !newSelected.get(student))
      return { selectedStudents: newSelected }
    })
  }

  handleGroupCreate (event: any) {
    console.log(event)
    this.setState((prevState: any) => {
      const newGroups: Student[][] = Object.create(prevState.groups)
      const newSelected: Map<Student, boolean> = new Map(prevState.selectedStudents)
      const newGroup: Student[] = []
      const newStudents: Student[] = Object.create(prevState.students)
      newSelected.forEach((selected: boolean, student: Student) => {
        if (selected) {
          newGroup.push(student)
          _.remove(newStudents, (st) => st === student)
        }
      })
      newGroups.push(newGroup)
      return { groups: newGroups, selectedStudents: new Map<Student, boolean>(), students: newStudents }
    })
  }

  generateGroupsFromState () {
    const { groupSize, differentSchoolsMode } = this.state
    const groupSizeNum = parseInt(groupSize!)
    const groupsCount = _.ceil(this.state.students.length / groupSizeNum)
    const newGroups: Student[][] = Array(groupsCount).fill(0).map(() => [])
    const schools: string[] = _.uniq(this.state.students.map((student: Student) => student.school))
    let students: Student[] = Array.from(this.state.students)

    if (differentSchoolsMode) { // generating a queue of shuffled students of every school sorted by school size
      students = schools.reduce((queue: Student[], school: string) => { // for every school
        return queue.concat(_.shuffle(students.filter(student => student.school === school))) // push its students to a queue in random order
      }, [])
    } else students = _.shuffle(students) // if we don't care about even school representation in groups a random order is sufficient

    while (!_.isEmpty(students)) {
      students.splice(0, groupsCount)
        .forEach((student: Student, index: number) => {
          newGroups[index].push(student)
          newGroups[index] = _.shuffle(newGroups[index])
        })
    }
    return _.shuffle(newGroups)
  }

  handleRandomGroupsCreate () {
    this.setState({ groups: this.generateGroupsFromState(), students: [] })
  }

  handleStartSession () {
    const sessionsToCreate = {
      taskId: this.state.selectedTaskId,
      classSessionId: this.props.classSessionId,
      groups: this.state.groups.map(group => group.map(student => student.id))
    }
    api.post('/taskSessions/create', sessionsToCreate)
      .then((response) => this.props.onSessionCreate(response.data))
  }

  componentDidMount () {
    api.get('/tasks')
      .then(response => this.setState({ tasks: response.data }))
  }

  render () {
    const taskOptions: IDropdownOption[] = this.state.tasks.map((item) => ({ key: item.id!, text: item.name }))
    const stackTokens = { childrenGap: 13 }
    const topStackTokens = { childrenGap: 10 }
    const columnTokens = { childrenGap: 10 }
    const columnStyles = {
      root: {
        width: '50%'
      }
    }
    return (
      <div >
        <Stack horizontal horizontalAlign={'space-between'} tokens={stackTokens}>
          <Stack horizontal tokens={topStackTokens}>
            <DefaultButton onClick={this.handleGroupCreate}>
              Utwórz grupę
            </DefaultButton>
            <DefaultButton onClick={this.handleRandomGroupsCreate}>
              Losuj grupy
            </DefaultButton>
            <Stack.Item shrink={1}>
              <SpinButton
                styles={{ root: { width: 20 } }}
                placeholder="Rozmiar grupy"
                min={0}
                value={this.state.groupSize}
                onIncrement={this.onIncrementChange}
                onDecrement={this.onDecrementChange}/>
            </Stack.Item>
            <Stack.Item shrink={1} align={'center'}>
              <Checkbox
                name="differentSchoolsMode"
                label="Różne szkoły"
                onChange={this.onCheckboxChange}
                checked={this.state.differentSchoolsMode}
              />
            </Stack.Item>
          </Stack>
          <Stack.Item>
            <Stack horizontal tokens={topStackTokens}>
              <Dropdown
                styles={{ root: { width: 250 } }}
                onChange={(event: FormEvent<HTMLDivElement>, option?: IDropdownOption) =>
                  this.setState({ selectedTaskId: option?.key })}
                options={taskOptions}
                placeholder='Zadanie'
              />
              <PrimaryButton className="is-primary" onClick={this.handleStartSession}>
                Rozpocznij sesję zadań
              </PrimaryButton>
            </Stack>
          </Stack.Item>
        </Stack>
        <Stack horizontal tokens={columnTokens}>
          <Stack.Item grow={1} styles={columnStyles}>
            <Stack>
              <Text variant='xxLarge'>
                Uczniowie:
              </Text>
              <Stack horizontal wrap tokens={columnTokens}>
                {this.state.students.map((student, id) => {
                  const selected = this.state.selectedStudents.get(student)
                  return (
                    <Stack.Item key={id}>
                      <StudentCard key={id} selectEvent={() => this.handleSelection(student)} selected={selected}
                        student={student}/>
                    </Stack.Item>
                  )
                })}
              </Stack>
            </Stack>
          </Stack.Item>
          <Stack.Item grow={1} styles={columnStyles}>
            <Stack>
              <Text variant='xxLarge'>
                Grupy:
              </Text>
              {this.state.groups.map((group, groupId) => (
                <div key={groupId}>
                  <Text variant='xLarge'>Grupa {groupId + 1}</Text>
                  <Stack horizontal wrap tokens={columnTokens}>
                    {group.map((student, studentId) => (
                      <Stack.Item key={studentId}>
                        <StudentCard key={studentId} student={student}/>
                      </Stack.Item>
                    ))}
                  </Stack>
                </div>
              ))}
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
    )
  }
}

export default TaskSessionCreator

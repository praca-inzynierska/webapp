import React, { FormEvent } from 'react'
import {
  Checkbox,
  DefaultButton,
  Dropdown,
  IconButton,
  IDropdownOption,
  PrimaryButton,
  SpinButton,
  Stack,
  Text,
  MessageBar,
  MessageBarType
} from 'office-ui-fabric-react'
import { FontIcon } from 'office-ui-fabric-react/lib/Icon'
import StudentCard from './StudentCard'
import { StudentUser } from '../../model/Student'
import _ from 'lodash'
import { Task } from '../../model/Task'
import api from '../../util/api'
import ClassSessionModel from '../../model/ClassSessionModel'
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling'

type TState = {
  students: StudentUser[]
  selectedStudents: Map<StudentUser, boolean>
  groups: Group[]
  differentSchoolsMode: boolean,
  groupSize: string | undefined,
  tasks: Task[],
  selectedTaskId: Task | null
}

type TProps = {
  onSessionCreate: (classSession: ClassSessionModel) => void
  classSessionId: number
  students: StudentUser[]
}

class Group {
  students: StudentUser[]
  passRequirements: boolean

  constructor (newGroup: StudentUser[], passRequirements: boolean) {
    this.passRequirements = passRequirements
    this.students = newGroup
  }
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
      selectedStudents: new Map<StudentUser, boolean>(),
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

  handleSelection (student: StudentUser) {
    this.setState((prevState: any) => {
      const newSelected: Map<StudentUser, boolean> = new Map<StudentUser, boolean>(prevState.selectedStudents)
      newSelected.set(student, !newSelected.get(student))
      return { selectedStudents: newSelected }
    })
  }

  handleGroupCreate (event: any) {
    console.log(event)
    this.setState((prevState: any) => {
      const newGroups: Group[] = Object.create(prevState.groups)
      const newSelected: Map<StudentUser, boolean> = new Map(prevState.selectedStudents)
      const newGroup: StudentUser[] = []
      const newStudents: StudentUser[] = Object.create(prevState.students)
      newSelected.forEach((selected: boolean, student: StudentUser) => {
        if (selected) {
          newGroup.push(student)
          _.remove(newStudents, (st) => st === student)
        }
      })
      newGroups.push(new Group(newGroup, true))
      return { groups: newGroups, selectedStudents: new Map<StudentUser, boolean>(), students: newStudents }
    })
  }

  generateGroupsFromState () {
    const { groupSize, differentSchoolsMode } = this.state
    const groupSizeNum = parseInt(groupSize!)
    const groupsCount = _.ceil(this.state.students.length / groupSizeNum)
    const studentGroups: StudentUser[][] = Array(groupsCount).fill(0).map(() => [])
    let newGroups: Group[] = []
    const schools: string[] = _.uniq(this.state.students.map((student: StudentUser) => student.schoolName))
    let students: StudentUser[] = Array.from(this.state.students)

    if (differentSchoolsMode) { // generating a queue of shuffled students of every school sorted by school size
      students = schools.reduce((queue: StudentUser[], school: string) => { // for every school
        return queue.concat(_.shuffle(students.filter((student: StudentUser) => student.schoolName === school))) // push its students to a queue in random order
      }, [])
    } else students = _.shuffle(students) // if we don't care about even school representation in groups a random order is sufficient

    while (!_.isEmpty(students)) {
      students.splice(0, groupsCount)
        .forEach((student: StudentUser, index: number) => {
          studentGroups[index].push(student)
          studentGroups[index] = _.shuffle(studentGroups[index])
        })
    }
    newGroups = studentGroups.map(value => {
      const schools = value.map(student => student.schoolName)
      return new Group(value, (differentSchoolsMode ? (schools.length === _.uniq(schools).length) : true) &&
        (parseInt(this.state.groupSize!!) === value.length))
    })
    return _.shuffle(newGroups)
  }

  handleRandomGroupsCreate () {
    this.setState({ groups: this.generateGroupsFromState(), students: [] })
  }

  removeGroup (groupId: number) {
    this.setState((oldState: TState) => {
      let newGroups = new Array(...oldState.groups)
      const newStudents = new Array(...oldState.students)
      newStudents.push(...oldState.groups[groupId].students)
      newGroups.splice(groupId, 1)
      return { groups: newGroups, students: newStudents }
    })
  }

  removeAll () {
    this.setState((oldState: TState) => {
      let newGroups: StudentUser[][] = []
      const newStudents = new Array(...oldState.students)
      oldState.groups.forEach((value, index) => newStudents.push(...value.students))
      return { groups: newGroups, students: newStudents }
    })
  }

  handleStartSession () {
    const sessionsToCreate = {
      taskId: this.state.selectedTaskId,
      classSessionId: this.props.classSessionId,
      groups: this.state.groups.map(group => group.students.map(student => student.id))
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
    const iconClass = mergeStyles({
      fontSize: 50,
      height: 50,
      width: 50,
      margin: '0 25px',
    })
    return (
      <div>
        <Stack tokens={stackTokens}>
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
              <Stack tokens={stackTokens}>
                <Stack horizontal wrap tokens={columnTokens} horizontalAlign={'space-between'}>
                  <Text variant='xxLarge'>
                    Grupy:
                  </Text>
                  {this.state.groups.length !== 0
                    ? <DefaultButton
                      onClick={() => this.removeAll()}>
                      Usuń wszystkie
                    </DefaultButton> : <span/>}
                </Stack>
                {this.state.groups.map((group, groupId) => (
                  <Stack tokens={stackTokens} key={groupId}>
                    <Stack horizontal wrap tokens={columnTokens}>
                      <Text variant='xLarge'>Grupa {groupId + 1}</Text>
                      <IconButton iconProps={{ iconName: 'ChromeClose' }} onClick={() => this.removeGroup(groupId)}/>
                      {group.passRequirements ? <span/> : <MessageBar
                        messageBarType={MessageBarType.warning}
                        isMultiline={false}
                      >Grupa nie spełnia wymaganych kryteriów
                      </MessageBar>}
                    </Stack>
                    <Stack horizontal wrap tokens={columnTokens}>
                      {group.students.map((student, studentId) => (
                        <Stack.Item key={studentId}>
                          <StudentCard key={studentId} student={student}/>
                        </Stack.Item>
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack>
      </div>
    )
  }
}

export default TaskSessionCreator

import React from 'react'
import { Button, Columns, Dropdown, Heading, Level } from 'react-bulma-components'
import { Checkbox, Control, Field, Input } from 'react-bulma-components/lib/components/form'
import StudentCard from './StudentCard'
import Student from '../../model/Student'
import _ from 'lodash'
import { Task } from '../../model/Task'
import api from '../../util/api'
import TaskSessionModel from '../../model/TaskSessionModel'
import { mockStudents, mockTaskSessions } from '../../util/mock'

type TState = {
  students: Student[]
  selectedStudents: Map<Student, boolean>
  groups: Student[][]
  differentSchoolsMode: boolean,
  groupSize: number,
  tasks: Task[],
  selectedTask: Task | null
}

type TProps = {
  onSessionCreate: (taskGroups: TaskSessionModel[]) => void
}

class TaskSessionCreator extends React.Component<TProps> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleGroupCreate = this.handleGroupCreate.bind(this)
    this.handleRandomGroupsCreate = this.handleRandomGroupsCreate.bind(this)
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.handleStartSession = this.handleStartSession.bind(this)

    this.state = {
      students: mockStudents,
      selectedStudents: new Map<Student, boolean>(),
      groups: [],
      differentSchoolsMode: false,
      groupSize: 0,
      tasks: [],
      selectedTask: null
    }
  }

  onCheckboxChange (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.checked })
  }

  onInputChange (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.value })
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
    const groupsCount = _.ceil(this.state.students.length / groupSize)
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
      taskId: this.state.selectedTask?.id,
      groups: this.state.groups.map(group => group.map(student => student.id))
    }
    api.post('/sessions/create', sessionsToCreate)
      .then((response) => this.props.onSessionCreate(response.data.groups))
      .catch(() => this.props.onSessionCreate(mockTaskSessions))
  }

  componentDidMount () {
    api.get('/tasks')
      .then(response => this.setState({ tasks: response.data }))
  }

  render () {
    return (
      <div className='page'>
        <Level renderAs="nav">
          <Level.Side align="left">
            <Level.Item>
              <Button onClick={this.handleGroupCreate}>
                Utwórz grupę
              </Button>
            </Level.Item>
            <Level.Item>
              <Control>
                <Button onClick={this.handleRandomGroupsCreate}>
                  Losuj grupy
                </Button>
              </Control>
            </Level.Item>
            <Level.Item>
              <Control>
                <Input
                  type="number"
                  placeholder="Rozmiar grupy"
                  name="groupSize"
                  value={this.state.groupSize}
                  onChange={this.onInputChange}/>
              </Control>
            </Level.Item>
            <Level.Item>
              <Control>
                <Checkbox
                  name="differentSchoolsMode"
                  onChange={this.onCheckboxChange}
                  checked={this.state.differentSchoolsMode}
                >
                  Różne szkoły w grupie
                </Checkbox>
              </Control>
            </Level.Item>
          </Level.Side>
          <Level.Side align="right">
            <Level.Item>
              <Field>
                <Control>
                  <Dropdown
                    name="type"
                    onChange={(task: string) => this.setState({ selectedTask: task })}
                    label={
                      this.state.selectedTask?.name ?? 'Zadanie'
                    }
                  >
                    {this.state.tasks.map((item) => (
                      <Dropdown.Item key={item.id} value={item}>
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </Control>
              </Field>
            </Level.Item>
            <Level.Item>
              <Button className="is-primary" onClick={this.handleStartSession}>
                Rozpocznij sesję zadań
              </Button>
            </Level.Item>
          </Level.Side>
        </Level>
        <Columns >
          <Columns.Column size={6} className='flex-column'>
            <Heading>
              Uczniowie:
            </Heading>
            <Columns>
              {this.state.students.map((student, id) => {
                const selected = this.state.selectedStudents.get(student)
                return (
                  <Columns.Column key={id} size={2}>
                    <StudentCard key={id} selectEvent={() => this.handleSelection(student)} selected={selected} student={student}/>
                  </Columns.Column>
                )
              })}
            </Columns>
          </Columns.Column>
          <Columns.Column size={6}>

            <Heading>
              Grupy:
            </Heading>
            {this.state.groups.map((group, groupId) => (
              <div key={groupId}>
                <Heading size={4}>Group {groupId + 1}</Heading>
                <Columns>
                  {group.map((student, studentId) => (
                    <Columns.Column key={studentId} size={2}>
                      <StudentCard key={studentId} student={student}/>
                    </Columns.Column>
                  ))}
                </Columns>
              </div>
            ))}
          </Columns.Column>
        </Columns>
      </div>
    )
  }
}

export default TaskSessionCreator

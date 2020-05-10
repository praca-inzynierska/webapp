import React, { ComponentProps } from 'react'
import { Columns, Button, Heading, Level } from 'react-bulma-components'
import {
  Checkbox,
  Control,
  Input,
} from 'react-bulma-components/lib/components/form'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import StudentCard from './StudentCard'
import Student from '../../model/Student'
import _ from 'lodash'

type TState = {
  selected: boolean[]
  students: Student[]
  groups: Student[][]
  differentSchoolsMode: boolean,
  groupSize: number
}

class SessionCreator extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleGroupCreate = this.handleGroupCreate.bind(this)
    this.handleRandomGroupsCreate = this.handleRandomGroupsCreate.bind(this)
    this.onModeChange = this.onModeChange.bind(this)
    this.onSizeChange = this.onSizeChange.bind(this)

    this.state = {
      selected: [
        false,
        false,
        true,
        true
      ],
      students: [
        {
          name: 'Paweł Pięta',
          id: 1,
          school: '1 LO'
        },
        {
          name: 'Wojtek Wąsik',
          id: 2,
          school: '1 LO'
        },
        {
          name: 'Alicja Amarant',
          id: 3,
          school: '1 LO'
        },
        {
          name: 'Daniel Dębski',
          id: 4,
          school: '1 LO'
        },
      ],
      groups: [],
      differentSchoolsMode: false,
      groupSize: 0
    }
  }

  onModeChange (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.checked })
  }

  onSizeChange (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSelection (id: number) {
    this.setState((prevState: any) => {
      const newSelected = { ...prevState.selected }
      newSelected[id] = !newSelected[id]
      return { selected: newSelected }
    })
  }

  handleGroupCreate (event: any) {
    console.log(event)
    this.setState((prevState: any) => {
      const newGroups: Student[][] = Object.create(prevState.groups)
      let newSelected: boolean[] = Object.create(prevState.selected)
      const newGroup: Student[] = []
      newSelected.forEach((selected, index) => {
        if (selected) {
          newGroup.push(prevState.students[index])
        }
      })
      newSelected = []
      newGroups.push(newGroup)
      return { groups: newGroups, selected: newSelected }
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
      students.splice(0, groupSize)
        .forEach((student: Student, index: number) => {
          newGroups[index].push(student)
        })
    }
    return newGroups
  }

  handleRandomGroupsCreate () {
    this.setState({ groups: this.generateGroupsFromState() })
  }

  render () {
    return (
      <div>
        <Heading>
          Uczniowie:
        </Heading>
        <Columns>
          {this.state.students.map((student, id) => (
            <Columns.Column key={id} size={2}>
              <StudentCard key={id} selectEvent={() => this.handleSelection(id)} selected={this.state.selected[id]}
                student={student}/>
            </Columns.Column>
          ))}
        </Columns>

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
                  onChange={this.onSizeChange}/>
              </Control>
            </Level.Item>
            <Level.Item>
              <Control>
                <Checkbox
                  name="differentSchoolsMode"
                  onChange={this.onModeChange}
                  checked={this.state.differentSchoolsMode}
                >
                  Różne szkoły w grupie
                </Checkbox>
              </Control>
            </Level.Item>
          </Level.Side>
        </Level>
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
      </div>
    )
  }
}

const actionCreators = {}

const component = connect(
  null,
  actionCreators
)(SessionCreator)

export default withRouter(component)

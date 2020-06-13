import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import { mockStudents } from '../../util/mock'
import Student from '../../model/Student'
import SchoolClass from '../../model/SchoolClass'
import _ from 'lodash'
import { Button, Columns, Container, Heading, Level } from 'react-bulma-components'
import SchoolClassCard from './SchoolClassCard'
import api from '../../util/api'

type TState = {
  students: Student[]
  chosenSchoolClasses: Map<SchoolClass, boolean>
  schoolClasses: SchoolClass[]
  from: number
  to: number
}

class ClassSessionCreator extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleSessionCreate = this.handleSessionCreate.bind(this)

    this.state = {
      chosenSchoolClasses: new Map<SchoolClass, boolean>(),
      students: mockStudents,
      schoolClasses: [],
      from: new Date().valueOf(),
      to: new Date().valueOf()
    }
  }

  componentDidMount () {
    const studentsCopy = Array.from(this.state.students)
    const map: Map<Object, SchoolClass> = new Map()
    studentsCopy.forEach(student => map.set((
      `${student.school}${student.schoolClass}`), new SchoolClass(
      student.school,
      student.schoolClass,
      studentsCopy.filter(it =>
        it.school === student.school &&
          it.schoolClass === student.schoolClass))))
    const newSchoolClasses = Array.from(map.values())
    this.setState({ schoolClasses: _.uniq(newSchoolClasses) })
  }

  handleSelection (schoolClass: SchoolClass) {
    this.setState((prevState: any) => {
      const newSelected: Map<SchoolClass, boolean> = new Map<SchoolClass, boolean>(prevState.chosenSchoolClasses)
      const newSchoolClasses = Array.from(this.state.schoolClasses)
      newSelected.set(schoolClass, !newSelected.get(schoolClass))
      _.remove(newSchoolClasses, (sc) => sc === schoolClass)
      return { chosenSchoolClasses: newSelected, schoolClasses: newSchoolClasses }
    })
  }

  handleSessionCreate () {
    const studentsToInclude = Array.from(this.state.chosenSchoolClasses.keys()).map(sc =>
      this.state.students.filter(student =>
        student.schoolClass === sc.classNumber && student.school === sc.school)
        .map(student => student.id)
    ).flat()
    const headers = {
      'Content-Type': 'application/json',
    }
    const data = {
      students: studentsToInclude,
      startDate: this.state.from,
      endDate: this.state.to
    }
    api.post('/classSessions/create', data, {
      headers: headers
    })
  }

  render () {
    return (
      <div className='page'>
        <Container>
          <Heading size={1}>
          Tworzenie sesji zajęć
          </Heading>
          <Level renderAs="nav">
            <Level.Side align="left">
              <Level.Item>
                <Button onClick={this.handleSessionCreate}>
                  Utwórz sesję
                </Button>
              </Level.Item>
            </Level.Side>
          </Level>
          <Columns>
            <Columns.Column size={6} className='flex-column'>
              <Heading>
              Klasy do wyboru:
              </Heading>
              <Columns>
                {this.state.schoolClasses.map((schoolClass, id) => {
                  return (
                    <Columns.Column key={id} size={2}>
                      <SchoolClassCard selectEvent={() => this.handleSelection(schoolClass)} schoolClass={schoolClass}/>
                    </Columns.Column>
                  )
                })}
              </Columns>
            </Columns.Column>
            <Columns.Column size={6} className='flex-column'>
              <Heading>
              Wybrane klasy:
              </Heading>
              <Columns>
                {Array.from(this.state.chosenSchoolClasses.entries())
                  .filter(it => it[1])
                  .map(schoolClassEntry => schoolClassEntry[0])
                  .map((schoolClass, index) => (
                    <Columns.Column key={index} size={2}>
                      <SchoolClassCard schoolClass={schoolClass}/>
                    </Columns.Column>
                  ))}
              </Columns>
            </Columns.Column>
          </Columns>
        </Container>
      </div>
    )
  }
}

export default withRouter(ClassSessionCreator)

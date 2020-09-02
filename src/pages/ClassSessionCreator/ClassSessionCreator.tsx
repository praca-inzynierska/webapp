import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import Student from '../../model/Student'
import SchoolClass from '../../model/SchoolClass'
import _ from 'lodash'
import { Button, Columns, Container, Heading, Level } from 'react-bulma-components'
import SchoolClassCard from './SchoolClassCard'
import api from '../../util/api'
import School from '../../model/School'

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
      students: [],
      schoolClasses: [],
      from: new Date().valueOf(),
      to: new Date().valueOf()
    }
  }

  componentDidMount () {
    api.get('/school')
      .then(response => this.setState(() => {
        const schools: School[] = response.data.map((it: any) => School.fromResponse(it))
        const schoolClasses: SchoolClass[] = schools.reduce((acc: SchoolClass[], school: School) => acc.concat(school.classes), [])
        return { schoolClasses }
      }))
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
    const studentsToInclude = Array.from(this.state.chosenSchoolClasses.entries())
      .filter((value) => value[1])
      .map((value) => value[0].students)
      .flat()
      .map((it) => it.id)
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

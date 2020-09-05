import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import Student from '../../model/Student'
import SchoolClass from '../../model/SchoolClass'
import _ from 'lodash'
import SchoolClassCard from './SchoolClassCard'
import api from '../../util/api'
import School from '../../model/School'
import { PrimaryButton, Stack, Text } from 'office-ui-fabric-react'

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
    const stackTokens = { childrenGap: 10 }
    const stackStyles = {
      root: {
        width: '50%'
      }
    }
    return (
      <div className='page'>
        <Stack tokens={stackTokens}>
          <Text variant={'xxLargePlus'}> Tworzenie sesji zajęć </Text>
          <PrimaryButton onClick={this.handleSessionCreate}>
            Utwórz sesję
          </PrimaryButton>
          <Stack horizontal tokens={stackTokens}>
            <Stack.Item grow={1} styles={stackStyles}>
              <Stack tokens={stackTokens}>
                <Text variant={'xLarge'}>
                  Klasy do wyboru:
                </Text>
                <Stack horizontal wrap tokens={stackTokens}>
                  {this.state.schoolClasses.map((schoolClass, id) => {
                    return (
                      <SchoolClassCard key={id} selectEvent={() => this.handleSelection(schoolClass)}
                        schoolClass={schoolClass}/>
                    )
                  })}
                </Stack>
              </Stack>
            </Stack.Item>
            <Stack.Item grow={1} styles={stackStyles}>
              <Stack tokens={stackTokens}>
                <Text variant={'xLarge'}>
                  Wybrane klasy:
                </Text>
                <Stack horizontal wrap tokens={stackTokens} styles={stackStyles}>
                  {Array.from(this.state.chosenSchoolClasses.entries())
                    .filter(it => it[1])
                    .map(schoolClassEntry => schoolClassEntry[0])
                    .map((schoolClass, index) => (
                      <SchoolClassCard key={index} schoolClass={schoolClass}/>
                    ))}
                </Stack>
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack>
      </div>
    )
  }
}

export default withRouter(ClassSessionCreator)

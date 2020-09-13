import React, { ComponentProps, FormEvent } from 'react'
import { withRouter } from 'react-router'
import Student from '../../model/Student'
import SchoolClass from '../../model/SchoolClass'
import _ from 'lodash'
import SchoolClassCard from './SchoolClassCard'
import api from '../../util/api'
import School from '../../model/School'
import { PrimaryButton, Stack, Text, SpinButton, DatePicker, DayOfWeek } from 'office-ui-fabric-react'
import moment from 'moment'

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
    this.onDateChange = this.onDateChange.bind(this)
    this.onSpinButtonDecrement = this.onSpinButtonDecrement.bind(this)
    this.onSpinButtonIncrement = this.onSpinButtonIncrement.bind(this)
    this.onSpinButtonValidate = this.onSpinButtonValidate.bind(this)
    this.getTime = this.getTime.bind(this)
    this.onFromChange = this.onFromChange.bind(this)
    this.onToChange = this.onToChange.bind(this)
    this.formatDate = this.formatDate.bind(this)

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

  getTime (value: string) {
    return moment(value, ['h:m a', 'H:m'])
  }

  onFromChange (event: FormEvent<HTMLDivElement>) {
    const target = (event!.target as HTMLInputElement)
    const newTime = this.getTime(target.value)
    const newDate = moment(this.state.from)
    newDate.set('hours', newTime.hours())
    newDate.set('minutes', newTime.minutes())
    this.setState({ from: newDate.toDate().getTime() })
  }

  onToChange (event: FormEvent<HTMLDivElement>) {
    const target = (event!.target as HTMLInputElement)
    const newDate = moment(this.state.to)
    const newTime = this.getTime(target.value)
    newDate.set('hours', newTime.hours())
    newDate.set('minutes', newTime.minutes())
    this.setState({ to: newDate.toDate().getTime() })
  }

  onSpinButtonIncrement (value: string) {
    var time = this.getTime(value)
    time.add(15, 'minutes')
    return time.format('HH:mm')
  }

  onSpinButtonDecrement (value: string) {
    var time = this.getTime(value)
    time.subtract(15, 'minutes')
    return time.format('HH:mm')
  };

  onSpinButtonValidate (value: string) {
    var time = this.getTime(value)
    if (time.isValid()) {
      return time.format('HH:mm')
    } else return '00:00'
  };

  onDateChange (date: Date | null | undefined) {
    this.setState({ from: date?.getTime() })
  }

  formatDate (date?: Date): string {
    return moment(date).locale('pl').format('LL')
  }

  render () {
    const stackTokens = { childrenGap: 15 }
    const stackStyles = {
      root: {
        width: '50%'
      }
    }
    return (
      <div className='page'>
        <Stack tokens={stackTokens}>
          <Text variant={'xxLargePlus'}> Tworzenie sesji zajęć </Text>
          <Stack horizontal tokens={stackTokens}>
            <Stack.Item shrink={2}>
              <DatePicker
                firstDayOfWeek={DayOfWeek.Monday}
                placeholder="Wybierz datę"
                onSelectDate={this.onDateChange}
                formatDate={this.formatDate}
              />
            </Stack.Item>
            <Stack.Item shrink={1}>
              <SpinButton
                label={'Od'}
                value={'08:00'}
                onValidate={this.onSpinButtonValidate}
                onIncrement={this.onSpinButtonIncrement}
                onDecrement={this.onSpinButtonDecrement}
                onBlur={this.onFromChange}
              />
            </Stack.Item>
            <Stack.Item shrink={1}>
              <SpinButton
                label={'Do'}
                value={'09:00'}
                onValidate={this.onSpinButtonValidate}
                onIncrement={this.onSpinButtonIncrement}
                onDecrement={this.onSpinButtonDecrement}
                onBlur={this.onToChange}
              />
            </Stack.Item>
            <Stack.Item>
              <PrimaryButton onClick={this.handleSessionCreate}>
              Utwórz sesję
              </PrimaryButton>
            </Stack.Item>
          </Stack>
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

import React, { ComponentProps, FormEvent } from 'react'
import { withRouter } from 'react-router'
import Student from '../../model/Student'
import SchoolClass from '../../model/SchoolClass'
import { notify } from 'react-notify-toast'
import SchoolClassCard from './SchoolClassCard'
import api from '../../util/api'
import School from '../../model/School'
import { DatePicker, DayOfWeek, PrimaryButton, SpinButton, Stack, Text } from 'office-ui-fabric-react'
import moment from 'moment'
import ClassSessionModel from '../../model/ClassSessionModel'

type TState = {
  students: Student[]
  chosenSchoolClasses: Map<SchoolClass, boolean>
  schoolClasses: SchoolClass[]
  from: number
  to: number
}

type TProps = ComponentProps<any> & {
  classSessionId: number
}

class ClassSessionCreator extends React.Component<TProps> {
  readonly state: TState

  constructor (props: TProps) {
    super(props)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleSessionCreate = this.handleSessionCreate.bind(this)
    this.handleSessionDelete = this.handleSessionDelete.bind(this)
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
      from: 0,
      to: 0
    }
  }

  componentDidMount () {
    api.get('/school')
      .then(response => this.setState(() => {
        const schools: School[] = response.data.map((it: any) => School.fromResponse(it))
        const schoolClasses: SchoolClass[] = schools.reduce((acc: SchoolClass[], school: School) => acc.concat(school.classes), [])
        return { schoolClasses }
      }))
      .then(() => {
        this.setState(() => {
          const newChosenSchoolClasses = this.state.chosenSchoolClasses
          this.state.schoolClasses.forEach((schoolClass) => {
            newChosenSchoolClasses.set(schoolClass, false)
          })
          return { chosenSchoolClasses: newChosenSchoolClasses }
        })
        if (this.props.match.params.classSessionId != null) {
          api.get(`/classSessions/${this.props.match.params.classSessionId}`)
            .then(response => this.setState(() => {
              const classSession: ClassSessionModel = response.data
              const studentsMap = new Map<number, SchoolClass>()
              const chosenSchoolClasses = this.state.chosenSchoolClasses
              this.state.schoolClasses.forEach((schoolClass) => {
                schoolClass.students.forEach(student => studentsMap.set(student.id, schoolClass))
              })
              response.data.students
                .map((value: Student) => studentsMap.get(value.id))
                .forEach((value: SchoolClass) => chosenSchoolClasses.set(value, true))
              return {
                from: classSession.startDate,
                to: classSession.endDate,
                students: classSession.students,
                chosenSchoolClasses: chosenSchoolClasses
              }
            }))
        }
      })
  }

  handleSelection (schoolClass: SchoolClass) {
    this.setState((prevState: any) => {
      const newSelected: Map<SchoolClass, boolean> = new Map<SchoolClass, boolean>(prevState.chosenSchoolClasses)
      newSelected.set(schoolClass, !newSelected.get(schoolClass))
      return { chosenSchoolClasses: newSelected }
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
    const classSessionId = this.props.match.params.classSessionId
    api.post(`/classSessions/${(classSessionId != null) ? 'edit/123' : 'create'}`, data, {
      headers: headers
    })
      .then(response => {
        notify.show('Sesja zadań zapisana pomyślnie', 'success')
        this.props.history.push(`/classSession/${response.data.id}`)
      })
  }

  handleSessionDelete () {
    const classSessionId = this.props.match.params.classSessionId
    api.get(`/classSessions/delete/${classSessionId}`)
      .then(() => {
        notify.show('Sesja zadań usunięta pomyślnie', 'success')
        this.props.history.push('/home')
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
  }

  onSpinButtonValidate (value: string) {
    var time = this.getTime(value)
    if (time.isValid()) {
      return time.format('HH:mm')
    } else return '00:00'
  }

  onDateChange (date: Date | null | undefined) {
    const newFrom = new Date(this.state.from)
    const newTo = new Date(this.state.to)
    newFrom.setFullYear(date?.getUTCFullYear()!!, date?.getMonth(), date?.getDate())
    newTo.setFullYear(date?.getUTCFullYear()!!, date?.getMonth(), date?.getDate())
    this.setState({ from: newFrom.getTime(), to: newTo.getTime() })
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
          <Text variant={'xxLargePlus'}> Tworzenie/edycja sesji zajęć </Text>
          <Stack horizontal tokens={stackTokens}>
            <Stack.Item shrink={2}>
              <DatePicker
                firstDayOfWeek={DayOfWeek.Monday}
                placeholder="Wybierz datę"
                onSelectDate={this.onDateChange}
                formatDate={this.formatDate}
                value={moment(this.state.to).toDate()}
              />
            </Stack.Item>
            <Stack.Item shrink={1}>
              <SpinButton
                label={'Od'}
                value={moment(this.state.from).format('HH:mm')}
                onValidate={this.onSpinButtonValidate}
                onIncrement={this.onSpinButtonIncrement}
                onDecrement={this.onSpinButtonDecrement}
                onBlur={this.onFromChange}
              />
            </Stack.Item>
            <Stack.Item shrink={1}>
              <SpinButton
                label={'Do'}
                value={moment(this.state.to).format('HH:mm')}
                onValidate={this.onSpinButtonValidate}
                onIncrement={this.onSpinButtonIncrement}
                onDecrement={this.onSpinButtonDecrement}
                onBlur={this.onToChange}
              />
            </Stack.Item>
            <Stack.Item>
              <PrimaryButton onClick={this.handleSessionCreate}>
                Zapisz sesję
              </PrimaryButton>
            </Stack.Item>
            <Stack.Item>
              <PrimaryButton onClick={this.handleSessionDelete}>
                Usuń sesję
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
                  {Array.from(this.state.chosenSchoolClasses.entries())
                    .filter(it => !it[1])
                    .map(schoolClassEntry => schoolClassEntry[0])
                    .map((schoolClass, index) => (
                      <SchoolClassCard key={index} schoolClass={schoolClass}
                        selectEvent={() => this.handleSelection(schoolClass)}/>
                    ))}
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
                      <SchoolClassCard key={index} schoolClass={schoolClass}
                        selectEvent={() => this.handleSelection(schoolClass)}/>
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

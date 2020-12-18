import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import ClassSessionModel from '../../model/ClassSessionModel'
import api from '../../util/api'
import { DefaultButton, DetailsList, IColumn, PrimaryButton, Stack, Text } from 'office-ui-fabric-react'
import moment from 'moment'
import Teacher from '../../model/Teacher'
import TaskSessionModel from '../../model/TaskSessionModel'
import 'moment/locale/pl'
import { connect } from 'react-redux'

type TState = {
  classSessions: IClassSessionListItem[]
  taskSessions: ITaskSessionListItem[]
}

type TProps = ComponentProps<any> & {
  isTeacher: boolean
}

interface IClassSessionListItem {
  id: number;
  key: number;
  from: string;
  to: string;
  students: string;
  teacher: string;
}

interface ITaskSessionListItem {
  id: number;
  key: number;
  taskName: string;
  deadline: string;
  timeLeft: string;
}

class HomePage extends React.Component<TProps> {
  readonly state: TState
  private readonly _columns: IColumn[]
  private readonly _taskSessionsColumns: IColumn[]

  constructor (props: any) {
    super(props)
    this.openSessionCreator = this.openSessionCreator.bind(this)
    this.openSession = this.openSession.bind(this)
    this.openTaskSession = this.openTaskSession.bind(this)
    this.state = {
      taskSessions: [],
      classSessions: []
    }
    this._columns = [
      { key: 'column1', name: '#', fieldName: 'key', minWidth: 25, maxWidth: 25, isResizable: false },
      { key: 'column2', name: 'Od', fieldName: 'from', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column3', name: 'Do', fieldName: 'to', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column4', name: 'Uczniowie', fieldName: 'students', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column5', name: 'Nauczyciel', fieldName: 'teacher', minWidth: 100, maxWidth: 200, isResizable: true },
      {
        key: 'column6',
        name: '',
        fieldName: '',
        minWidth: 200,
        maxWidth: 200,
        onRender: (item: IClassSessionListItem) => {
          return <Stack horizontal tokens={{
            childrenGap: 15,
          }}>
            <DefaultButton onClick={() => this.openSession(item.id)}>Otwórz</DefaultButton>
            {this.props.isTeacher ? <DefaultButton onClick={() => this.editSession(item.id)}>Edytuj</DefaultButton>
              : <div/>}
          </Stack>
        },
      },
    ]
    this._taskSessionsColumns = [

      { key: 'column1', name: '#', fieldName: 'key', minWidth: 25, maxWidth: 25, isResizable: false },
      { key: 'column2', name: 'Nazwa', fieldName: 'taskName', minWidth: 100, maxWidth: 200, isResizable: true },
      {
        key: 'column3',
        name: 'Termin zakończenia',
        fieldName: 'deadline',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },
      { key: 'column4', name: 'Pozostało', fieldName: 'timeLeft', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column5', name: '', fieldName: '', minWidth: 200, maxWidth: 200, isResizable: true },
      {
        key: 'column6',
        name: '',
        fieldName: '',
        minWidth: 200,
        maxWidth: 200,
        isPadded: true,
        onRender: (item: ITaskSessionListItem) => {
          return <div>
            <DefaultButton onClick={() => this.openTaskSession(item.id)}>Otwórz</DefaultButton>
          </div>
        },
      },
    ]
  }

  componentDidMount () {
    api.get('/classSessions')
      .then(response => {
        const newClassSessions: ClassSessionModel[] = response.data.map((item: any) => ClassSessionModel.fromResponse(item))
        this.setState({
          classSessions: newClassSessions
            // .filter(it => moment(it.endDate).isBefore(Date.now()))
            .map((it, index) => (
              {
                id: it.id,
                key: index,
                from: moment(it.startDate).format('LLLL'),
                to: moment(it.endDate).format('LLLL'),
                students: `${it.students.length} uczniów`,
                teacher: `${(it.teacher as Teacher).user.firstName} ${(it.teacher as Teacher).user.lastName}`,
              }
            )
            )
        })
      })
    api.get('/taskSessions')
      .then(response => {
        const newTaskSessions: TaskSessionModel[] = response.data.map((item: any) => TaskSessionModel.fromResponse(item))
        this.setState({
          taskSessions: newTaskSessions
            .filter(it => moment(it.deadline).isAfter(Date.now()))
            .map((it, index) => (
              {
                id: it.id,
                key: index,
                taskName: it.task.name,
                deadLine: moment(it.deadline).format('LLLL'),
                timeLeft: moment(it.deadline).locale('pl').fromNow()
              }
            )
            )
        })
      })
  }

  openSession (id: number) {
    this.props.history.push(`/classSession/${id}`)
  }

  openTaskSession (id: number) {
    this.props.history.push(`/taskSession/${id}`)
  }

  editSession (id: number) {
    this.props.history.push(`/classSession/edit/${id}`)
  }

  openSessionCreator () {
    this.props.history.push('/classSession/new')
  }

  render () {
    const stackTokens = {
      childrenGap: 15,
    }

    return (
      <div className='page'>
        <Stack horizontal tokens={stackTokens} horizontalAlign={'space-between'}>
          <Text variant={'xxLargePlus'}> Sesje zajęć</Text>
          {this.props.isTeacher ? <Stack.Item>
            <PrimaryButton onClick={this.openSessionCreator}>
              Dodaj nową sesję zajęć
            </PrimaryButton>
          </Stack.Item> : <div/>}
        </Stack>
        <DetailsList
          items={this.state.classSessions}
          columns={this._columns}
        />

        <Text variant={'xxLargePlus'}> Sesje zadań</Text>
        <DetailsList
          items={this.state.taskSessions}
          columns={this._taskSessionsColumns}
        />
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isTeacher: state.auth.isTeacher
})

const component = connect(
  mapStateToProps,
)(HomePage)

export default withRouter(component)

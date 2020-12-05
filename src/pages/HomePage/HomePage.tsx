import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import ClassSessionModel from '../../model/ClassSessionModel'
import api from '../../util/api'
import { DefaultButton, DetailsList, IColumn, PrimaryButton, Text } from 'office-ui-fabric-react'
import moment from 'moment'
import Teacher from '../../model/Teacher'

type TState = {
  classSessions: IClassSessionListItem[]
}

interface IClassSessionListItem {
  id: number;
  key: number;
  from: string;
  to: string;
  students: string;
  teacher: string;
}

class HomePage extends React.Component<ComponentProps<any>> {
  readonly state: TState
  private _allItems: IClassSessionListItem[] = []
  private _columns: IColumn[]

  constructor (props: any) {
    super(props)
    this.openSessionCreator = this.openSessionCreator.bind(this)
    this.openSession = this.openSession.bind(this)
    this.state = {
      classSessions: []
    }
    this._columns = [
      { key: 'column1', name: '#', fieldName: 'key', minWidth: 25, maxWidth: 25, isResizable: false },
      { key: 'column2', name: 'Od', fieldName: 'from', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column3', name: 'Do', fieldName: 'to', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column4', name: 'Uczniowie', fieldName: 'students', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column5', name: 'Nauczyciel', fieldName: 'teacher', minWidth: 100, isResizable: true },
      {
        key: 'column6',
        name: '',
        fieldName: '',
        minWidth: 200,
        isResizable: true,
        onRender: (item: IClassSessionListItem) => {
          return <div>
            <DefaultButton onClick={() => this.openSession(item.id)}>Otwórz</DefaultButton>
            <DefaultButton onClick={() => this.editSession(item.id)}>Edytuj</DefaultButton>
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
          classSessions: newClassSessions.map((it, index) => (
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
  }

  openSession (id: number) {
    this.props.history.push(`/classSession/${id}`)
  }

  editSession (id: number) {
    this.props.history.push(`/classSession/edit/${id}`)
  }

  openSessionCreator () {
    this.props.history.push('/classSession/new')
  }

  render () {
    return (
      <div className='page'>
        <Text variant={'xxLargePlus'}> Sesje zajęć</Text>
        <DetailsList
          items={this.state.classSessions}
          columns={this._columns}
        />
        <PrimaryButton onClick={this.openSessionCreator}>
          Dodaj nową sesję zajęć
        </PrimaryButton>
      </div>
    )
  }
}

export default withRouter(HomePage)

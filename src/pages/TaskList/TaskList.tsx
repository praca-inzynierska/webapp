import React, { ComponentProps } from 'react'
import '../../index.css'
import { DefaultButton, DetailsList, IColumn, PrimaryButton, Text } from 'office-ui-fabric-react'
import { Task, TaskType } from '../../model/Task'
import api from '../../util/api'
import { withRouter } from 'react-router'

type TState = {
  [key: string]: any;
  tasks: ITaskListItem[]
};

interface ITaskListItem {
  id: string | null;
  key: number;
  name: string;
  type: string;
  time: string;
}

class TaskList extends React.Component<ComponentProps<any>> {
  readonly state: TState
  private _allItems: ITaskListItem[]
  private _columns: IColumn[]

  constructor (props: any) {
    super(props)
    this.editTask = this.editTask.bind(this)
    this.createTask = this.createTask.bind(this)

    this._allItems = []

    this._columns = [
      { key: 'column1', name: '#', fieldName: 'key', minWidth: 25, maxWidth: 25, isResizable: false },
      { key: 'column2', name: 'Tytuł', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column3', name: 'Typ', fieldName: 'type', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column4', name: 'Czas', fieldName: 'time', minWidth: 100, isResizable: true },
      {
        key: 'column5',
        name: '',
        fieldName: 'time',
        minWidth: 100,
        isResizable: true,
        onRender: (item: ITaskListItem) => {
          return <DefaultButton onClick={() => this.editTask(item.id)}>Edytuj</DefaultButton>
        },
      },
    ]

    this.state = {
      tasks: []
    }
  }

  componentDidMount () {
    api.get('/tasks')
      .then((response) => response.data)
      .then((tasks: Task[]) => this.setState({
        tasks: tasks.map((it, index) => (
          {
            key: index,
            id: it.id,
            name: it.name,
            type: TaskType.taskTypes.findByKey('id', it.type).name,
            time: `${it.minutes} minut`
          }
        )
        )
      }))
  }

  editTask (id: string | null) {
    const { history } = this.props
    history.push(`/task/${id}`)
  }

  createTask () {
    const { history } = this.props
    history.push('/task/')
  }

  render () {
    return (
      <div className="page">
        <Text variant={'xxLargePlus'}>Zadania</Text>
        <DetailsList
          items={this.state.tasks}
          columns={this._columns}
        />

        <PrimaryButton onClick={this.createTask}>
          Dodaj nowe zadanie
        </PrimaryButton>
      </div>
    )
  }
}

export default withRouter(TaskList)

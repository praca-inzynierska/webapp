import React, { ComponentProps } from 'react'
import '../../index.css'
import { DefaultButton, DetailsList, IColumn, PrimaryButton, Text } from 'office-ui-fabric-react'
import { Task } from '../../model/Task'
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
      // tasks: [
      //   {
      //     id: '1',
      //     subject: 'Matematyka',
      //     name: 'Zadanie 1',
      //     description: 'Opis zadania 1', // to chyba niepotrzebne
      //     type: 'test',
      //     tools: ['whiteboard', 'textChat'], // to tez
      //     minutes: 20,
      //   },
      //   {
      //     id: '1',
      //     subject: 'Matematyka',
      //     name: 'Zadanie 1',
      //     description: 'Opis zadania 1', // to chyba niepotrzebne
      //     type: 'test',
      //     tools: ['whiteboard', 'textChat'], // to tez
      //     minutes: 20,
      //   },
      //   {
      //     id: 3,
      //     subject: 'Matematyka',
      //     name: 'Zadanie 1',
      //     description: 'Opis zadania 1', // to chyba niepotrzebne
      //     type: 'test',
      //     tools: ['whiteboard', 'textChat'], // to tez
      //     minutes: 20,
      //   },
      //   {
      //     id: 4,
      //     subject: 'Matematyka',
      //     name: 'Zadanie 1',
      //     description: 'Opis zadania 1', // to chyba niepotrzebne
      //     type: 'test',
      //     tools: ['whiteboard', 'textChat'], // to tez
      //     minutes: 20,
      //   },
      // ].map(taskResponseMock => Task.fromResponse(taskResponseMock))
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
            type: it.type,
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
          // setKey="set"
          // layoutMode={DetailsListLayoutMode.justified}
          // selection={this._selection}
          // selectionPreservedOnEmptyClick={true}
          // ariaLabelForSelectionColumn="Toggle selection"
          // ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          // checkButtonAriaLabel="Row checkbox"
          // onItemInvoked={this._onItemInvoked}
        />
        {/* <Table> */}
        {/*  <thead> */}
        {/*  <tr> */}
        {/*    <th>Tytuł</th> */}
        {/*    <th>Przedmiot</th> */}
        {/*    <th>Typ</th> */}
        {/*    <th>Czas trwania</th> */}
        {/*    <th>Działania</th> */}
        {/*  </tr> */}
        {/*  </thead> */}
        {/*  <tfoot> */}
        {/*  <tr> */}
        {/*    <th>Tytuł</th> */}
        {/*    <th>Przedmiot</th> */}
        {/*    <th>Typ</th> */}
        {/*    <th>Czas trwania</th> */}
        {/*    <th>Działania</th> */}
        {/*  </tr> */}
        {/*  </tfoot> */}
        {/*  <tbody> */}
        {/*  {state.tasks.map((task, key) => ( */}
        {/*    <tr key={key}> */}
        {/*      <td> */}
        {/*        {task.id} {task.name} */}
        {/*      </td> */}
        {/*      <td>{task.subject}</td> */}
        {/*      <td>{task.type}</td> */}
        {/*      <td>{task.minutes} minut</td> */}
        {/*      <td> */}
        {/*        <Button color="info" onClick={() => this.editTask(task.id)}> */}
        {/*          Edytuj */}
        {/*        </Button> */}
        {/*      </td> */}
        {/*    </tr> */}
        {/*  ))} */}
        {/*  </tbody> */}
        {/* </Table> */}

        <PrimaryButton onClick={this.createTask}>
          Dodaj nowe zadanie
        </PrimaryButton>
      </div>
    )
  }
}

export default withRouter(TaskList)

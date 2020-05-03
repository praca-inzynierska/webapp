import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import '../../index.css'
import { Button, Heading, Table, Box } from 'react-bulma-components'
import { Task } from '../../model/Task'

type TState = {
  [key: string]: any;
  data: Task[]
};

class TaskList extends React.Component<ComponentProps<any>> {
  readonly state: TState
  constructor (props: any) {
    super(props)
    this.editTask = this.editTask.bind(this)
    this.createTask = this.createTask.bind(this)
    this.state = {
      data: [
        {
          id: '1',
          subject: 'Matematyka',
          name: 'Zadanie 1',
          description: 'Opis zadania 1', // to chyba niepotrzebne
          type: 'test',
          tools: ['whiteboard', 'textChat'], // to tez
          minutes: 20,
        },
        {
          id: '1',
          subject: 'Matematyka',
          name: 'Zadanie 1',
          description: 'Opis zadania 1', // to chyba niepotrzebne
          type: 'test',
          tools: ['whiteboard', 'textChat'], // to tez
          minutes: 20,
        },
        {
          id: 3,
          subject: 'Matematyka',
          name: 'Zadanie 1',
          description: 'Opis zadania 1', // to chyba niepotrzebne
          type: 'test',
          tools: ['whiteboard', 'textChat'], // to tez
          minutes: 20,
        },
        {
          id: 4,
          subject: 'Matematyka',
          name: 'Zadanie 1',
          description: 'Opis zadania 1', // to chyba niepotrzebne
          type: 'test',
          tools: ['whiteboard', 'textChat'], // to tez
          minutes: 20,
        },
      ].map(taskResponseMock => Task.fromResponse(taskResponseMock))
    }
  }

  componentDidMount () {
    const requestOptions = {
      method: 'GET',
    }
    fetch('http://localhost:8080/tasks', requestOptions)
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then((data) => this.setState({ data }))
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
    const { state } = this
    return (
      <div className="mainBox">
        <Box>
          <Heading size={2}>Zadania</Heading>
        </Box>
        <Box>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </tfoot>
            <tbody>
              {state.data.map((task, key) => (
                <tr key={key}>
                  <td>
                    {task.id} {task.name}
                  </td>
                  <td>{task.subject}</td>
                  <td>{task.type}</td>
                  <td>{task.minutes} minutes</td>
                  <td>
                    <Button color="info" onClick={() => this.editTask(task.id)}>
                    Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
        <Box>
          <Button color="success" onClick={this.createTask}>
            Add new task
          </Button>
        </Box>
      </div>
    )
  }
}

export default withRouter(TaskList)

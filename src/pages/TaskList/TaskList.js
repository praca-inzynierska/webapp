import React from 'react';
import { withRouter } from 'react-router';
import '../../index.css';
import { Button, Heading, Table, Box } from 'react-bulma-components';

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          subject: 'Matematyka',
          name: 'Zadanie 1',
          description: 'Opis zadania 1', // to chyba niepotrzebne
          type: 'test',
          tools: ['whiteboard', 'textChat'], // to tez
          minutes: 20,
        },
        {
          id: 2,
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
      ],
    };
  }

  componentDidMount() {
    const requestOptions = {
      method: 'GET',
    };
    fetch('http://localhost:8080/tasks', requestOptions)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => this.setState({ data }));
  }

  editTask(id) {
    const { history } = this.props;
    history.push(`/task/${id}`);
  }

  createTask() {
    const { history } = this.props;
    history.push(`/task/`);
  }

  render() {
    const { state } = this;
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
              {state.data.map((task) => (
                <tr>
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
    );
  }
}

export default withRouter(TaskList);

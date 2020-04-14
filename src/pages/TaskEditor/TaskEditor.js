import React from 'react';
import { withRouter } from 'react-router';
import '../../index.css';
import {
  Control,
  Field,
  Input,
  Label,
  Textarea,
} from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';

class TaskEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.launchTask = this.launchTask.bind(this);
    this.state = {
      taskDescription: 'abc',
      taskName: '',
    };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.value);
  };

  launchTask = () => {
    const { history } = this.props;
    history.push('/session/');
  };

  render() {
    const { taskDescription, taskName } = this.state;
    return (
      <div className="mainBox">
        <Field>
          <Label>Tytuł zadania</Label>
          <Control>
            <Input
              onChange={this.onChange}
              name="taskName"
              placeholder="Wpisz tytuł zadania"
              value={taskName}
            />
          </Control>
        </Field>
        <Field>
          <Label>Opis zadania</Label>
          <Control>
            <Textarea
              onChange={this.onChange}
              name="taskDescription"
              placeholder="Wpisz opis zadania"
              value={taskDescription}
            />
          </Control>
        </Field>
        <Field kind="group">
          <Control>
            <Button color="primary">Save</Button>
          </Control>
          <Control>
            <Button onClick={this.launchTask}>Test</Button>
          </Control>
          <Control>
            <Button color="link">Cancel</Button>
          </Control>
        </Field>
      </div>
    );
  }
}

export default withRouter(TaskEditor);

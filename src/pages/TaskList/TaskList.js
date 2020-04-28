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
import { Heading } from 'react-bulma-components';

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.launchTask = this.launchTask.bind(this);
    this.state = {
      taskDescription: 'abc',
      taskName: '',
    };
  }

  render() {
    return (
      <div className="mainBox">
        <Box>
          <Heading size={2}>Zadania</Heading>
        </Box>
      </div>
    );
  }
}

export default withRouter(TaskList);

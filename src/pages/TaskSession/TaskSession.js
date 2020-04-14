import React from 'react';
import { withRouter } from 'react-router';
import '../../index.css';
import './TaskSession.css';

import Iframe from 'react-iframe';
import { Hero } from 'react-bulma-components/lib';

class TaskSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskDescription: 'abc',
      taskName: 'Zadanie',
    };
  }

  render() {
    const { taskDescription, taskName } = this.state;
    return (
      <div className="task">
        <Hero>
          {taskName} {taskDescription}
        </Hero>
        <Iframe
          url="http://localhost:8080/boards/example"
          width="50%"
          height="50%"
        />
      </div>
    );
  }
}

export default withRouter(TaskSession);

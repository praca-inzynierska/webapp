import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from 'react-bulma-components/lib/components/navbar';
import React from 'react';
import Content from 'react-bulma-components/lib/components/container';
import TaskEditor from './pages/TaskEditor/TaskEditor';
import './App.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import TaskSession from './pages/TaskSession/TaskSession';

function App() {
  return (
    <Router>
      <div>
        <Navbar fixed="top">
          <Navbar.Menu>
            <Navbar.Container>
              <Navbar.Item href="/">Home</Navbar.Item>
              <Navbar.Item href="/task-editor">Task Editor</Navbar.Item>
            </Navbar.Container>
            <Navbar.Container position="end">
              <Navbar.Item href="/about">About</Navbar.Item>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
        <Content>
          <Switch>
            <Route path="/task-editor" component={TaskEditor} />
            <Route
              path="/session/:taskName/:taskDescription"
              component={TaskSession}
            />
            <Route path="/home">
              <div>Homepage</div>
            </Route>
          </Switch>
        </Content>
      </div>
    </Router>
  );
}

export default App;

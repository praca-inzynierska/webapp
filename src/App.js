import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from 'react-bulma-components/lib/components/navbar';
import React from 'react';
import Container from 'react-bulma-components/lib/components/container';
import TaskEditor from './pages/TaskEditor/TaskEditor';
import './App.css';

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
        <Container>
          <Switch>
            <Route path="/task-editor">
              <TaskEditor />
            </Route>
            <Route path="/">
              <div>Homepage</div>
            </Route>
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from 'react-bulma-components/lib/components/navbar';
import React from 'react';
import Content from 'react-bulma-components/lib/components/container';
import TaskEditor from './pages/TaskEditor/TaskEditor';
import './App.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import TaskSession from './pages/TaskSession/TaskSession';
import TaskList from './pages/TaskList/TaskList';

function App() {
  const routes = [
    {
      path: '/tasks',
      component: TaskList,
    },
    {
      path: '/task/:id',
      component: TaskEditor,
    },
    {
      path: '/task/',
      component: TaskEditor,
    },
    {
      path: '/session/:taskName/:taskDescription',
      component: TaskSession,
    },
  ];

  return (
    <Router>
      <div>
        <Navbar fixed="top">
          <Navbar.Menu>
            <Navbar.Container>
              <Navbar.Item href="/">Home</Navbar.Item>
              <Navbar.Item href="/tasks">Tasks</Navbar.Item>
            </Navbar.Container>
            <Navbar.Container position="end">
              <Navbar.Item href="/about">About</Navbar.Item>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
        <Content>
          <Switch>
            {routes.map((route, i) => (
              // eslint-disable-next-line react/no-array-index-key,react/jsx-props-no-spreading
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </Content>
      </div>
    </Router>
  );

  function RouteWithSubRoutes(route) {
    return (
      <Route
        path={route.path}
        render={(props) => (
          // pass the sub-routes down to keep nesting
          // eslint-disable-next-line react/jsx-props-no-spreading
          <route.component {...props} routes={route.routes} />
        )}
      />
    );
  }
}

export default App;

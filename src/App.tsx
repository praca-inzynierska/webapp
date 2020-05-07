import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar, Container } from 'react-bulma-components'
import React from 'react'
import TaskEditor from './pages/TaskEditor/TaskEditor'
import './App.css'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import TaskSession from './pages/TaskSession/TaskSession'
import TaskList from './pages/TaskList/TaskList'
import Login from './pages/Login/Login'
import { connect } from 'react-redux'
import { logout } from './actions'

function App ({ username, logout }: any) {
  const routes = [
    {
      path: '/tasks',
      component: TaskList,
    },
    {
      path: '/task/:taskId',
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
    {
      path: '/login',
      component: Login,
    },
  ]

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
              {(username === undefined)
                ? <Navbar.Item href="/login">Login</Navbar.Item>
                : <Navbar.Item href="/login" onClick={logout}>{username} Logout</Navbar.Item>
              }
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
        <Container>
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </Container>
      </div>
    </Router>
  )

  function RouteWithSubRoutes (route: any) {
    return (
      <Route
        path={route.path}
        render={(props) => (
          // pass the sub-routes down to keep nesting
          // eslint-disable-next-line react/jsx-props-no-spreading
          <route.component {...props} routes={route.routes}/>
        )}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  username: state.auth.username
})

const component = connect(
  mapStateToProps,
  { logout }
)(App)

export default component

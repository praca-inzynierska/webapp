import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Navbar, Tag, Button } from 'react-bulma-components'
import React from 'react'
import TaskEditor from './pages/TaskEditor/TaskEditor'
import './App.css'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import TaskSession from './pages/TaskSession/TaskSession'
import TaskList from './pages/TaskList/TaskList'
import Login from './pages/Login/Login'
import { connect } from 'react-redux'
import { logout } from './actions'
import ClassSession from './pages/ClassSession/ClassSession'
import HomePage from './pages/HomePage/HomePage'
import ClassSessionCreator from './pages/ClassSessionCreator/ClassSessionCreator'
import api from './util/api'

function App ({ username, logout }: any) {
  const routes = [
    {
      path: '/home',
      component: HomePage
    },
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
      path: '/classSession/new',
      component: ClassSessionCreator
    },
    {
      path: '/classSession/:id',
      component: ClassSession
    },
    {
      path: '/taskSession/:taskSessionId',
      component: TaskSession,
    },
    {
      path: '/login',
      component: Login,
    }
  ]

  return (
    <Router>
      <Navbar fixed="top" className="nav-bar">
        <Navbar.Menu>
          <Navbar.Container>
            <Navbar.Item href="/home">Sesje zajęć</Navbar.Item>
            <Navbar.Item href="/tasks">Zadania</Navbar.Item>
          </Navbar.Container>
          <Navbar.Container position="end">
            <Navbar.Item>
              <Button onClick={() => mockDataRequest()}>Mock data</Button>
            </Navbar.Item>

            {(username === undefined)
              ? <Navbar.Item href="/login">Zaloguj</Navbar.Item>
              : <Navbar.Item href="/login" onClick={logout}><Tag>{username}</Tag></Navbar.Item>
            }
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </Router>
  )

  function mockDataRequest () {
    api.get('/mock')
  }

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

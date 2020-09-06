import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React from 'react'
import TaskEditor from './pages/TaskEditor/TaskEditor'
import './App.css'
import TaskSession from './pages/TaskSession/TaskSession'
import TaskList from './pages/TaskList/TaskList'
import Login from './pages/Login/Login'
import { connect } from 'react-redux'
import { logout } from './actions'
import ClassSession from './pages/ClassSession/ClassSession'
import HomePage from './pages/HomePage/HomePage'
import ClassSessionCreator from './pages/ClassSessionCreator/ClassSessionCreator'
import api from './util/api'
import { CommandBarButton, initializeIcons, IStackStyles, Persona, PersonaSize, Stack } from 'office-ui-fabric-react'

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
  const stackStyles: Partial<IStackStyles> = { root: { height: 44 } }

  initializeIcons()
  return (
    <Router>
      <Stack horizontal styles={stackStyles} horizontalAlign={'space-between'}>
        <Stack horizontal >
          <CommandBarButton
            text="Sesje zadań"
            href="/home"
          />
          <CommandBarButton
            text="Zadania"
            href="/tasks"
          />
        </Stack>

        <Stack horizontal>
          <CommandBarButton onClick={mockDataRequest}>Mock data</CommandBarButton>

          {(username === undefined)
            ? <CommandBarButton href="/login">Zaloguj</CommandBarButton>
            : <CommandBarButton href="/login" onClick={logout}>
              <Persona
                size={PersonaSize.size24}
                text={username}
              />
            </CommandBarButton>
          }
        </Stack>
      </Stack>
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

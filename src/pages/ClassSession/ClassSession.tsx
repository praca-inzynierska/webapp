import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import TaskSessionModel from '../../model/TaskSessionModel'
import TaskSessionCreator from './TaskSessionCreator'
import TaskSessionCard from './TaskSessionCard'
import { Heading } from 'react-bulma-components'

type TState = {
  taskSessions: TaskSessionModel[]
  started: boolean
}

class ClassSession extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.startSessions = this.startSessions.bind(this)

    this.state = {
      started: false,
      taskSessions: []
    }
  }

  startSessions (taskSessions: TaskSessionModel[]) {
    this.setState({ taskSessions: taskSessions, started: true })
  }

  showFilteredTasks (func: (group: TaskSessionModel) => boolean) {
    return (
      this.state.taskSessions
        .filter(func)
        .map((group: TaskSessionModel, index: number) => (
          <div key={index}>
            <TaskSessionCard taskGroup={group}/>
          </div>
        ))
    )
  }

  render () {
    return (
      <div>
        {this.state.started
          ? <div>
            <Heading>
              Sesje zadań:
            </Heading>
            <Heading size={3}>
              Prośby o pomoc:
            </Heading>
            {this.showFilteredTasks(group => group.needsHelp)}
            <Heading size={3}>
              Gotowe do oceny:
            </Heading>
            {this.showFilteredTasks(group => group.finished)}
            <Heading size={3}>
              W trakcie pracy:
            </Heading>
            {this.showFilteredTasks(group => !group.finished && !group.needsHelp)}
          </div>
          : <TaskSessionCreator onSessionCreate={this.startSessions}/>}
      </div>
    )
  }
}

const actionCreators = {}

const component = connect(
  null,
  actionCreators
)(ClassSession)

export default withRouter(component)

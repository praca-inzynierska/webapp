import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import TaskSessionModel from '../../model/TaskSessionModel'
import TaskSessionCreator from './TaskSessionCreator'
import TaskSessionCard from './TaskSessionCard'
import { Container, Heading } from 'react-bulma-components'
import ClassSessionModel from '../../model/ClassSessionModel'
import api from '../../util/api'
import Student from '../../model/Student'

type TState = {
  classSession: ClassSessionModel
  started: boolean
}

class ClassSession extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.startSessions = this.startSessions.bind(this)

    this.state = {
      started: false,
      classSession: ClassSessionModel.empty()
    }
  }

  componentDidMount () {
    api.get(`classSessions/${this.props.match.params.id}`)
      .then(response => this.setState({ classSession: ClassSessionModel.fromResponse(response.data), started: true }))
  }

  startSessions (taskSessions: TaskSessionModel[]) {
    this.setState({ taskSessions: taskSessions, started: true })
  }

  showFilteredTasks (func: (group: TaskSessionModel) => boolean) {
    return (
      (this.state.classSession.taskSessions as TaskSessionModel[])
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
      <Container className="page">
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
          : <TaskSessionCreator students={(this.state.classSession.students as Student[])} onSessionCreate={this.startSessions}/>}
      </Container>
    )
  }
}

const actionCreators = {}

const component = connect(
  null,
  actionCreators
)(ClassSession)

export default withRouter(component)

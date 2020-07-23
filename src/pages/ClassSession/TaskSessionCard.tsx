import { Button, Box, Heading, Image } from 'react-bulma-components'
import React from 'react'
import './StudentCard.css'
import TaskSessionModel from '../../model/TaskSessionModel'
import Student from '../../model/Student'
import { RouteComponentProps, withRouter } from 'react-router'

type TProps = RouteComponentProps & {
  taskGroup: TaskSessionModel }

class TaskSessionCard extends React.Component<TProps> {
  constructor (props: any) {
    super(props)
    this.openTaskSession = this.openTaskSession.bind(this)
  }

  openTaskSession () {
    const taskSessionId = this.props.taskGroup.id
    this.props.history.push(`/taskSession/${taskSessionId}`)
  }

  render () {
    const taskSession: TaskSessionModel = this.props.taskGroup
    return (
      <div>
        <Box>
          <Heading size={4} style={{ marginBottom: '8px' }}>
            {taskSession.task.name}
          </Heading>
          <div style={{ paddingBottom: '8px' }}>
            {taskSession.students.map((student: Student) => (
              <div key={student.id}>
                <Image rounded={true} src="http://bulma.io/images/placeholders/640x480.png"
                  style={{ width: 48, float: 'left', paddingRight: '8px', paddingLeft: '8px' }}/>
                <div style={{ float: 'left' }}>
                  {student.name}
                </div>
              </div>
            ))}
            <div style={{ float: 'right' }}>
              <Button onClick={this.openTaskSession}>Otwórz sesję</Button>
            </div>
            {taskSession.finished
              ? (<Button style={{ float: 'right' }}>Oceń zadanie</Button>)
              : null}
          </div>
          <br/>

        </Box>
      </div>
    )
  }
}

export default withRouter(TaskSessionCard)

import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import '../../index.css'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import './TaskSession.css'

import Iframe from 'react-iframe'
import { Container, Heading, Hero } from 'react-bulma-components'

class TaskSession extends React.Component<ComponentProps<any>> {
  constructor (props: any) {
    super(props)
    this.state = {
      taskDescription: 'abc',
      taskName: 'Zadanie',
    }
  }

  render () {
    const { match } = this.props
    const { taskDescription, taskName } = match.params
    return (
      <div className="task">
        <Hero color="primary">
          <Hero.Body>
            <Container>
              <Heading>{taskName}</Heading>
              <Heading subtitle size={3}>
                {taskDescription}
              </Heading>
            </Container>
          </Hero.Body>
        </Hero>
        <Iframe
          url={`http://localhost:8080/boards/${taskName}`}
          width="50%"
          height="50%"
        />
      </div>
    )
  }
}

export default withRouter(TaskSession)

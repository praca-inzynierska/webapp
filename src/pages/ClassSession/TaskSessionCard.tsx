import { DefaultButton, Facepile, IFacepilePersona, OverflowButtonType, Stack, Text } from 'office-ui-fabric-react'
import { Card, ICardTokens } from '@uifabric/react-cards'
import React from 'react'
import './StudentCard.css'
import TaskSessionModel from '../../model/TaskSessionModel'
import { RouteComponentProps, withRouter } from 'react-router'
import { notify } from 'react-notify-toast'
import api from '../../util/api'

type TProps = RouteComponentProps & {
  taskGroup: TaskSessionModel
  deleteEvent: () => any
}

class TaskSessionCard extends React.Component<TProps> {
  constructor (props: any) {
    super(props)
    this.openTaskSession = this.openTaskSession.bind(this)
    this.removeTaskSession = this.removeTaskSession.bind(this)
  }

  openTaskSession () {
    const taskSessionId = this.props.taskGroup.id
    this.props.history.push(`/taskSession/${taskSessionId}`)
  }

  removeTaskSession () {
    const taskSessionId = this.props.taskGroup.id
    api.get(`/taskSessions/delete/${taskSessionId}`)
      .then(() => notify.show('Sesja zadania usunięta pomyślnie', 'success'))
      .then(() => this.props.deleteEvent())
  }

  render () {
    const taskSession: TaskSessionModel = this.props.taskGroup
    const personas: IFacepilePersona[] = taskSession.students.map((it) => ({
      personaName: it.user.firstName + ' ' + it.user.lastName,
    })).copyWithin(5, 0, 2)
    const cardTokens: ICardTokens = {
      childrenMargin: 10,
      maxWidth: 400,
      minWidth: 50,
    }

    return (
      <div>
        <Stack>

          <Card horizontal tokens={cardTokens}>
            <Card.Section grow={1}>
              <Text variant='large'>
                {taskSession.task.name}
              </Text>
              <Facepile
                personas={personas.slice(0, 3)}
                overflowPersonas={personas.slice(3)}
                maxDisplayablePersonas={4}
                overflowButtonType={OverflowButtonType.descriptive}
                overflowButtonProps={{ariaLabel: 'More'}}
              />
            </Card.Section>
            <Card.Section>
              <DefaultButton onClick={this.openTaskSession}>Otwórz sesję</DefaultButton>
              <DefaultButton onClick={this.removeTaskSession}>Usuń sesję</DefaultButton>
            </Card.Section>
          </Card>
          <br/>

        </Stack>
      </div>
    )
  }
}

export default withRouter(TaskSessionCard)

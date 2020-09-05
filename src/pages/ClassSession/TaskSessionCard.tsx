import { DefaultButton, Facepile, IFacepilePersona, OverflowButtonType, Stack, Text } from 'office-ui-fabric-react'
import { Card, ICardTokens } from '@uifabric/react-cards'
import React from 'react'
import './StudentCard.css'
import TaskSessionModel from '../../model/TaskSessionModel'
import { RouteComponentProps, withRouter } from 'react-router'

type TProps = RouteComponentProps & {
  taskGroup: TaskSessionModel
}

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
    const personas: IFacepilePersona[] = taskSession.students.map((it) => ({
      personaName: it.name,
      imageUrl: 'http://bulma.io/images/placeholders/640x480.png'
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
                personas={personas}
                overflowPersonas={personas.slice(2)}
                maxDisplayablePersonas={3}
                overflowButtonType={OverflowButtonType.more}
              />
            </Card.Section>
            <Card.Section>
              <DefaultButton onClick={this.openTaskSession}>Otwórz sesję</DefaultButton>
              {taskSession.readyToRate
                ? (<DefaultButton>Oceń zadanie</DefaultButton>)
                : null}
            </Card.Section>
          </Card>
          <br/>

        </Stack>
      </div>
    )
  }
}

export default withRouter(TaskSessionCard)

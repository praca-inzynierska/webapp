import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import TaskSessionModel from '../../model/TaskSessionModel'
import TaskSessionCreator from './TaskSessionCreator'
import TaskSessionCard from './TaskSessionCard'
import ClassSessionModel from '../../model/ClassSessionModel'
import api from '../../util/api'
import Student, { StudentUser } from '../../model/Student'
import { IconButton, Modal, PrimaryButton, Stack, Text, mergeStyleSets } from 'office-ui-fabric-react'

type TState = {
  classSession: ClassSessionModel
  started: boolean
  isModalOpen: boolean
}

class ClassSession extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.startSessions = this.startSessions.bind(this)

    this.state = {
      started: false,
      classSession: ClassSessionModel.empty(),
      isModalOpen: false
    }
  }

  componentDidMount () {
    api.get(`classSessions/${this.props.match.params.id}`)
      .then(response => this.setState({ classSession: ClassSessionModel.fromResponse(response.data), started: true }))
  }

  startSessions (classSession: ClassSessionModel) {
    this.setState({ classSession: classSession, started: true, isModalOpen: false })
  }

  removeSession () {
    api.get(`classSessions/${this.props.match.params.id}`)
      .then(response => this.setState({ classSession: ClassSessionModel.fromResponse(response.data), started: true }))
  }

  showFilteredTasks (func: (group: TaskSessionModel) => boolean, text: string) {
    const stackTokens = { childrenGap: 10, padding: 10 }
    const stackItemStyles = {
      root: {
        width: '30%',
      }
    }
    return (
      <div>
        {(this.state.classSession.taskSessions as TaskSessionModel[])
          .filter(func).length > 0 ? <Text
            variant={'xxLarge'}>
            {text}
          </Text> : undefined}

        <Stack horizontal wrap tokens={stackTokens}>
          {(this.state.classSession.taskSessions as TaskSessionModel[])
            .filter(func)
            .map((group: TaskSessionModel, index: number) => (
              <Stack.Item styles={stackItemStyles} align={'center'} key={index}>
                <TaskSessionCard taskGroup={group} deleteEvent={() => this.removeSession()}/>
              </Stack.Item>
            ))}
        </Stack>
      </div>
    )
  }

  render () {
    const stackTokens = { childrenGap: 10, padding: 10 }
    const contentStyles = mergeStyleSets({
      container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
      },
      body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
          p: { margin: '14px 0' },
          'p:first-child': { marginTop: 0 },
          'p:last-child': { marginBottom: 0 },
        },
      },
    })
    return (
      <div className="page">
        <Stack tokens={stackTokens}>
          <PrimaryButton onClick={() => this.setState({ isModalOpen: true })}>Utwórz sesje zadań</PrimaryButton>
          <Text variant={'xxLargePlus'}>
            Sesje zadań:
          </Text>
          {this.showFilteredTasks(group => group.needsHelp, 'Prośby o pomoc')}
          {this.showFilteredTasks(group => group.readyToRate, 'Gotowe do oceny')}
          {this.showFilteredTasks(group => !group.readyToRate && !group.needsHelp, 'W trakcie pracy')}
        </Stack>
        <Modal
          isOpen={this.state.isModalOpen}
          onDismiss={() => this.setState({ isModalOpen: false })}
          isBlocking={false}
          containerClassName={contentStyles.body}
        >
          <Stack horizontal horizontalAlign={'space-between'} tokens={stackTokens}>
            <Text variant={'xxLargePlus'}>
              Tworzenie sesji zadań
            </Text>
            <Stack.Item styles={{ root: { float: 'right' } }}>
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                ariaLabel="Close popup modal"
                onClick={() => this.setState({ isModalOpen: false })}
              />
            </Stack.Item>
          </Stack>
          <div>
            <TaskSessionCreator classSessionId={this.state.classSession.id}
              students={(this.state.classSession.students as StudentUser[])}
              onSessionCreate={this.startSessions}/>
          </div>
        </Modal>
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

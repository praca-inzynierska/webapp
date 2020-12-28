import React, { ComponentProps } from 'react'
import '../../index.css'
import './TaskSession.css'
import {
  DefaultButton,
  Facepile,
  IconButton, mergeStyleSets, Modal,
  OverflowButtonType,
  Pivot,
  PivotItem,
  Separator,
  Stack,
  Text
} from 'office-ui-fabric-react'
import { ToolModel, ToolType } from '../../model/ToolModel'
import TaskSessionModel from '../../model/TaskSessionModel'
import api from '../../util/api'
import moment from 'moment'
import 'moment/locale/pl'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import TaskSessionCreator from '../ClassSession/TaskSessionCreator'
import Student from '../../model/Student'

type TProps = ComponentProps<any> & {
  taskSessionId: string
  username: string
}

type TState = {
  taskSession: TaskSessionModel
  taskTools: ToolModel[]
  communicationTools: ToolModel[]
  selectedTaskTool: ToolModel | null,
  selectedCommunicationTool: ToolModel | null
  isModalOpen: boolean
}

class TaskSession extends React.Component<TProps> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.state = {
      taskTools: [], // TODO: pobieranie narzedzi na podstawie id zadania
      communicationTools: [],
      taskSession: TaskSessionModel.empty(),
      selectedTaskTool: null,
      selectedCommunicationTool: null,
      isModalOpen: false
    }
  }

  componentDidMount () {
    const { taskSessionId } = this.props.match.params
    api.get(`/taskSessions/${taskSessionId}`)
      .then(response => this.setState(() => {
        const newTaskSession = TaskSessionModel.fromResponse(response.data)
        const tools = Array.from(newTaskSession.task.tools.entries())
          .filter((it) => it[1])
          .map((it) => ToolModel.getById(it[0]))
        const newTaskTools = tools.filter((it) => it.type === ToolType.Task)
        const newCommunicationTools = tools.filter((it) => it.type === ToolType.Communication)
        return {
          taskSession: newTaskSession,
          taskTools: newTaskTools,
          communicationTools: newCommunicationTools,
          selectedTaskTool: newTaskTools[0],
          selectedCommunicationTool: newCommunicationTools[0]
        }
      }))
  }

  render () {
    const deadline = moment(this.state.taskSession.deadline)
    const personas = this.state.taskSession.students.map((it) => ({
      personaName: it.user.firstName + ' ' + it.user.lastName,
    }))
    const stackTokens = {
      childrenGap: 10
    }
    const contentStyles = mergeStyleSets({
      container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
      },
      body: {
        flex: '4 4 auto',
        padding: '48px 24px 24px 24px',
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
        <Stack grow={1}>
          <Stack horizontal grow={0} tokens={stackTokens}>
            <Stack.Item grow={2}>
              <Stack style={{ maxWidth: '300px' }}>
                <Text variant={'xxLargePlus'}>{this.state.taskSession.task.name}</Text>
                <DefaultButton onClick={() => this.setState({ isModalOpen: true })}>Pokaż opis</DefaultButton>
                <Modal
                  isOpen={this.state.isModalOpen}
                  onDismiss={() => this.setState({ isModalOpen: false })}
                  isBlocking={false}
                  containerClassName={contentStyles.body}
                  topOffsetFixed
                >
                  <Text variant={'xLarge'} nowrap>
                    {this.state.taskSession.task.description}
                  </Text>
                </Modal>
              </Stack>
            </Stack.Item>
            <Separator vertical/>
            <Stack.Item grow={2} align={'center'}>
              <Facepile
                personas={personas}
                overflowPersonas={personas.slice(2)}
                maxDisplayablePersonas={3}
                overflowButtonType={OverflowButtonType.more}
              />
            </Stack.Item>
            <Separator vertical/>
            <Stack.Item grow={1}>
              <div className='flex-column'>
                <Text variant={'xLarge'}>Termin oddania zadania:</Text>
                <Text variant={'large'}>{deadline.locale('pl').fromNow()}</Text>
                <div>{deadline.locale('pl').format('LLL')}</div>
              </div>
            </Stack.Item>
          </Stack>
          <Separator/>
          <Stack.Item verticalFill grow={1} disableShrink>
            <Stack horizontal verticalFill tokens={stackTokens}>
              <Stack.Item verticalFill grow={4}>
                <Pivot>
                  {this.state.taskTools.map((tool) => {
                    return (
                      <
                        PivotItem
                        key={tool.toolId}
                        headerText={tool.displayName}
                      >
                        <tool.component taskSession={this.state.taskSession}/>
                      </PivotItem>
                    )
                  })}
                </Pivot>
              </Stack.Item>
              <Separator vertical/>
              <Stack.Item grow={1}>
                <Pivot>
                  {this.state.communicationTools.map((tool) => (
                    <PivotItem
                      key={tool.toolId}
                      headerText={tool.displayName}
                    >
                      <tool.component taskSession={this.state.taskSession}  user={this.props.username}/>
                    </PivotItem>
                  ))}
                </Pivot>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  username: state.auth.username
})

const component = connect(
  mapStateToProps
)(TaskSession)

export default withRouter(component)

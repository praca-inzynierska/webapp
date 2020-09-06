import React, { ComponentProps } from 'react'
import '../../index.css'
import './TaskSession.css'
import { Stack, Text, Pivot, PivotItem, Facepile, Separator, OverflowButtonType } from 'office-ui-fabric-react'
import { toolComponents, ToolModel, ToolType } from '../../model/ToolModel'
import TaskSessionModel from '../../model/TaskSessionModel'
import api from '../../util/api'
import moment from 'moment'
import 'moment/locale/pl'
import { withRouter } from 'react-router'

type TProps = ComponentProps<any> & {
  taskSessionId: string
}

type TState = {
  taskSession: TaskSessionModel
  taskTools: ToolModel[]
  communicationTools: ToolModel[]
  selectedTaskTool: ToolModel | null,
  selectedCommunicationTool: ToolModel | null
}

class TaskSession extends React.Component<TProps> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.state = {
      taskTools: ToolModel.taskTools, // TODO: pobieranie narzedzi na podstawie id zadania
      communicationTools: ToolModel.communicationTools,
      taskSession: TaskSessionModel.empty(),
      selectedTaskTool: null,
      selectedCommunicationTool: null
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
      personaName: it.name,
      imageUrl: 'http://bulma.io/images/placeholders/640x480.png'
    }))
    const stackTokens = {
      childrenGap: 10
    }
    return (
      <div className="page">
        <Stack>
          <Stack horizontal tokens={stackTokens}>
            <Stack.Item grow={2}>
              <Stack>
                <Text variant={'xxLargePlus'}>{this.state.taskSession.task.name}</Text>
                <Text variant={'xLarge'}>
                  {this.state.taskSession.task.description}
                </Text>
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
          <Stack horizontal tokens={stackTokens}>
            <Stack.Item grow={4}>
              <Pivot>
                {this.state.taskTools.map((tool) => (
                  <PivotItem
                    key={tool.name}
                    headerText={tool.displayName}
                  >
                    {toolComponents[tool.tag]}
                  </PivotItem>
                ))}
              </Pivot>
            </Stack.Item>
            <Separator vertical/>
            <Stack.Item grow={1}>
              <Pivot>
                {this.state.communicationTools.map((tool) => (
                  <PivotItem
                    key={tool.name}
                    headerText={tool.displayName}
                  >
                    <div>Communication placeholder</div>
                  </PivotItem>
                ))}
              </Pivot>
            </Stack.Item>
          </Stack>
        </Stack>
      </div>
    )
  }
}

export default withRouter(TaskSession)

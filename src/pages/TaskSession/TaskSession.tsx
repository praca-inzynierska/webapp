import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import '../../index.css'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import './TaskSession.css'
import { Columns, Container, Heading, Hero, Tabs } from 'react-bulma-components'
import { toolComponents, ToolModel, ToolType } from '../../model/ToolModel'
import TaskSessionModel from '../../model/TaskSessionModel'
import api from '../../util/api'
import { mockTaskSessions } from '../../util/mock'

type TProps = ComponentProps<any> & {
  taskSessionId: string
}

type TState = {
  taskSession: TaskSessionModel | null
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
      taskSession: null,
      selectedTaskTool: null,
      selectedCommunicationTool: null
    }
  }

  componentDidMount () {
    api.get(`/taskSessions/${this.props.taskSessionId}`)
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
      .catch(() => this.setState({
        selectedTaskTool: this.state.taskTools[0],
        selectedCommunicationTool: this.state.communicationTools[0],
        taskSession: mockTaskSessions[0]
      }))
  }

  render () {
    const { match } = this.props
    const { taskDescription, taskName } = match.params
    const tag: string = this.state.selectedTaskTool ? this.state.selectedTaskTool.tag : 'Task'
    const TaskToolComponent = toolComponents[tag]
    return (
      <div className="page">
        <Hero color="primary">
          <Hero.Body>
            <Container>
              <Heading size={5}>{taskName}</Heading>
              <Heading subtitle size={5}>
                {taskDescription}
              </Heading>
            </Container>
          </Hero.Body>
        </Hero>
        <Columns>
          <Columns.Column size="four-fifths">
            <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
              <Tabs>
                {this.state.taskTools.map((tool) => (
                  <Tabs.Tab
                    key={tool.id}
                    active={tool.id === this.state.selectedTaskTool?.id}
                    onClick={() => this.setState({ selectedTaskTool: tool })}
                  >
                    {tool.name}
                  </Tabs.Tab>
                ))}
              </Tabs>
              {this.state.selectedTaskTool ? <TaskToolComponent taskSession={this.state.taskSession}/> : <div/>}
            </div>
          </Columns.Column>
          <Columns.Column>
            <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
              <Tabs>
                {this.state.communicationTools.map((tool) => (
                  <Tabs.Tab
                    key={tool.id}
                    active={tool.id === this.state.selectedCommunicationTool?.id}
                    onClick={() => this.setState({ selectedCommunicationTool: tool })}
                  >
                    {tool.name}
                  </Tabs.Tab>
                ))}
              </Tabs>
              <div>Communication placeholder</div>
            </div>
          </Columns.Column>
        </Columns>

      </div>
    )
  }
}

export default withRouter(TaskSession)

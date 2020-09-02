import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import '../../index.css'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import './TaskSession.css'
import { Box, Columns, Container, Heading, Tabs } from 'react-bulma-components'
import { toolComponents, ToolModel, ToolType } from '../../model/ToolModel'
import TaskSessionModel from '../../model/TaskSessionModel'
import api from '../../util/api'
import Student from '../../model/Student'
import StudentCard from '../ClassSession/StudentCard'
import moment from 'moment'
import 'moment/locale/pl'

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
    const tag: string = this.state.selectedTaskTool ? this.state.selectedTaskTool.tag : 'Task'
    const TaskToolComponent = toolComponents[tag]
    const deadline = moment(this.state.taskSession.deadline)
    return (
      <div className="page">
        <Columns style={{ display: 'flex', flexGrow: 0 }}>
          <Columns.Column size="two-fifths">
            <Container>
              <Box>
                <Heading size={2}>{this.state.taskSession.task.name}</Heading>
                <Heading subtitle size={5}>
                  {this.state.taskSession.task.description}
                </Heading>
              </Box>
            </Container>
          </Columns.Column>
          <Columns.Column size="two-fifths">
            {this.state.taskSession?.students.map((student: Student) => (<StudentCard student={student}/>))}
          </Columns.Column>
          <Columns.Column size="one-fifth">
            <div className='flex-column'>
              <Heading size={3}>Termin oddania zadania:</Heading>
              <Heading size={4}>{deadline.locale('pl').fromNow()}</Heading>
              <div>{deadline.locale('pl').format('LLL')}</div>
            </div>
          </Columns.Column>
        </Columns>
        <Columns>
          <Columns.Column size="four-fifths">
            <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
              <Tabs>
                {this.state.taskTools.map((tool) => (
                  <Tabs.Tab
                    key={tool.name}
                    active={tool.name === this.state.selectedTaskTool?.name}
                    onClick={() => this.setState({ selectedTaskTool: tool })}
                  >
                    {tool.displayName}
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
                    key={tool.name}
                    active={tool.name === this.state.selectedCommunicationTool?.name}
                    onClick={() => this.setState({ selectedCommunicationTool: tool })}
                  >
                    {tool.displayName}
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

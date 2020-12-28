import { ToolWindow, ToolWindowProps } from './ToolWindow'
import Iframe from 'react-iframe'
import React from 'react'

class Chat extends ToolWindow<ToolWindowProps> {
  render () {
    const props: ToolWindowProps = this.props
    return (
      <Iframe className="task-tool"
        url={`http://localhost:8083/${this.props.taskSession.id}?name=${this.props.user}`}
      />
    )
  }
}
export default Chat

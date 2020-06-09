import { ToolWindow, ToolWindowProps } from './ToolWindow'
import React from 'react'
import Iframe from 'react-iframe'

class Whiteboard extends ToolWindow<ToolWindowProps> {
  render () {
    const props: ToolWindowProps = this.props
    return (
      <Iframe className="task-tool"
        url={`http://localhost:8080/boards/${props.taskSession.taskSessionId}`}
      />
    )
  }
}

export default Whiteboard

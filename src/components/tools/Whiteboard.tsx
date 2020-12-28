import { ToolWindow, ToolWindowProps } from './ToolWindow'
import React from 'react'
import Iframe from 'react-iframe'

class Whiteboard extends ToolWindow<ToolWindowProps> {
  render () {
    const props: ToolWindowProps = this.props
    return (
      <Iframe className="task-tool"
        url={`http://localhost:8090/boards/${props.taskSession.id}`}
      />
    )
  }
}

export default Whiteboard

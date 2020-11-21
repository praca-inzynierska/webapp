import { ToolWindow, ToolWindowProps } from './ToolWindow'
import React from 'react'

class Chat extends ToolWindow<ToolWindowProps> {
  render () {
    const props: ToolWindowProps = this.props
    return (
      <div>
        Chat placeholder
      </div>
    )
  }
}

export default Chat

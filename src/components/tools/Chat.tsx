import { ToolWindow, ToolWindowProps } from './ToolWindow'
import React from 'react'
import GiftedChat from 'reactjs-simple-gifted-chat'
import Fire from '../../Fire'

type TState = {
  id: string,
  messages: any[],
  user: any
}

class Chat extends ToolWindow<ToolWindowProps> {
  readonly state: TState

  constructor (props: ToolWindowProps) {
    super(props)
    this.state = {
      id: '',
      messages: [],
      user: {
        _id: Fire.uid,
        name: 'beata'
      }
    }
  }

  async componentDidMount () {
    Fire.get((message: any) => {
      this.setState((previous: TState) => ({
        messages: [...previous.messages, message]
      }))
    })

    const data = this.props.taskSession
    await this.setState({ id: data.id })
  }

  componentWillUnmount () {
    Fire.off()
  }

  render () {
    return (
      <div>
        {/*{this.state.messages.map(message => {*/}
        {/*  return (<div>{message.text}</div>)*/}
        {/*})*/}
        {/*}*/}
      </div>
    )
  }
}

export default Chat

import Whiteboard from '../components/tools/Whiteboard'
import { Component } from 'react'
import Test from '../components/tools/Test'

export enum ToolType {
  Communication,
  Task,
}

export class ToolModel {
  id: string
  name: string
  type: ToolType
  tag: string

  constructor (id: string, name: string, type: ToolType, tag: string) {
    this.id = id
    this.name = name
    this.type = type
    this.tag = tag
  }

  static WHITEBOARD = new ToolModel('whiteboard', 'Tablica', ToolType.Task, 'Whiteboard')
  static TEST = new ToolModel('test', 'Test', ToolType.Task, 'Test') // TODO: not implemented
  static CHAT = new ToolModel('chat', 'Czat', ToolType.Communication, 'Chat') // TODO: not implemented
  static VOICECHAT = new ToolModel('voice-chat', 'Czat głosowy', ToolType.Communication, 'VoiceChat') // TODO: not implemented

  static getById (toolId: string) {
    return [...this.taskTools, ...this.communicationTools].findByKey('id', toolId)
  }

  static taskTools: ToolModel[] = [
    ToolModel.WHITEBOARD,
    ToolModel.TEST
  ]

  static communicationTools: ToolModel[] = [
    ToolModel.CHAT,
    ToolModel.VOICECHAT
  ]
}

export const toolComponents : {[key: string]: typeof Component} = {
  Whiteboard,
  Test
}

import Whiteboard from '../components/tools/Whiteboard'
import React from 'react'
import Chat from '../components/tools/Chat'

export enum ToolType {
  Communication,
  Task,
}

export class ToolModel {
  toolId: string
  displayName: string
  type: ToolType
  component: typeof React.Component

  constructor (toolId: string, name: string, type: ToolType, component: typeof React.Component) {
    this.toolId = toolId
    this.displayName = name
    this.type = type
    this.component = component
  }

  static getById (toolId: string) {
    return [...this.taskTools, ...this.communicationTools].findByKey('toolId', toolId)
  }

  static taskTools: ToolModel[] = [
    new ToolModel('whiteboard', 'Tablica', ToolType.Task, Whiteboard),
  ]

  static communicationTools: ToolModel[] = [
    new ToolModel('textChat', 'Czat', ToolType.Communication, Chat),
  ]
}

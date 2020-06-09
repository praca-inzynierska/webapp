import React, { ComponentProps } from 'react'
import { ToolModel } from '../../model/ToolModel'
import TaskSessionModel from '../../model/TaskSessionModel'

export type ToolWindowProps = ComponentProps<any> & {
  taskSession: TaskSessionModel
}

export class ToolWindow<T extends ToolWindowProps> extends React.Component<T> {
  tool!: ToolModel
}

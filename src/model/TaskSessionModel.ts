import Student from './Student'
import { Task } from './Task'

export default class TaskSessionModel {
  students: Student[]
  task: Task
  taskSessionId: number
  finished: boolean
  needsHelp: boolean
  deadline: number
  grade: number | null

  constructor (students: Student[], task: Task, taskSessionId: number, deadline: number) {
    this.students = students
    this.task = task
    this.taskSessionId = taskSessionId
    this.finished = false
    this.deadline = deadline
    this.needsHelp = false
    this.grade = null
  }

  markAsFinished () {
    this.finished = true
  }

  markAsNeedsHelp () {
    this.needsHelp = true
  }

  static fromResponse (data: any): TaskSessionModel {
    return new TaskSessionModel(data.students, data.task, data.taskSessionId, data.deadline)
  }

  static empty (): TaskSessionModel {
    return new TaskSessionModel([], Task.emptyTask(), -1, Date.now())
  }
}

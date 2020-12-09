import Student from './Student'
import { Task } from './Task'

export default class TaskSessionModel {
  students: Student[]
  task: Task
  id: number
  readyToRate: boolean
  needsHelp: boolean
  deadline: number
  grade: number | null

  constructor (students: Student[], task: Task, id: number, deadline: number, needsHelp: boolean, finished: boolean) {
    this.students = students
    this.task = task
    this.id = id
    this.readyToRate = finished
    this.deadline = deadline
    this.needsHelp = needsHelp
    this.grade = null
  }

  markAsFinished () {
    this.readyToRate = true
  }

  markAsNeedsHelp () {
    this.needsHelp = true
  }

  static fromResponse (data: any): TaskSessionModel {
    return new TaskSessionModel(data.students, Task.fromResponse(data.task), data.id, data.deadline * 1000, data.needsHelp, data.readyToRate)
  }

  static empty (): TaskSessionModel {
    return new TaskSessionModel([], Task.emptyTask(), -1, Date.now(), false, false)
  }
}

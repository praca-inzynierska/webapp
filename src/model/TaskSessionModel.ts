import Student from './Student'
import { Task } from './Task'

export default class TaskSessionModel {
  students: Student[]
  task: Task
  id: number
  finished: boolean
  needsHelp: boolean
  deadline: number
  grade: number | null

  constructor (students: Student[], task: Task, id: number, deadline: number) {
    this.students = students
    this.task = task
    this.id = id
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
    return new TaskSessionModel(data.students, Task.fromResponse(data.task), data.id, data.deadline * 1000)
  }

  static empty (): TaskSessionModel {
    return new TaskSessionModel([], Task.emptyTask(), -1, Date.now())
  }
}

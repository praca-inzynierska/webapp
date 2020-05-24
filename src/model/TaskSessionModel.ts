import Student from './Student'
import { Task } from './Task'

export default class TaskSessionModel {
  students: Student[]
  task: Task
  taskSessionId: number
  finished: boolean
  needsHelp: boolean
  grade: number | null

  constructor (students: Student[], task: Task, taskSessionId: number) {
    this.students = students
    this.task = task
    this.taskSessionId = taskSessionId
    this.finished = false
    this.needsHelp = false
    this.grade = null
  }

  markAsFinished () {
    this.finished = true
  }

  markAsNeedsHelp () {
    this.needsHelp = true
  }
}

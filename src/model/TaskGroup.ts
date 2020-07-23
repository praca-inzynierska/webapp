import Student from './Student'
import { Task } from './Task'

export class TaskGroup {
  students: Student[]
  task: Task

  constructor (students: Student[], task: Task) {
    this.students = students
    this.task = task
  }
}

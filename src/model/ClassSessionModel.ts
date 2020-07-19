import Student from './Student'
import TaskSessionModel from './TaskSessionModel'
import Teacher from './Teacher'

export default class ClassSessionModel {
  id: number
  students: number[] | Student[]
  teacher: number | Teacher
  taskSessions: number[] | TaskSessionModel[]
  startDate: number
  endDate: number

  constructor (
    id: number,
    students: number[] | Student[],
    teacher: number | Teacher,
    taskSessions: number[] | TaskSessionModel[],
    startDate: number,
    endDate: number) {
    this.id = id
    this.students = students
    this.teacher = teacher
    this.taskSessions = taskSessions
    this.startDate = startDate
    this.endDate = endDate
  }

  static fromResponse (data: any): ClassSessionModel {
    return new ClassSessionModel(
      data.id,
      data.students,
      data.teacher,
      data.taskSessions,
      data.startDate,
      data.endDate)
  }

  static empty (): ClassSessionModel {
    return new ClassSessionModel(-1, [], -1, [], 1, 2)
  }
}

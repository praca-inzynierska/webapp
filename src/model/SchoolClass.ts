import Student from './Student'

export default class SchoolClass {
  school: string
  classNumber: number
  students: Student[]

  constructor (school: string, classNumber: number, students: Student[]) {
    this.school = school
    this.students = students
    this.classNumber = classNumber
  }
}

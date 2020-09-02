import Student from './Student'

export default class SchoolClass {
  school: string // TODO: remove this
  classNumber: number
  students: Student[]

  constructor (school: string, classNumber: number, students: Student[]) {
    this.school = school
    this.students = students
    this.classNumber = classNumber
  }

  public static fromResponse (response: any, schoolName: string): SchoolClass {
    return new SchoolClass(
      schoolName,
      response.classNumber,
      response.students.map((it: any) => new Student(
        it.id,
        `${it.user.firstName} ${it.user.lastName}`,
        schoolName,
        response.classNumber))
    )
  }
}

import User from './User'

export default class Student {
  id: number
  name: string
  school: string
  schoolClass: number

  constructor (id: number, name: string, school: string, schoolClass: number) {
    this.id = id
    this.name = name
    this.school = school
    this.schoolClass = schoolClass
  }
}

export class StudentUser {
  user: User
  id: number
  grades: number[]

  constructor (user: User, id: number, grades: number[]) {
    this.user = user
    this.id = id
    this.grades = grades
  }
}

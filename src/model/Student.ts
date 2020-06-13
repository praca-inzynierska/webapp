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

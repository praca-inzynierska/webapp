export default class Student {
  id: number
  name: string
  school: string

  constructor (id: string, name: string, school: string) {
    this.id = parseInt(id)
    this.name = name
    this.school = school
  }
}

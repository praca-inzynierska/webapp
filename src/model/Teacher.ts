export default class Teacher {
  id: number
  name: string
  surname: string

  constructor (id: string, name: string, surname: string) {
    this.id = parseInt(id)
    this.name = name
    this.surname = surname
  }
}

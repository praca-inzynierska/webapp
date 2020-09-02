export default class User {
  id: number
  firstName: string
  lastName: string

  constructor (id: string, firstName: string, lastName: string) {
    this.id = parseInt(id)
    this.firstName = firstName
    this.lastName = lastName
  }
}

import SchoolClass from './SchoolClass'

export default class School {
  name: string
  classes: SchoolClass[]

  constructor (name: string, classes: SchoolClass[]) {
    this.name = name
    this.classes = classes
  }

  public static fromResponse (response: any): School {
    return new School(
      response.name,
      response.classes.map((it: any) => SchoolClass.fromResponse(it, response.name))
    )
  }
}

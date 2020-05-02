export default class Task {
  id: string | null
  name: string
  description: string
  subject: string
  type: string
  minutes: number
  tools: Map<string, boolean>

  [key: string]: any;

  constructor (id: string | null, name: string, description: string, subject: string, type: string, minutes: number, tools: Map<string, boolean>) {
    this.id = id
    this.name = name
    this.description = description
    this.subject = subject
    this.type = type
    this.minutes = minutes
    this.tools = tools
  }

  public static emptyTask () {
    return new Task(null, '', '', 'matematyka', 'whiteboard', 0, new Map())
  }

  public serialize (): string {
    return JSON.stringify(this, (key, value: Map<string, boolean>) => {
      if (key === 'tools') return Object.keys(value).filter(key => value.get(key))
    })
  }
}

export class TaskType {
  id: string
  name: string

  constructor (id: string, name: string) {
    this.id = id
    this.name = name
  }
}

export class TimeUnit {
  id: string
  name: string
  value: number // time in minutes

  constructor (id: string, name: string, value: number) {
    this.id = id
    this.name = name
    this.value = value
  }
}

export class Tool {
  id: string
  name: string

  constructor (id: string, name: string) {
    this.id = id
    this.name = name
  }
}

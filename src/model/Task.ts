export class Task {
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

  public static fromResponse (response: any): Task {
    const tools = new Map()
    response.tools.forEach((tool: string) => tools.set(tool, true))
    return new Task(response.id, response.name, response.description, response.subject, response.type, response.minutes, tools)
  }

  public static emptyTask (): Task {
    return new Task(null, '', '', 'matematyka', 'whiteboard', 0, new Map())
  }

  public static serialize (task: Task): string {
    const replacer = (key: string, value: any) => {
      if (key === 'tools') return [...value.keys()].filter(key => value.get(key))
      if (key === 'id') return undefined
      return value
    }
    const value = JSON.stringify(task, replacer)
    return value
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

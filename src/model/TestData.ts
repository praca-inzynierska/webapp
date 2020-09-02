import { TaskData } from './Task'

export class TestData implements TaskData {
  constructor (questions: TestQuestion[]) {
    this.questions = questions
  }

  questions: TestQuestion[]
}

export class TestQuestion {
  question: string
  answer: string

  constructor (question: string, answer: string) {
    this.question = question
    this.answer = answer
  }
}

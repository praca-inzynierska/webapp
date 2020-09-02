import { ToolWindow, ToolWindowProps } from './ToolWindow'
import React from 'react'
import { TestQuestion } from '../../model/TestData'

class Test extends ToolWindow<ToolWindowProps> {
  render () {
    const props: ToolWindowProps = this.props
    return (
      <div>
        {props.taskSession.task.taskData.questions.map((question: TestQuestion) => (
          <div key={question.question}>
            {question.question}
            {question.answer}
          </div>
        ))}
      </div>
    )
  }
}

export default Test

import { Card } from 'react-bulma-components'
import React, { ComponentProps } from 'react'
import './StudentCard.css'
import Student from '../../model/Student'

type TProps = {
  student: Student,
  selected: boolean,
  selectEvent: () => any
}

class StudentCard extends React.Component<ComponentProps<any>> {
  render () {
    return (
      <div onClick={this.props.selectEvent}>
        <Card className={this.props.selected ? 'selected' : null}>
          <Card.Image
            src="http://bulma.io/images/placeholders/1280x960.png"/>
          <Card.Content>
            <div>{this.props.student.user.firstName} {this.props.student.user.lastName}</div>
            <div>{this.props.student.school}</div>
          </Card.Content>
        </Card>
      </div>
    )
  }
}

export default StudentCard

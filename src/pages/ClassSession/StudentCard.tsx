import { Persona, PersonaSize } from 'office-ui-fabric-react'
import { Card, ICardTokens } from '@uifabric/react-cards'
import React, { ComponentProps } from 'react'
import './StudentCard.css'
import Student, { StudentUser } from '../../model/Student'

type TProps = {
  student: StudentUser,
  selected: boolean,
  selectEvent: () => any
}

class StudentCard extends React.Component<ComponentProps<any>> {
  render () {
    const cardTokens: ICardTokens = {
      childrenMargin: 10,
      maxWidth: 100,
      minWidth: 100,
    }
    return (
      <div onClick={this.props.selectEvent}>
        <Card tokens={cardTokens} className={this.props.selected ? 'selected' : undefined}>
          <Card.Section>
            <Persona
              size={PersonaSize.size72}
              text={this.props.student.user.firstName + ' ' + this.props.student.user.lastName}
              hidePersonaDetails
            />
          </Card.Section>
          <Card.Section>
            <div>{this.props.student.user.firstName} {this.props.student.user.lastName}</div>
            <div>{this.props.student.schoolName}</div>
          </Card.Section>
        </Card>
      </div>
    )
  }
}

export default StudentCard

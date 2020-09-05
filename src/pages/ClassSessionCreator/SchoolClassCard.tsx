import { Card, ICardTokens } from '@uifabric/react-cards'
import React from 'react'
import SchoolClass from '../../model/SchoolClass'

type TProps = {
  schoolClass: SchoolClass,
  selectEvent?: () => any
}

class SchoolClassCard extends React.Component<TProps> {
  render () {
    const cardTokens: ICardTokens = {
      childrenMargin: 10,
      maxWidth: 400,
      minWidth: 50,
    }
    return (
      <div onClick={this.props.selectEvent}>
        <Card tokens={cardTokens}>
          <Card.Item>
            <div>{this.props.schoolClass.school}</div>
            <div>{this.props.schoolClass.classNumber}</div>
          </Card.Item>
        </Card>
      </div>
    )
  }
}

export default SchoolClassCard

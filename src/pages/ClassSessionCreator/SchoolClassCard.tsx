import { Card } from 'react-bulma-components'
import React from 'react'
import SchoolClass from '../../model/SchoolClass'

type TProps = {
  schoolClass: SchoolClass,
  selectEvent?: () => any
}

class SchoolClassCard extends React.Component<TProps> {
  render () {
    return (
      <div onClick={this.props.selectEvent}>
        <Card>
          <Card.Content>
            <div>{this.props.schoolClass.school}</div>
            <div>{this.props.schoolClass.classNumber}</div>
          </Card.Content>
        </Card>
      </div>
    )
  }
}

export default SchoolClassCard

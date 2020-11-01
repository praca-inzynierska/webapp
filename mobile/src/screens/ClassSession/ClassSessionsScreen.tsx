import 'react-native-get-random-values'
import React from 'react'
import { Button, Text, View } from 'react-native'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import api from '../../utils/api'
import moment from 'moment'

interface State {
    classSessions: Array<any>
    token: String
}

interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

class ClassSessionsScreen extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      classSessions: [],
      token: ''
    }
  }

  componentDidMount () {
    api.get('classSessions')
      .then((response: any) => {
        console.log(response)
        this.setState({ classSessions: response.data })
      })
      .catch((e: any) => console.log(e))
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Text>Wszystkie zajęcia</Text>
        {this.state.classSessions.map((c: any, index: number) => this.renderClassSession(c, index))}
      </View>
    )
  }

  renderClassSession (c: any, index: number) {
    var start = moment(c.endDate)
    var startDate = start.format('dd.mm.yyyy hh:MM')
    var end = moment(c.endDate)
    var endDate = end.format('dd.mm.yyyy hh:MM')
    return (
      <View>
        <Button
          title={`Zajęcia ${index + 1}`}
          onPress={() => this.props.navigation.navigate({ routeName: 'Zadania', params: { classSession: this.state.classSessions[index], token: this.state.token } })}
        />
        <Text>{`${startDate} - ${endDate}`}</Text>
      </View>
    )
  }
}

export default ClassSessionsScreen

import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Fonts, Strings } from '../../assets'
import { NavigationScreenProp, NavigationState } from 'react-navigation'

interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

interface State {
    inProgress: boolean
    // connection network
}

// @observer
class SplashScreen extends React.Component< Props, State> {
  constructor (props: any) {
    super(props)

    this.state = {
      inProgress: true,
    }
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        {this.renderProgress()}
        {this.isUserLoggedIn()}
      </View>
    )
  }

  renderProgress () {
    if (this.state.inProgress) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>{Strings.hello}</Text>
          <ActivityIndicator />
        </View>
      )
    }
  }

  isUserLoggedIn () {
    setTimeout(() => {
      this.setState({ inProgress: false })
      this.props.navigation.navigate({ routeName: 'routeLogin' })
    }, 100)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    ...Fonts.largeTitle
  }
})

export default SplashScreen

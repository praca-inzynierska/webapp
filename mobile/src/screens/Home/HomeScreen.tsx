import 'react-native-get-random-values'
import React from 'react'
import { Button, View } from 'react-native'
import { NavigationScreenProp, NavigationState } from 'react-navigation'

interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

class HomeScreen extends React.Component<Props, {}> {
  render () {
    return (
      <View style={{ flex: 1 }}>
        <Button onPress={() => this.logout()} title="Wyloguj"/>

        {/* <WebView
                //  source={{ uri: 'http://10.0.2.2:8080/boards/Zad1' }}
                source={{ uri: 'http://192.168.137.1:8080/boards/z' }}
                // source={{ uri: 'http://192.168.137.1:3001/task-editor' }}
                 javaScriptEnabled={true}
                 domStorageEnabled={true}
                 startInLoadingState={true}
                 scalesPageToFit={true}

                /> */}
      </View>
    )
  }

  logout () {
    this.props.navigation.navigate({ routeName: 'routeLogin' })
  }
}

export default HomeScreen

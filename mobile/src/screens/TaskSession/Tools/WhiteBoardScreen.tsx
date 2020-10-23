import 'react-native-get-random-values'
import React from 'react'
import { Text, View } from 'react-native'
import { WebView } from 'react-native-webview'

class WhiteboardScreen extends React.Component<{}, {}> {
  render () {
    return (
      <View style={{ flex: 1 }}>
        <Text>Task Session, Whiteboard is available</Text>
        <WebView
          //  source={{ uri: 'http://10.0.2.2:8080/boards/Zad1' }}
          source={{ uri: 'http://10.0.2.2:8090/boards/123123' }}
                // source={{ uri: 'http://192.168.137.1:3001/task-editor' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}

        />
      </View>
    )
  }
}

export default WhiteboardScreen

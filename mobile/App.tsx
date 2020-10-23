import React from 'react'
import { Provider } from 'mobx-react'
import RootNavigator from './src/navigation'
import { AppState } from 'react-native'
import { Launch } from './src/components'

interface State {
  appState: string
  appStoresReady: boolean
}

class App extends React.Component<{}, State> {
  constructor (props: any) {
    super(props)

    this.state = {
      appState: AppState.currentState,
      appStoresReady: false
    }
  }

  componentDidMount () {
    // stores init
    this.setState({ appStoresReady: true })
  }

  render () {
    return (
      <Provider>
        {this.state.appStoresReady ? <RootNavigator /> : <Launch />}
      </Provider>
    )
  }
};

export default App

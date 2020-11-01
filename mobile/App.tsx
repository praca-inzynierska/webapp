import React from 'react'
import { Provider } from 'react-redux'
import RootNavigator from './src/navigation'
import { AppState } from 'react-native'
import { Launch } from './src/components'
import { createStore } from 'redux'
import rootReducer from './src/reducers/reducers'
import { loadState, saveState } from './src/utils/asyncStorage'
import api from './src/utils/api'

interface State {
  appState: string
  appStoresReady: boolean
  store: any
}

class App extends React.Component<{}, State> {
  constructor (props: any) {
    super(props)

    this.state = {
      appState: AppState.currentState,
      appStoresReady: false,
      store: null
    }
  }

  async componentDidMount () {
    const store = createStore(rootReducer, await loadState(), (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__())
    const auth: any = store.getState().auth
    if (auth.token !== undefined) api.defaults.headers.Token = auth.token
    this.setState({ appStoresReady: true, store: store })
    store.subscribe(() => {
      saveState({
        auth: store.getState().auth
      })
    })
  }

  render () {
    return this.state.appStoresReady
      ? (<Provider store={this.state.store}>
        <RootNavigator />
      </Provider>)
      : (<Launch />)
  }
}

export default App

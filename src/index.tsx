import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { loadState, saveState } from './util/localStorage'
import api from './util/api'
import Notifications, { notify } from 'react-notify-toast'
import { logout } from './actions/index'
// import * as serviceWorker from './serviceWorker';

const persistedState = loadState()
const store = createStore(rootReducer, persistedState, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__())
const auth: any = store.getState().auth
if (auth.token !== undefined) api.defaults.headers.Token = auth.token
api.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    if (error.response.status === 401) {
      store.dispatch(logout())
      window.location.assign('/login')
    } else {
      notify.show(`Błąd: ${error.message}`, 'error')
      return Promise.reject(error)
    }
  }
})
store.subscribe(() => {
  saveState({
    auth: store.getState().auth
  })
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Notifications/>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

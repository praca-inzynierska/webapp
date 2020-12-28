import firebase from 'firebase'

const fb = firebase

class Fire {
  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyDl-7_2kSfC0HV8nJvqVbzR2-seAmBMnQI',
        authDomain: 'mche-a230b.firebaseapp.com',
        databaseURL: 'https://mche-a230b.firebaseio.com',
        projectId: 'mche-a230b',
        storageBucket: 'mche-a230b.appspot.com',
        messagingSenderId: '896425648444',
        appId: '1:896425648444:web:53708b81d1cc0e11b43e39'
      })
    }
  }

  checkAuth = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously()
      }
    })
  }

  constructor () {
    this.init()
    this.checkAuth()
  }

  send = messages => {
    messages.forEach(item => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user
      }

      this.db.push(message)
    })
  }

  parse = message => {
    const { user, text, timestamp } = message.val()
    const { key: _id } = message
    const createdAt = new Date(timestamp)

    return {
      _id,
      createdAt,
      text,
      user
    }
  }

  get = callback => {
    this.db.on('child_added', snapshot => callback(this.parse(snapshot)))
  }

  off () {
    this.db.off()
  }

  get db () {
    return firebase.database().ref('messages')
  }

  get uid () {
    return (firebase.auth().currentUser || {}).uid
  }
}

export default new Fire()

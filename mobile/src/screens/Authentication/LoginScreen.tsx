import 'react-native-get-random-values'
import React from 'react'
import { Button, StyleSheet, TextInput, ToastAndroid, View } from 'react-native'
import { Fonts } from '../../assets'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { SceneMap, TabView } from 'react-native-tab-view'
import api from '../../utils/api'

interface State {
  login: string,
  password: string,
  name: string,
  surname: string,
  email: string,
  index: number,
  routes: any
}

interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

class LoginScreen extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      // login: "danuta placek",
      // login: "dorota bławatek",
      login: 'adela bławatek',
      password: 'asd',
      name: '',
      surname: '',
      email: '',
      index: 0,
      routes: [{ key: 'login', title: 'Login' }, { key: 'register', title: 'Register' }]
    }
  }

    LoginRoute = () => (
      <View style={styles.container}>
        <TextInput
          style={{ height: 40, alignSelf: 'stretch', borderColor: 'gray', borderWidth: 1 }}      //TODO add to components
          onChangeText={(text) => {
            this.setState({
              login: text
            })
          }}
          placeholder="Login"
        />
        <TextInput
          style={{ height: 40, alignSelf: 'stretch', borderColor: 'gray', borderWidth: 1 }}      //TODO add to components
          onChangeText={(text) => {
            this.setState({
              password: text
            })
          }}
          placeholder="Hasło"
        />
        <Button title={'Zaloguj'}
          onPress={this.handleLogin}/>
      </View>

    )

     RegisterRoute = () => (
       <View style={styles.container}>
         <TextInput
           style={{ height: 40, alignSelf: 'stretch', borderColor: 'gray', borderWidth: 1 }}      //TODO add to components
           onChangeText={(text) => {
             this.setState({
               login: text
             })
           }}
           placeholder="Login"
         />
         <TextInput
           style={{ height: 40, alignSelf: 'stretch', borderColor: 'gray', borderWidth: 1 }}      //TODO add to components
           onChangeText={(text) => {
             this.setState({
               password: text
             })
           }}

           placeholder="Hasło"
         />
         <TextInput
           style={{ height: 40, alignSelf: 'stretch', borderColor: 'gray', borderWidth: 1 }}      //TODO add to components
           onChangeText={(text) => {
             this.setState({
               password: text
             })
           }}
           placeholder="Email"
         />
         <TextInput
           style={{ height: 40, alignSelf: 'stretch', borderColor: 'gray', borderWidth: 1 }}      //TODO add to components
           onChangeText={(text) => {
             this.setState({
               password: text
             })
           }}
           placeholder="Imię"
         />
         <TextInput
           style={{ height: 40, alignSelf: 'stretch', borderColor: 'gray', borderWidth: 1 }}      //TODO add to components
           onChangeText={(text) => {
             this.setState({
               password: text
             })
           }}
           placeholder="Nazwisko"
         />
         <Button title="Zarejestruj"
           onPress={this.handleRegister}/>
       </View>
     )

     render () {
       return (
         <TabView
           navigationState={this.state}
           renderScene={SceneMap({
             login: this.LoginRoute,
             register: this.RegisterRoute,
           })}
           onIndexChange={index => this.setState({ index })}
         />
       )
     }

    handleLogin = async () => {
      const data = {
        username: this.state.login,
        password: this.state.password
      }
      const url = '/login'
      await api.post(url, data)
        .then((response: any) => {
          this.props.navigation.navigate({ routeName: 'Zajęcia', params: response.data })
        })
        .catch((e:any) => {
          console.log(e)
          ToastAndroid.show('Niepoprawny login lub hasło', ToastAndroid.SHORT)
        })
    }

    handleRegister = async () => {
      const data = {
        username: this.state.login,
        password: this.state.password,
        first_name: this.state.name,
        last_name: this.state.surname,
      }
      const url = '/register'
      api.post(url, data)
        .then((response: any) => {
          this.props.navigation.navigate({ routeName: 'routeHome', params: response })
        })
        .catch((e:any) => {
          console.log(e)
          ToastAndroid.show('Niepoprawne dane', ToastAndroid.SHORT)
        })
        // this.props.navigation.navigate({routeName: "routeHome"})
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'space-around'

  },
  text: {
    ...Fonts.title
  }
})

export default LoginScreen

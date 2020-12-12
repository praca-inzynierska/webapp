import React, { ComponentProps, FormEvent } from 'react'
import api from '../../util/api'
import { withRouter } from 'react-router'
import { Checkbox, Pivot, PivotItem, PrimaryButton, Stack, TextField } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { login } from '../../actions'

type TState = {
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  isTeacher: boolean,
  isLogin: boolean
}

class Login extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.onInputChange = this.onInputChange.bind(this)
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)

    this.state = {
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      isTeacher: true,
      isLogin: true
    }
  }

  handleConfirm () {
    const data = {
      username: this.state.username,
      password: this.state.password
    }
    if (!this.state.isLogin) {
      Object.assign(data, {
        isTeacher: this.state.isTeacher,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      })
    }
    const url = this.state.isLogin ? '/login' : '/register'
    api.post(url, data)
      .then((response) => {
        const { history } = this.props
        api.defaults.headers.Token = response.data.token
        this.props.login(response.data.token, response.data.username, response.data.isTeacher)
        history.push('/home')
      })
      .catch(e => console.log(e))
  }

  onInputChange (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = (event!.target as HTMLInputElement)
    this.setState({ [target.name]: target.value })
  }

  onCheckboxChange = (event?: FormEvent<HTMLInputElement | HTMLElement> | undefined, checked?: boolean | undefined) => {
    const target = (event!.target as HTMLInputElement)
    this.setState({ [target.name]: checked })
  }

  render () {
    const { state } = this
    const stackTokens = { childrenGap: 10, padding: 10 }
    return (
      <div className="page">
        <Stack tokens={stackTokens}>
          <Pivot aria-label="Basic Pivot Example">
            <PivotItem headerText="Logowanie">
              <Stack tokens={stackTokens}>
                <TextField
                  onChange={this.onInputChange}
                  name="username"
                  placeholder="Login"
                  value={state.username}
                />
                <TextField
                  onChange={this.onInputChange}
                  name="password"
                  placeholder="Hasło"
                  value={state.password}
                  type="password"
                />
              </Stack>
            </PivotItem>
            <PivotItem headerText="Rejestracja">
              <Stack tokens={stackTokens}>
                <TextField
                  onChange={this.onInputChange}
                  name="username"
                  placeholder="Login"
                  value={state.username}
                />
                <TextField
                  onChange={this.onInputChange}
                  name="password"
                  placeholder="Hasło"
                  value={state.password}
                  type="password"
                />
                <TextField
                  onChange={this.onInputChange}
                  name="email"
                  placeholder="Email"
                  value={state.email}
                  type="email"
                />
                <TextField
                  onChange={this.onInputChange}
                  name="firstName"
                  placeholder="Imię"
                  value={state.firstName}
                  type="firstName"
                />
                <TextField
                  onChange={this.onInputChange}
                  name="lastName"
                  placeholder="Nazwisko"
                  value={state.lastName}
                  type="lastName"
                />
                <Checkbox
                  name="isTeacher"
                  onChange={this.onCheckboxChange}
                  checked={state.isTeacher}
                  label="Nauczyciel"
                />
              </Stack>
            </PivotItem>
          </Pivot>
          <PrimaryButton onClick={this.handleConfirm}>
            {state.isLogin ? 'Zaloguj' : 'Zarejestruj'}
          </PrimaryButton>
        </Stack>
      </div>
    )
  }
}

const actionCreators = {
  login: login
}

const component = connect(
  null,
  actionCreators
)(Login)

export default withRouter(component)

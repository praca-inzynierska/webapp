import React, { ComponentProps } from 'react'
import api from '../../util/api'
import { Box, Button, Heading } from 'react-bulma-components'
import { withRouter } from 'react-router'
import { Control, Field, Input, Label } from 'react-bulma-components/lib/components/form'
import { connect } from 'react-redux'
import { login } from '../../actions'

type TState = {
  username: string,
  password: string
}

class Login extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.onInputChange = this.onInputChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)

    this.state = {
      username: '',
      password: ''
    }
  }

  handleLogin () {
    const data = this.state
    api.post('/login', data)
      .then((response) => {
        const { history } = this.props
        api.defaults.headers.Token = response.data.token
        this.props.login(response.data.token)
        history.push('/tasks')
      })
      .catch(e => console.log(e))
  }

  onInputChange (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    const { state } = this
    return (
      <div className="mainBox">
        <Box>
          <Heading size={2}>Logowanie</Heading>
        </Box>
        <Box>
          <Field>
            <Label>Login</Label>
            <Control>
              <Input
                onChange={this.onInputChange}
                name="username"
                placeholder="Login"
                value={state.username}
              />
            </Control>
          </Field>
          <Field>
            <Label>Hasło</Label>
            <Control>
              <Input
                onChange={this.onInputChange}
                name="password"
                placeholder="Hasło"
                value={state.password}
                type="password"
              />
            </Control>
          </Field>
        </Box>
        <Box>
          <Button color="success" onClick={this.handleLogin}>
            Zaloguj
          </Button>
        </Box>
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

import React, { ComponentProps } from 'react'
import api from '../../util/api'
import { Box, Button, Heading } from 'react-bulma-components'
import { withRouter } from 'react-router'
import { Control, Field, Input, Label } from 'react-bulma-components/lib/components/form'

type TState = {
  login: string,
  password: string
}

class Login extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.onInputChange = this.onInputChange.bind(this)
    this.login = this.login.bind(this)

    this.state = {
      login: '',
      password: ''
    }
  }

  login () {
    const data = this.state
    api.post('/login', data)
      .then((response) => {
        const { history } = this.props
        api.defaults.headers.Token = response.data.token
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
                name="login"
                placeholder="Login"
                value={state.login}
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
          <Button color="success" onClick={this.login}>
            Zaloguj
          </Button>
        </Box>
      </div>
    )
  }
}

export default withRouter(Login)

import React, { ComponentProps } from 'react'
import api from '../../util/api'
import { Box, Button, Tabs, Container } from 'react-bulma-components'
import { withRouter } from 'react-router'
import { Checkbox, Control, Field, Input, Label } from 'react-bulma-components/lib/components/form'
import { connect } from 'react-redux'
import { login } from '../../actions'

type TState = {
  username: string,
  password: string,
  email: string,
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
      isTeacher: true,
      isLogin: true
    }
  }

  handleConfirm () {
    const data = {
      username: this.state.username,
      password: this.state.password,
    }
    if (!this.state.isLogin) {
      Object.assign(data, { isTeacher: this.state.isTeacher })
    }
    const url = this.state.isLogin ? '/login' : '/register'
    api.post(url, data)
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

  onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.checked })
  }

  render () {
    const { state } = this
    return (
      <div className="page">
        <Container>
          <Tabs
            fullwidth={true}
          >
            <Tabs.Tab active={state.isLogin} onClick={() => this.setState({ isLogin: true })}>
            Logowanie
            </Tabs.Tab>
            <Tabs.Tab active={!state.isLogin} onClick={() => this.setState({ isLogin: false })}>
            Rejestracja
            </Tabs.Tab>
          </Tabs>
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
          {!state.isLogin ? (
            <div>
              <Field>
                <Label>Email</Label>
                <Control>
                  <Input
                    onChange={this.onInputChange}
                    name="email"
                    placeholder="Email"
                    value={state.email}
                    type="email"
                  />
                </Control>
              </Field>
              <Field>
                <Checkbox
                  name="isTeacher"
                  onChange={this.onCheckboxChange}
                  checked={state.isTeacher}
                >
                Nauczyciel
                </Checkbox>
              </Field>
            </div>
          ) : ''}

          <Box>
            <Button color="success" onClick={this.handleConfirm}>
              {state.isLogin ? 'Zaloguj' : 'Zarejestruj'}
            </Button>
          </Box>
        </Container>
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

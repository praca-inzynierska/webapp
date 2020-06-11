const auth = (state = [], action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return ({
        token: action.token,
        username: action.username
      })

    case 'LOGOUT':
      return ({
        token: undefined,
        username: undefined
      })

    default:
      return state
  }
}

export default auth

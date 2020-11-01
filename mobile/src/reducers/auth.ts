export default (state = [], action: any) => {
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

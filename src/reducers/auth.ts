const auth = (state = [], action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return ({
        token: action.token,
        username: action.username,
        isTeacher: action.isTeacher
      })

    case 'LOGOUT':
      return ({
        token: undefined,
        username: undefined,
        isTeacher: false,
      })

    default:
      return state
  }
}

export default auth

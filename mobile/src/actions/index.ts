export const login = (token: string, username: string) => ({
  type: 'LOGIN',
  token: token,
  username: username
})

export const logout = () => ({
  type: 'LOGOUT',
})

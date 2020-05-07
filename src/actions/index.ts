export const login = (token: string) => ({
  type: 'LOGIN',
  token: token
})

export const logout = () => ({
  type: 'LOGOUT',
})

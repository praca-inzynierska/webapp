export const login = (token: string, username: string, isTeacher: boolean) => ({
  type: 'LOGIN',
  token: token,
  username: username,
  isTeacher: isTeacher
})

export const logout = () => ({
  type: 'LOGOUT',
})

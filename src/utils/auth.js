import Cookies from 'js-cookie'

export function getUserInfo() {
  const avatar = localStorage.getItem('avatar')
  const name = localStorage.getItem('name')
  let roles = localStorage.getItem('roles')
  roles = roles && roles.split(',')
  const userName = localStorage.getItem('userName')
  const uuid = localStorage.getItem('uuid')
  return { avatar, name, roles, userName, uuid }
}

export function saveUserInfo(data = {}) {
  const { avatar, name, roles, userName, uuid } = data
  localStorage.setItem('avatar', avatar)
  localStorage.setItem('name', name)
  localStorage.setItem('roles', roles)
  localStorage.setItem('userName', userName)
  localStorage.setItem('uuid', uuid)
}
export function clearUserInfo() {
  const allCookies = Cookies.get()
  Object.keys(allCookies).map(key => Cookies.remove(key))
  localStorage.clear()
}

export function getRoles() {
  return Cookies.get('roles').split(',')
}
// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

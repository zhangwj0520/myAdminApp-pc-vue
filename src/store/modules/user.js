import { login, logout } from '@/api/user'
import { getUserInfo, saveUserInfo, clearUserInfo } from '@/utils/auth'
import router, { resetRouter } from '@/router'

// const { avatar, name, roles, userName, uuid } = getUserInfo()
const state = {
  avatar: '', name: '', roles: [], userName: '', uuid: ''
}

const mutations = {
  SET_USERNAME: (state, userName) => {
    state.userName = userName
  },
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password, loginType } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName, password, loginType }).then(response => {
        const { data } = response
        saveUserInfo(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    const data = getUserInfo()
    const { avatar, name, roles, userName, uuid } = data
    commit('SET_ROLES', roles)
    commit('SET_NAME', name)
    commit('SET_AVATAR', avatar)
    commit('SET_USERNAME', userName)
    commit('SET_UUID', uuid)
    const hasUserInfo = avatar && name && roles && userName && uuid
    return hasUserInfo && roles
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_ROLES', [])
        clearUserInfo()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROLES', [])
      clearUserInfo()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      // setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

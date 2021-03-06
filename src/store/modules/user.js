import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: '', //getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
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
  },

  actions: {
    // User name login
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.secret)
        .then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // Get user information
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
        .then(response => {
          if (!response.data) { // Since mockjs doesn't support custom status codes this can only be hacked
          reject('error')
        }
        const data = response.data
        const roles = ['admin']
        commit('SET_ROLES', roles) // data.roles
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_INTRODUCTION', data.introduction)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // Third-party verification login
  // LoginByThirdparty({ commit, state }, code) {
  //   return new Promise((resolve, reject) => {
  //     commit('SET_CODE', code)
  //     loginByThirdparty(state.status, state.email, state.code).then(response => {
  //       commit('SET_TOKEN', response.data.token)
  //       setToken(response.data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // Sign out
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // Front end
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  ChangeRoles({ commit }, role) {
    return new Promise(resolve => {
      commit('SET_TOKEN', role)
      setToken(role)
      getUserInfo(role).then(response => {
        const data = response.data
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_INTRODUCTION', data.introduction)
        resolve()
      })
    })
  }
}
}

export default user

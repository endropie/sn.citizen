import { axiosInstance } from 'boot/axios'
import { Cookies } from 'quasar'

const REGISTER_ROUTE = '/api/auth/register'
const VERIFICATION_ROUTE = '/api/auth/verify'
const LOGIN_ROUTE = '/api/auth/login'
const FETCH_USER_ROUTE = '/api/auth/fetch'
const PASSWORD_FORGOT_ROUTE = '/api/auth/password/forgot'
const PASSWORD_RESET_ROUTE = '/api/auth/password/reset'

export function register (state, data) {
  return axiosInstance.post(REGISTER_ROUTE, data)
}

export function login (state, data) {
  const p = new Promise(function (resolve, reject) {
    return axiosInstance
      .post(LOGIN_ROUTE, { ...data.body, device_name: process.platform })
      .then(response => {
        state.commit('setUser', response.data.user)
        const token = response.data.access_token
        state.dispatch('setHeader', { token: token, rememberMe: data.rememberMe })
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  })
  return p
}

export function setHeader (state, data) {
  axiosInstance.defaults.headers.common.Authorization = 'Bearer ' + data.token
  if (data.rememberMe) {
    Cookies.set('authorization_token', data.token, {
      expires: 365
    })
  } else {
    Cookies.set('authorization_token', data.token)
  }
}

export async function fetch (state) {
  var token = Cookies.get('authorization_token')
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = 'Bearer ' + token
  }
  if (axiosInstance.defaults.headers.common.Authorization) {
    return axiosInstance.get(FETCH_USER_ROUTE).then(response => {
      state.commit('setUser', response.data)
    }).then(() => {
      state.dispatch('loginCallback')
    }).catch(error => {
      if (process.env.DEV) console.error('FETCH', error.response || error)
    })
  } else {
    return new Promise((resolve, reject) => {
      reject('No authorization token found')
    })
  }
}

export function logout (state) {
  delete axiosInstance.defaults.headers.common.Authorization
  Cookies.remove('authorization_token')
  state.commit('setUser', null)
}

export function verify (state, token) {
  return axiosInstance.get(VERIFICATION_ROUTE + '?token=' + token)
}
export function passwordForgot (state, data) {
  return axiosInstance.post(PASSWORD_FORGOT_ROUTE, data)
}

export function passwordReset (state, { token, data }) {
  return axiosInstance.post(PASSWORD_RESET_ROUTE + '?token=' + token, data)
}

export function loginCallback (state, data = {}) {
  for (const loginCallback of state.state.loginCallbacks) {
    loginCallback({ router: data.router })
  }
}

import request from '@/utils/request'

export function loginByUsername(username, secret) {
  const data = {
    username,
    secret
  }
  return request({
    url: '/accounts/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

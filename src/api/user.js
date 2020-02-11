import { cmips as request } from '@/utils/http'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}
export function getAuthority() {
  return request({
    url: '/v1/manager/authority',
    method: 'get'
  })
}


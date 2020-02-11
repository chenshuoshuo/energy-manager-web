import { cmips as request } from '@/utils/http'

export function listSysconfig() {
  return request({
    url: '/v1/sysconfig/list',
    method: 'get'
  })
}

export function updateSysconfig(data) {
  return request({
    url: `/v1/sysconfig`,
    method: 'post',
    data
  })
}

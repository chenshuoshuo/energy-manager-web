import { cmips as request } from '@/utils/http'

export function infoBulkUpdate(params) {
  return request({
    url: '/nom/info/bulkUpdate',
    method: 'put',
    params: params
  })
}
export function infoUpdate(params) {
  return request({
    url: '/nom/info/update',
    method: 'put',
    params: params
  })
}


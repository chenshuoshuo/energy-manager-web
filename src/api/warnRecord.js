import { cmips as request } from '@/utils/http'

export function getWarnPage(params) {
  return request({
    url: '/nom/warn/page',
    method: 'get',
    params: params
  })
}
export function deleteWarnRecord(params) {
  return request({
    url: '/nom/warn/delete',
    method: 'delete',
    params: params
  })
}
export function bulkDeleteWarnRecord(params) {
  return request({
    url: '/nom/warn/bulkDelete',
    method: 'delete',
    params: params
  })
}
export function downloadWarnRecord(params) {
  return request({
    url: '/nom/warn/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

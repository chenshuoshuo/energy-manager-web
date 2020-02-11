import { cmips as request, cmgis } from '@/utils/http'

// 获取网络设备列表
export function getEquipList(data) {
  return request({
    url: '/nom/info/page',
    method: 'get',
    params: data
  })
}
// 获得大楼信息
export function getBuilding() {
  return request({
    url: '/mapBuilding/listQuery',
    method: 'get'
  })
}
// 获得校区信息
export function getCampusmsg() {
  return cmgis({
    url: '/map/v2/group/list',
    method: 'get'
  })
}
// 删除单条数据
export function singleDeleteData(data) {
  return request({
    url: '/nom/info/delete',
    method: 'delete',
    params: data
  })
}
// 批量删除
export function BatchDeleteData(data) {
  return request({
    url: '/nom/info/bulkDelete',
    method: 'delete',
    params: data
  })
}
// 下载导入模板
export function downloadTemplate(typeCode) {
  return request({
    url: `/nom/info/downloadTemplate/${typeCode}`,
    method: 'get',
    responseType: 'blob'
  })
}
// 导出
export function download(data) {
  return request({
    url: '/nom/info/download',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
// 导入
export function importData(data, typeCode) {
  return request({
    url: `/nom/info/upload/${typeCode}`,
    method: 'post',
    // responseType: 'blob',
    data
  })
}
// 错误数据导出
export function exportErrorData(synId) {
  return request({
    url: '/nom/synErrorLog/download',
    responseType: 'blob',
    params: synId
  })
}

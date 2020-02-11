import { cmips as request } from '@/utils/http'

export function getFieldConfig(configId) {
  return request({
    url: `/nom/config/get/${configId}`,
    method: 'get'
  })
}
export function upload(data) {
  return request({
    url: '/nom/config/upload',
    method: 'post',
    data
    // headers:{'Content-Type':'multipart/form-data'}
  })
}
export function getDockingConfig() {
  return request({
    url: '/nom/nomDocking/qureyList',
    method: 'get'
  })
}
// 产品配置提交保存，调用里；两次接口
export function saveDockingConfig(data) {
  return request({
    url: '/nom/nomDocking/save',
    method: 'post',
    data
  })
}
// 产品配置提交保存
export function saveProCongig(data) {
  return request({
    url: '/nom/config/save',
    method: 'post',
    data
  })
}
// 根据获取字段（1、2）获取字段配置信息
export function fieldData(fieldId) {
  return request({
    url: `/nom/extends/list/${fieldId}`,
    method: 'get'
  })
}
// 字段配置保存
export function saveExtends(data) {
  return request({
    url: '/nom/extends/save',
    method: 'post',
    data
  })
}
// 获取同步数据中 二级列表
export function syncTreeList() {
  return request({
    url: '/thematic/type/queryAuthedThematicList',
    method: 'get'
  })
}
// 获取同步数据运维字段
export function getAttributes(typeCode) {
  return request({
    url: `/nom/extends/list/${typeCode}`,
    method: 'get'
  })
}
// 获取同步数据专题图数据
export function getThematicMap(typeCode) {
  return request({
    url: `/nom/extends/list/thematic/attributes/${typeCode}`,
    method: 'get'
  })
}
// 获取同步数据中其他同步数据信息
export function getOtherMsg(data) {
  return request({
    url: '/nom/extends/list/extra',
    method: 'get',
    params: data
  })
}
export function getCountAllByTypeCode(data) {
  return request({
    url: '/thematic/type/countAllByTypeCode',
    method: 'get',
    params: data
  })
}
export function synData(data) {
  return request({
    url: '/nom/extends/syn',
    method: 'get',
    params: data
  })
}

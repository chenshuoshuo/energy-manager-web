import { cmips as request } from '@/utils/http'

export function queryBuildingList(params) {
  return request({
    url: '/mapBuilding/listQuery',
    method: 'get',
    params: params
  })
}

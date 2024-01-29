import request from '@/utils/request'

// 查询环境列表
export function listEnvironment(query) {
  return request({
    url: '/system/environment/list',
    method: 'get',
    params: query
  })
}

// 查询环境详细
export function getEnvironment(envirId) {
  return request({
    url: '/system/environment/' + envirId,
    method: 'get'
  })
}

// 新增环境
export function addEnvironment(data) {
  return request({
    url: '/system/environment',
    method: 'post',
    data: data
  })
}

// 修改环境
export function updateEnvironment(data) {
  return request({
    url: '/system/environment',
    method: 'put',
    data: data
  })
}

// 删除环境
export function delEnvironment(envirId) {
  return request({
    url: '/system/environment/' + envirId,
    method: 'delete'
  })
}

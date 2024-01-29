import request from '@/utils/request'
//查询环境列表
export function listEnvironment(query) {
  return request({
    url: '/system/environment/list',
    method: 'get',
    params: query
  })
}

// 查询接口管理列表
export function listInterinfo(query) {
  return request({
    url: '/system/interinfo/list',
    method: 'get',
    params: query
  })
}

// 查询接口管理详细
export function getInterinfo(interId) {
  return request({
    url: '/system/interinfo/' + interId,
    method: 'get'
  })
}

// 新增接口管理
export function addInterinfo(data) {
  return request({
    url: '/system/interinfo',
    method: 'post',
    data: data
  })
}

// 修改接口管理
export function updateInterinfo(data) {
  return request({
    url: '/system/interinfo',
    method: 'put',
    data: data
  })
}

// 删除接口管理
export function delInterinfo(interId) {
  return request({
    url: '/system/interinfo/' + interId,
    method: 'delete'
  })
}

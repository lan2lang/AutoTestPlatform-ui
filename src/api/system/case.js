import request from '@/utils/request'

// 查询用例管理列表
export function listCase(query) {
  return request({
    url: '/system/case/list',
    method: 'get',
    params: query
  })
}

// 查询用例管理详细
export function getCase(caseId) {
  return request({
    url: '/system/case/' + caseId,
    method: 'get'
  })
}

// 新增用例管理
export function addCase(data) {
  return request({
    url: '/system/case',
    method: 'post',
    data: data
  })
}

// 修改用例管理
export function updateCase(data) {
  return request({
    url: '/system/case',
    method: 'put',
    data: data
  })
}

// 删除用例管理
export function delCase(caseId) {
  return request({
    url: '/system/case/' + caseId,
    method: 'delete'
  })
}

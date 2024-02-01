import request from '@/utils/request'

// 生成测试报告
export function genTestReport(query) {
  return request({
    url: '/report',
    method: 'get',
    params: query
  })
}

// 查询测试结果列表
export function listTestresult(query) {
  return request({
    url: '/system/testresult/list',
    method: 'get',
    params: query
  })
}

// 查询测试结果详细
export function getTestresult(resultId) {
  return request({
    url: '/system/testresult/' + resultId,
    method: 'get'
  })
}

// 新增测试结果
export function addTestresult(data) {
  return request({
    url: '/system/testresult',
    method: 'post',
    data: data
  })
}

// 修改测试结果
export function updateTestresult(data) {
  return request({
    url: '/system/testresult',
    method: 'put',
    data: data
  })
}

// 删除测试结果
export function delTestresult(resultId) {
  return request({
    url: '/system/testresult/' + resultId,
    method: 'delete'
  })
}

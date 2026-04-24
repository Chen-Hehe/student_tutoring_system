import request from '../utils/request'

/**
 * 获取 AI 配置
 */
export function getAiConfig() {
  return request({
    url: '/api/admin/ai-config',
    method: 'get'
  })
}

/**
 * 更新 AI 配置
 */
export function updateAiConfig(data) {
  return request({
    url: '/api/admin/ai-config/update',
    method: 'post',
    data
  })
}

/**
 * 测试 AI 连接
 */
export function testAiConnection(data) {
  return request({
    url: '/api/admin/ai-config/test',
    method: 'post',
    data
  })
}

/**
 * 获取 AI 调用统计
 */
export function getAiStats() {
  return request({
    url: '/api/admin/ai-config/stats',
    method: 'get'
  })
}

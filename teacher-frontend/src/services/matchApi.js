import api from './api'

/**
 * 匹配管理 API
 */
export const matchAPI = {
  /**
   * 获取教师的匹配列表
   */
  getTeacherMatches: () => {
    return api.get('/matches/teacher')
  },

  /**
   * 获取 AI 推荐的学生列表
   */
  getTeacherRecommendations: () => {
    return api.get('/matches/recommendations/teacher')
  },

  /**
   * 发送辅导邀请
   */
  sendInvitation: (data) => {
    return api.post('/matches/invite', data)
  },

  /**
   * 接受辅导请求
   */
  acceptRequest: (matchId) => {
    return api.post(`/matches/${matchId}/accept`)
  },

  /**
   * 拒绝辅导请求
   */
  rejectRequest: (matchId) => {
    return api.post(`/matches/${matchId}/reject`)
  },

  /**
   * 更新匹配状态
   */
  updateStatus: (matchId, data) => {
    return api.put(`/matches/${matchId}/status`, data)
  },

  /**
   * 获取匹配详情
   */
  getDetail: (matchId) => {
    return api.get(`/matches/${matchId}`)
  },

  /**
   * 获取匹配统计数据
   */
  getStatistics: () => {
    return api.get('/matches/statistics')
  }
}

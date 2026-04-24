import api from './api'

/**
 * 匹配管理 API
 */
export const matchAPI = {
  /**
   * 获取教师的匹配列表
   */
  getTeacherMatches: (userId) => {
    return api.get('/matches/teacher', { params: { userId } })
  },

  /**
   * 获取 AI 推荐的学生列表
   */
  getTeacherRecommendations: (userId) => {
    return api.get(`/matches/recommendations/teacher/${userId}`)
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
  acceptRequest: (matchId, userId, userType) => {
    return api.post(`/matches/${matchId}/accept`, { userId, userType })
  },

  /**
   * 拒绝辅导请求
   */
  rejectRequest: (matchId, userId, userType) => {
    return api.post(`/matches/${matchId}/reject`, { userId, userType })
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
  getStatistics: (userId) => {
    return api.get('/matches/statistics', { params: { teacherId: userId } })
  }
}

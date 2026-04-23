import api from './api'

/**
 * 家长相关 API
 */
export const parentAPI = {
  /**
   * 获取家长的孩子列表
   * @returns {Promise} 孩子列表
   */
  getChildren: () => {
    return api.get('/parent/children')
  },

  /**
   * 绑定孩子
   * @param {number} studentId - 学生ID
   * @param {string} relationship - 关系
   * @returns {Promise} 操作结果
   */
  bindChild: (studentId, relationship) => {
    return api.post('/parent/bind-child', { studentId, relationship })
  },

  /**
   * 获取待家长确认的师生匹配请求
   * @returns {Promise} 匹配请求列表
   */
  getMatchRequests: () => {
    return api.get('/parent/match-requests')
  },

  /**
   * 确认或拒绝师生匹配请求
   * @param {number} matchId - 匹配ID
   * @param {boolean} confirm - 是否确认
   * @returns {Promise} 操作结果
   */
  confirmMatchRequest: (matchId, confirm) => {
    return api.put(`/parent/match-requests/${matchId}`, { confirm })
  },

  /**
   * 获取孩子的教师列表
   * @param {number} studentId - 学生ID
   * @returns {Promise} 教师列表
   */
  getTeachers: (studentId) => {
    return api.get('/parent/teachers', { params: { studentId } })
  },

  /**
   * 获取孩子的学习报告
   * @param {number} studentId - 学生ID
   * @returns {Promise} 学习报告列表
   */
  getLearningReports: (studentId) => {
    return api.get('/parent/learning-reports', { params: { studentId } })
  },

  /**
   * 获取孩子的心理状态评估
   * @param {number} studentId - 学生ID
   * @returns {Promise} 心理状态评估数据
   */
  getPsychologicalStatus: (studentId) => {
    return api.get('/parent/psychological-status', { params: { studentId } })
  },

  /**
   * 获取与教师的沟通记录
   * @param {number} studentId - 学生ID
   * @param {number} teacherId - 教师ID
   * @returns {Promise} 沟通记录列表
   */
  getCommunicationHistory: (studentId, teacherId) => {
    return api.get('/parent/communication-history', { params: { studentId, teacherId } })
  },

  /**
   * 获取心理辅导员列表（使用教师数据）
   * @returns {Promise} 辅导员列表
   */
  getCounselors: () => {
    return api.get('/users/list', { params: { role: 1 } })
  },

  /**
   * 发送沟通消息
   * @param {number} studentId - 学生ID
   * @param {number} teacherId - 教师ID
   * @param {string} content - 消息内容
   * @returns {Promise} 发送结果
   */
  sendMessage: (studentId, teacherId, content) => {
    return api.post('/parent/send-message', null, {
      params: { studentId, teacherId, content }
    })
  }
}

export default parentAPI

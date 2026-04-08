import api from './api'

/**
 * 心理评估 API
 */
export const psychologicalAPI = {
  /**
   * 获取评估列表
   */
  getList: (params) => {
    return api.get('/psychological', { params })
  },

  /**
   * 获取评估详情
   */
  getDetail: (id) => {
    return api.get(`/psychological/${id}`)
  },

  /**
   * 创建评估
   */
  create: (data) => {
    return api.post('/psychological', data)
  },

  /**
   * 更新评估
   */
  update: (id, data) => {
    return api.put(`/psychological/${id}`, data)
  },

  /**
   * 删除评估
   */
  delete: (id) => {
    return api.delete(`/psychological/${id}`)
  },

  /**
   * 获取学生的评估历史
   */
  getStudentHistory: (studentId) => {
    return api.get(`/psychological/student/${studentId}`)
  }
}

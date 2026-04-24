import api from './api'

/**
 * 用户相关 API
 */
export const userAPI = {
  /**
   * 获取用户列表
   * @param {number} role - 角色筛选（可选，1=教师，2=学生，3=家长，4=管理员）
   * @returns {Promise} 用户列表
   */
  getUsers: (role) => {
    const params = {}
    if (role !== undefined && role !== null) {
      params.role = role
    }
    return api.get('/auth/users/list', { params })
  }
}

export default api

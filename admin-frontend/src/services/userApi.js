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
    return api.get('/api/auth/users/list', { params })
  },

  /**
   * 编辑用户信息
   * @param {number} userId - 用户ID
   * @param {object} userData - 用户数据
   * @returns {Promise} 编辑结果
   */
  updateUser: (userId, userData) => {
    return api.put(`/api/auth/users/${userId}`, userData)
  },

  /**
   * 禁用/启用用户
   * @param {number} userId - 用户ID
   * @param {boolean} disabled - 是否禁用
   * @returns {Promise} 操作结果
   */
  toggleUserStatus: (userId, disabled) => {
    return api.put(`/api/auth/users/${userId}/status`, { disabled })
  }
}

export default api

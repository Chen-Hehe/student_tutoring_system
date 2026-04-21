import api from './api'

/**
 * 用户相关 API
 */
export const userAPI = {
  /**
   * 获取用户列表
   * @param {number} role - 角色筛选（可选，1=教师，2=学生，3=家长，4=管理员）
   * @param {string} keyword - 关键词搜索（用户名或姓名）
   * @param {number} status - 状态筛选（0=活跃，1=禁用）
   * @returns {Promise} 用户列表
   */
  getUsers: (page = 1, size = 10, role = null) => {
    const params = { page, size }
    if (role !== undefined && role !== null) {
      params.role = role
    }
    return api.get('/admin/users', { params })
  },

  /**
   * 编辑用户信息
   * @param {number} userId - 用户ID
   * @param {object} userData - 用户数据
   * @returns {Promise} 编辑结果
   */
  updateUser: (userId, userData) => {
    return api.post('/admin/users/edit', userData)
  },

  /**
   * 禁用/启用用户
   * @param {number} userId - 用户ID
   * @returns {Promise} 操作结果
   */
  toggleUserStatus: (userId) => {
    return api.post('/admin/users/disable', { id: userId })
  }
}

export default api

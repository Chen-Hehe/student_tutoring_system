import api from './api'

/**
 * 用户相关 API
 */
export const userAPI = {
  /**
   * 获取用户列表
   * @param {number} role - 可选，按角色筛选
   */
  getUsers: (role) => {
    const params = role ? { role } : {}
    return api.get('/auth/users/list', { params })
      .then(response => {
        console.log('【DEBUG】userAPI.getUsers 响应:', response)
        // 统一返回格式
        const data = response?.data
        if (Array.isArray(data)) {
          return data
        } else if (data?.data && Array.isArray(data.data)) {
          return data.data
        } else if (data?.success && Array.isArray(data.data)) {
          return data.data
        }
        return []
      })
      .catch(error => {
        console.error('获取用户列表失败:', error)
        return [] // 返回空数组而不是抛出错误
      })
  },
  
  /**
   * 获取用户信息
   * @param {number} userId - 用户 ID
   */
  getUserInfo: (userId) => {
    return api.get(`/auth/users/${userId}`)
  }
}

export default userAPI

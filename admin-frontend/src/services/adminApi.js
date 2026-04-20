import api from './api'

export const adminAPI = {
  getStatistics: () => {
    return api.get('/admin/statistics')
  },

  getUsers: (page = 1, size = 10, role = null) => {
    const params = { page, size }
    if (role) {
      params.role = role
    }
    return api.get('/admin/users', { params })
  }
}

export default adminAPI

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
  },
  getResources: (keyword, type, uploaderId) => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (type) params.type = type
    if (uploaderId) params.uploaderId = uploaderId
    return api.get('/admin/content/resources', { params })
  },
  getLearningMaterials: (keyword, subject) => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (subject) params.subject = subject
    return api.get('/admin/content/learning-materials', { params })
  },
  getAnnouncements: (keyword, status) => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (status) params.status = status
    return api.get('/admin/content/announcements', { params })
  },
  editUser: (userData) => {
    return api.post('/admin/users/edit', userData)
  },
  disableUser: (id) => {
    return api.post('/admin/users/disable', { id })
  }
}

export default adminAPI

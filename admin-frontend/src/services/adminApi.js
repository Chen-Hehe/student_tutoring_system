import api from './api'

export const adminAPI = {
  getStatistics: () => {
    return api.get('/api/admin/statistics')
  },
  getUsers: (page = 1, size = 10, role = null) => {
    const params = { page, size }
    if (role) {
      params.role = role
    }
    return api.get('/api/admin/users', { params })
  },
  getResources: (keyword, type, uploaderId) => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (type) params.type = type
    if (uploaderId) params.uploaderId = uploaderId
    return api.get('/api/admin/content/resources', { params })
  },
  getLearningMaterials: (keyword, subject) => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (subject) params.subject = subject
    return api.get('/api/admin/content/learning-materials', { params })
  }
}

export default adminAPI

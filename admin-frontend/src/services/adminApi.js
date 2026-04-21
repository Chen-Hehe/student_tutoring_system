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
  },
  getAnnouncements: (keyword, status) => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (status) params.status = status
    return api.get('/api/admin/content/announcements', { params })
  },
  editUser: (userData) => {
    return api.post('/api/admin/users/edit', userData)
  },
  disableUser: (id) => {
    return api.post('/api/admin/users/disable', { id })
  },
  // 轮播图管理
  getCarousels: (status) => {
    const params = {}
    if (status) params.status = status
    return api.get('/api/admin/content/carousels', { params })
  },
  addCarousel: (carousel) => {
    return api.post('/api/admin/content/carousels', carousel)
  },
  updateCarousel: (id, carousel) => {
    return api.put(`/api/admin/content/carousels/${id}`, carousel)
  },
  deleteCarousel: (id) => {
    return api.delete(`/api/admin/content/carousels/${id}`)
  }
}

export default adminAPI

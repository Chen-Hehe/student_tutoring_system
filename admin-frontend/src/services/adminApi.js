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
  },
  // 教学资源编辑和删除
  editResource: (resourceData) => {
    return api.post('/admin/content/resources/edit', resourceData)
  },
  deleteResource: (id) => {
    return api.post('/admin/content/resources/delete', { id })
  },
  // 学习资料编辑和删除
  editLearningMaterial: (materialData) => {
    return api.post('/admin/content/learning-materials/edit', materialData)
  },
  deleteLearningMaterial: (id) => {
    return api.post('/admin/content/learning-materials/delete', { id })
  },
  // 公告编辑和删除
  editAnnouncement: (announcementData) => {
    return api.post('/admin/content/announcements/edit', announcementData)
  },
  deleteAnnouncement: (id) => {
    return api.post('/admin/content/announcements/delete', { id })
  }
}

export default adminAPI

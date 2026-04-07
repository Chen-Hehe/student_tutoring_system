import api from './api'

/**
 * 教学资源 API
 */
export const resourcesAPI = {
  /**
   * 获取资源列表
   */
  getList: (params) => {
    return api.get('/resources', { params })
  },

  /**
   * 获取资源详情
   */
  getDetail: (id) => {
    return api.get(`/resources/${id}`)
  },

  /**
   * 创建资源
   */
  create: (data) => {
    return api.post('/resources', data)
  },

  /**
   * 更新资源
   */
  update: (id, data) => {
    return api.put(`/resources/${id}`, data)
  },

  /**
   * 删除资源
   */
  delete: (id) => {
    return api.delete(`/resources/${id}`)
  },

  /**
   * 上传文件
   */
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

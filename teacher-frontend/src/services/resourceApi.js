import api from './api'

/**
 * 教学资源 API
 */
export const resourcesAPI = {
  /**
   * 获取资源列表
   */
  getList: (params) => {
    return api.get('/api/resources/list', { params })
  },

  /**
   * 获取资源详情
   */
  getDetail: (id) => {
    return api.get(`/api/resources/${id}`)
  },

  /**
   * 更新资源
   */
  update: (id, data) => {
    return api.put(`/api/resources/${id}`, data)
  },

  /**
   * 上传资源文件（包含所有元数据）
   */
  uploadResource: (file, title, description, type, category, uploaderId) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('type', type)
    formData.append('category', category)
    formData.append('uploaderId', uploaderId)
    
    return api.post('/api/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  /**
   * 删除资源
   */
  delete: (id) => {
    return api.delete(`/api/resources/${id}`)
  },
  
  /**
   * 增加下载次数
   */
  incrementDownloadCount: (id) => {
    return api.post(`/api/resources/${id}/download`)
  }
}

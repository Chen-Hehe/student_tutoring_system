import api from './api'

/**
 * 学习资源 API
 */
export const resourcesAPI = {
  /**
   * 获取资源列表
   * @param {Object} params - 查询参数
   * @param {string} params.category - 科目分类
   * @param {string} params.type - 资源类型
   */
  getList: (params) => {
    return api.get('/resources/list', { params })
  },

  /**
   * 获取资源详情
   */
  getDetail: (id) => {
    return api.get(`/resources/${id}`)
  },
  
  /**
   * 增加下载次数
   */
  incrementDownloadCount: (id) => {
    return api.post(`/resources/${id}/download`)
  }
}

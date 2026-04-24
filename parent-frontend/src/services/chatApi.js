import api from './api'

/**
 * 聊天相关 API
 * 复用教师端的 API 接口
 */
export const chatAPI = {
  /**
   * 发送消息
   * @param {Object} data - 消息数据
   * @param {number} data.receiverId - 接收者 ID
   * @param {string} data.message - 消息内容
   * @param {number} data.type - 消息类型 (1:文字，2:图片，3:语音)
   * @param {string} [data.fileUrl] - 文件 URL
   */
  sendMessage: (data) => {
    return api.post('/chat/send', data)
      .then(response => {
        console.log('【DEBUG】sendMessage 响应:', response)
        // 后端返回格式：{ code: 200, message: "success", data: {...message} }
        // api.js 拦截器处理后：{ data: { success: true, data: {...message} } }
        const responseData = response?.data
        if (responseData?.success && responseData.data) {
          return { data: responseData.data }
        } else if (responseData?.data) {
          return { data: responseData.data }
        }
        return { data: null }
      })
      .catch(error => {
        console.error('发送消息失败:', error)
        throw error
      })
  },
  
  /**
   * 获取与指定用户的聊天记录
   * @param {number} userId - 目标用户 ID
   */
  getChatHistory: (userId) => {
    return api.get(`/chat/history/${userId}`)
      .then(response => {
        console.log('【DEBUG】getChatHistory 响应:', response)
        const data = response?.data
        if (Array.isArray(data)) {
          return { data }
        } else if (data?.data && Array.isArray(data.data)) {
          return { data: data.data }
        } else if (data?.success && Array.isArray(data.data)) {
          return { data: data.data }
        }
        return { data: [] }
      })
      .catch(error => {
        console.error('获取聊天记录失败:', error)
        return { data: [] }
      })
  },
  
  /**
   * 获取所有对话列表
   * @param {number} userId - 当前用户 ID
   */
  getConversations: (userId) => {
    if (!userId) {
      return Promise.resolve({ data: [] }) // 返回空数组而不是拒绝
    }
    return api.get('/chat/conversations', { params: { userId } })
      .then(response => {
        console.log('【DEBUG】getConversations 响应:', response)
        // 确保返回的是数组
        const data = response?.data
        if (Array.isArray(data)) {
          return { data }
        } else if (data?.data && Array.isArray(data.data)) {
          return { data: data.data }
        } else if (data?.success && Array.isArray(data.data)) {
          return { data: data.data }
        }
        return { data: [] }
      })
      .catch(error => {
        console.error('获取对话列表失败:', error)
        return { data: [] } // 返回空数组而不是抛出错误
      })
  },
  
  /**
   * 标记消息为已读
   * @param {number} senderId - 消息发送者 ID
   */
  markAsRead: (senderId) => {
    return api.post(`/chat/read/${senderId}`)
  },
  
  /**
   * 撤回消息
   * @param {number} messageId - 消息 ID
   */
  recallMessage: (messageId) => {
    return api.post(`/chat/recall/${messageId}`)
  }
}

export default chatAPI

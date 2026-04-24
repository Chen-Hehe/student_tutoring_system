import api from './api'

/**
 * 聊天相关 API
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
  },
  
  /**
   * 获取与指定用户的聊天记录
   * @param {number} userId - 目标用户 ID
   */
  getChatHistory: (userId) => {
    return api.get(`/chat/history/${userId}`)
  },
  
  /**
   * 获取所有对话列表
   * @param {number} userId - 当前用户 ID
   */
  getConversations: (userId) => {
    if (!userId) {
      return Promise.reject(new Error('缺少用户 ID 参数'))
    }
    return api.get('/chat/conversations', { params: { userId } })
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

export default api

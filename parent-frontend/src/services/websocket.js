import { message as antdMessage } from 'antd'

/**
 * WebSocket 服务（单例模式）
 * 复用教师端的 WebSocket 连接逻辑
 */
class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.messageListeners = []
    this.connectionListeners = []
    this.userId = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
  }

  /**
   * 连接 WebSocket
   * @param {number} userId - 用户 ID
   */
  connect(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket 已连接，跳过')
      this.userId = userId
      this.notifyConnectionChange(true)
      return
    }

    this.userId = userId
    // WebSocket 地址（与后端 WebSocketConfig 一致）
    const wsUrl = `ws://localhost:8080/ws-chat?userId=${userId}`
    
    console.log('正在连接 WebSocket:', wsUrl)
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log('WebSocket 连接成功')
      this.reconnectAttempts = 0
      this.notifyConnectionChange(true)
      this.startHeartbeat()
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('收到 WebSocket 消息:', data)
        this.notifyMessage(data)
      } catch (error) {
        console.error('解析 WebSocket 消息失败:', error)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket 连接关闭')
      this.stopHeartbeat()
      this.notifyConnectionChange(false)
      this.attemptReconnect()
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error)
      antdMessage.error('连接失败，请检查网络')
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.stopHeartbeat()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.userId = null
  }

  /**
   * 发送消息
   * @param {Object} data - 消息数据
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket 未连接，无法发送消息')
      antdMessage.warning('连接已断开，请刷新页面')
    }
  }

  /**
   * 检查是否已连接
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }

  /**
   * 监听消息
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消监听函数
   */
  onMessage(callback) {
    this.messageListeners.push(callback)
    return () => {
      this.messageListeners = this.messageListeners.filter(cb => cb !== callback)
    }
  }

  /**
   * 监听连接状态变化
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消监听函数
   */
  onConnectionChange(callback) {
    this.connectionListeners.push(callback)
    return () => {
      this.connectionListeners = this.connectionListeners.filter(cb => cb !== callback)
    }
  }

  /**
   * 通知消息监听器
   */
  notifyMessage(data) {
    this.messageListeners.forEach(cb => cb(data))
  }

  /**
   * 通知连接状态变化
   */
  notifyConnectionChange(connected) {
    this.connectionListeners.forEach(cb => cb(connected))
  }

  /**
   * 尝试重连
   */
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
      this.reconnectAttempts++
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      
      this.reconnectTimer = setTimeout(() => {
        this.connect(this.userId)
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.log('达到最大重连次数，停止重连')
      antdMessage.error('连接已断开，请刷新页面')
    }
  }

  /**
   * 启动心跳
   */
  startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' })
      }
    }, 30000) // 30 秒心跳
  }

  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}

// 导出单例
const wsService = new WebSocketService()
export default wsService

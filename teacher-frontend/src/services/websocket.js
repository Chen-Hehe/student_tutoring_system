/**
 * WebSocket 服务 - 用于实时聊天
 */
class WebSocketService {
  constructor() {
    this.socket = null
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000 // 3 秒后重连
    this.messageHandlers = []
    this.connectionHandlers = []
    this.errorHandlers = []
    this.shouldReconnect = false
    this.currentUserId = null
  }
  
  /**
   * 连接 WebSocket
   * @param {number} userId - 用户 ID
   */
  connect(userId) {
    if (!userId) {
      console.warn('缺少 userId，无法建立 WebSocket 连接')
      return
    }

    this.currentUserId = userId
    this.shouldReconnect = true

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket 已连接或连接中')
      return
    }
    
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws-chat'
    const url = `${wsUrl}?userId=${userId}`
    
    try {
      const socket = new WebSocket(url)
      this.socket = socket
      
      socket.onopen = () => {
        if (this.socket !== socket) {
          socket.close()
          return
        }
        console.log('WebSocket 连接成功')
        this.reconnectAttempts = 0
        this.connectionHandlers.forEach(handler => handler(true))
        this.startHeartbeat()
      }
      
      socket.onmessage = (event) => {
        if (this.socket !== socket) {
          return
        }
        try {
          const data = JSON.parse(event.data)
          this.messageHandlers.forEach(handler => handler(data))
        } catch (error) {
          console.error('解析 WebSocket 消息失败:', error)
        }
      }
      
      socket.onclose = (event) => {
        if (this.socket === socket) {
          this.socket = null
        }
        console.log('WebSocket 连接关闭:', event.code, event.reason)
        this.connectionHandlers.forEach(handler => handler(false))
        this.stopHeartbeat()
        if (this.shouldReconnect) {
          this.attemptReconnect(this.currentUserId)
        }
      }
      
      socket.onerror = (error) => {
        if (this.socket !== socket) {
          return
        }
        console.error('WebSocket 错误:', error)
        this.errorHandlers.forEach(handler => handler(error))
      }
    } catch (error) {
      console.error('创建 WebSocket 连接失败:', error)
      this.errorHandlers.forEach(handler => handler(error))
    }
  }
  
  /**
   * 发送消息
   * @param {Object} message - 消息对象
   */
  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket 未连接，消息发送失败')
      throw new Error('WebSocket 未连接')
    }
  }
  
  /**
   * 断开连接
   */
  disconnect() {
    this.shouldReconnect = false
    this.currentUserId = null
    this.stopHeartbeat()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.socket) {
      const socket = this.socket
      this.socket = null
      socket.close()
    }
  }
  
  /**
   * 尝试重连
   * @param {number} userId - 用户 ID
   */
  attemptReconnect(userId) {
    if (!this.shouldReconnect || !userId) {
      return
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('达到最大重连次数，停止重连')
      return
    }
    
    this.reconnectAttempts++
    console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
    
    this.reconnectTimer = setTimeout(() => {
      this.connect(userId)
    }, this.reconnectDelay * this.reconnectAttempts)
  }
  
  /**
   * 开始心跳
   */
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        // 发送心跳消息
        this.socket.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // 每 30 秒发送一次心跳
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
  
  /**
   * 添加消息处理器
   * @param {Function} handler - 消息处理函数
   */
  onMessage(handler) {
    this.messageHandlers.push(handler)
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
    }
  }
  
  /**
   * 添加连接状态处理器
   * @param {Function} handler - 连接状态处理函数
   */
  onConnectionChange(handler) {
    this.connectionHandlers.push(handler)
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler)
    }
  }
  
  /**
   * 添加错误处理器
   * @param {Function} handler - 错误处理函数
   */
  onError(handler) {
    this.errorHandlers.push(handler)
    return () => {
      this.errorHandlers = this.errorHandlers.filter(h => h !== handler)
    }
  }
  
  /**
   * 获取连接状态
   * @returns {boolean} 是否已连接
   */
  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN
  }
}

// 创建单例
const wsService = new WebSocketService()

export default wsService

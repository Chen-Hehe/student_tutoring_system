import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

class WebSocketService {
  constructor() {
    this.stompClient = null
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('/ws')
      this.stompClient = Stomp.over(socket)
      
      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        () => {
          console.log('WebSocket connected')
          resolve(this.stompClient)
        },
        (error) => {
          console.error('WebSocket connection failed:', error)
          reject(error)
        }
      )
    })
  }

  subscribe(destination, callback) {
    if (this.stompClient) {
      return this.stompClient.subscribe(destination, callback)
    }
  }

  send(destination, message) {
    if (this.stompClient) {
      this.stompClient.send(destination, {}, JSON.stringify(message))
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect()
      this.stompClient = null
    }
  }
}

export default new WebSocketService()

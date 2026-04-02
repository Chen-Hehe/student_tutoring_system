import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Input, Button, Avatar, List, Badge, Upload, message as antdMessage, Spin, Empty } from 'antd'
import { SendOutlined, PictureOutlined, AudioOutlined, SmileOutlined, PlusOutlined } from '@ant-design/icons'
import wsService from '../services/websocket'
import { chatAPI } from '../services/chatApi'
import UserListModal from '../components/UserListModal'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { TextArea } = Input

/**
 * 聊天页面组件
 */
const Chat = () => {
  // 获取当前用户信息
  const currentUser = useSelector((state) => state.auth.user)
  
  // 状态管理
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [pendingMessage, setPendingMessage] = useState('')
  
  // 引用
  const messagesEndRef = useRef(null)
  const uploadRef = useRef(null)
  
  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // 加载对话列表
  const loadConversations = async () => {
    if (!currentUser?.id) {
      console.warn('用户未登录，无法加载对话列表')
      return
    }
    try {
      const result = await chatAPI.getConversations(currentUser.id)
      setConversations(result.data || [])
    } catch (error) {
      console.error('加载对话列表失败:', error)
    }
  }
  
  // 加载聊天记录
  const loadChatHistory = async (userId) => {
    setLoading(true)
    try {
      const result = await chatAPI.getChatHistory(userId)
      setMessages(result.data || [])
      // 标记为已读
      await chatAPI.markAsRead(userId)
    } catch (error) {
      console.error('加载聊天记录失败:', error)
      antdMessage.error('加载聊天记录失败')
    } finally {
      setLoading(false)
    }
  }
  
  // 选择对话
  const selectConversation = (conversation) => {
    setSelectedConversation(conversation)
    loadChatHistory(conversation.userId)
  }
  
  // 开始新聊天
  const startNewChat = (user) => {
    // 创建新的对话对象
    const newConversation = {
      userId: user.id,
      userName: user.name || user.username,
      userAvatar: user.avatar,
      unreadCount: 0
    }
    setSelectedConversation(newConversation)
    setMessages([])
    setShowUserModal(false)
    
    // 如果有待发送的消息，发送它
    if (pendingMessage.trim()) {
      setInputValue(pendingMessage.trim())
      setPendingMessage('')
      // 自动发送
      setTimeout(() => {
        sendMessage()
      }, 100)
    }
  }
  
  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedConversation) {
      return
    }
    
    if (!wsService.isConnected()) {
      antdMessage.warning('连接已断开，请刷新页面')
      return
    }
    
    setSending(true)
    const messageData = {
      receiverId: selectedConversation.userId,
      message: inputValue.trim(),
      type: 1, // 文字消息
      timestamp: new Date().toISOString()
    }
    
    console.log('发送消息:', messageData)
    
    try {
      // 通过 WebSocket 发送
      wsService.send(messageData)
      
      // 乐观更新 UI - 临时消息，等待服务器确认
      const tempMessageId = 'temp_' + Date.now()
      const newMessage = {
        messageId: tempMessageId, // 临时 ID，等待服务器返回真实 ID
        senderId: currentUser.id,
        receiverId: selectedConversation.userId,
        message: inputValue.trim(),
        type: 1,
        timestamp: new Date().toISOString(),
        isRead: false,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar
      }
      setMessages(prev => [...prev, newMessage])
      setInputValue('')
      
      // 刷新对话列表
      loadConversations()
    } catch (error) {
      console.error('发送消息失败:', error)
      antdMessage.error('发送失败，请重试')
    } finally {
      setSending(false)
    }
  }
  
  // 处理图片上传
  const handleImageUpload = async (file) => {
    if (!selectedConversation) {
      antdMessage.warning('请先选择对话')
      return false
    }
    
    // TODO: 实现图片上传到 OSS
    // 这里只是示例，实际应该上传到服务器
    antdMessage.info('图片上传功能待实现')
    return false
  }
  
  // 处理语音录制
  const handleVoiceRecord = () => {
    antdMessage.info('语音消息功能待实现')
  }
  
  // 处理按键发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  // 初始化 WebSocket 连接
  useEffect(() => {
    if (currentUser?.id) {
      // 连接 WebSocket
      wsService.connect(currentUser.id)
      
      // 监听消息
      const unsubscribeMessage = wsService.onMessage((data) => {
        console.log('收到 WebSocket 消息:', data)
        
        if (data.type === 'ping') {
          // 心跳响应，忽略
          return
        }
        
        // 错误消息处理
        if (data.type === 'error') {
          antdMessage.error(data.message || '消息发送失败')
          return
        }
        
        // 收到新消息
        if (data.senderId && data.receiverId && data.message) {
          console.log('处理收到的消息:', data)
          
          // 避免重复添加消息（检查是否已存在）
          setMessages(prev => {
            // 检查是否已存在该消息（通过 messageId 或临时 ID）
            const exists = prev.some(msg => 
              msg.messageId === data.messageId || 
              (msg.messageId && msg.messageId.startsWith('temp_') && 
               msg.senderId === data.senderId && 
               msg.message === data.message)
            )
            
            if (exists) {
              console.log('消息已存在，跳过添加')
              return prev
            }
            
            console.log('添加新消息到状态')
            return [...prev, data]
          })
          
          // 如果是对话中的消息，刷新对话列表
          if (selectedConversation && 
              (data.senderId === selectedConversation.userId || 
               data.receiverId === selectedConversation.userId)) {
            loadConversations()
          }
          
          // 如果当前选中的是对话方，标记为已读
          if (data.receiverId === currentUser.id && data.senderId === selectedConversation?.userId) {
            chatAPI.markAsRead(data.senderId)
          }
        }
      })
      
      // 监听连接状态
      const unsubscribeConnection = wsService.onConnectionChange((connected) => {
        setIsConnected(connected)
        if (connected) {
          console.log('WebSocket 已连接')
        } else {
          console.log('WebSocket 已断开')
        }
      })
      
      // 加载对话列表
      loadConversations()
      
      // 清理
      return () => {
        unsubscribeMessage()
        unsubscribeConnection()
        wsService.disconnect()
      }
    }
  }, [currentUser?.id])
  
  // 获取消息类型图标
  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 2: return <PictureOutlined />
      case 3: return <AudioOutlined />
      default: return null
    }
  }
  
  // 渲染消息气泡
  const renderMessage = (msg, index) => {
    const isSelf = msg.senderId === currentUser?.id
    const time = dayjs(msg.timestamp).format('HH:mm')
    
    return (
      <div
        key={msg.messageId || index}
        style={{
          display: 'flex',
          justifyContent: isSelf ? 'flex-end' : 'flex-start',
          marginBottom: 16,
          alignItems: 'flex-start'
        }}
      >
        {!isSelf && (
          <Avatar 
            src={msg.senderAvatar} 
            style={{ marginRight: 8, flexShrink: 0 }}
          >
            {msg.senderName?.[0]}
          </Avatar>
        )}
        
        <div
          style={{
            maxWidth: '60%',
            padding: '12px 16px',
            borderRadius: 16,
            backgroundColor: isSelf ? '#1890ff' : '#f0f0f0',
            color: isSelf ? '#fff' : '#000',
            wordBreak: 'break-word'
          }}
        >
          {msg.type === 1 ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {getMessageTypeIcon(msg.type)}
              <span>{msg.type === 2 ? '[图片]' : '[语音]'}</span>
              {msg.fileUrl && (
                <a 
                  href={msg.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: isSelf ? '#fff' : '#1890ff' }}
                >
                  查看
                </a>
              )}
            </div>
          )}
          <div
            style={{
              fontSize: 12,
              marginTop: 4,
              opacity: 0.7,
              textAlign: 'right'
            }}
          >
            {time}
            {isSelf && msg.isRead !== undefined && (
              <span style={{ marginLeft: 4 }}>
                {msg.isRead ? '已读' : '未读'}
              </span>
            )}
          </div>
        </div>
        
        {isSelf && (
          <Avatar 
            src={currentUser?.avatar} 
            style={{ marginLeft: 8, flexShrink: 0 }}
          >
            {currentUser?.name?.[0]}
          </Avatar>
        )}
      </div>
    )
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 128px)', 
      backgroundColor: '#fff',
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* 左侧对话列表 */}
      <div style={{ 
        width: 320, 
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: 16, 
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>消息</h3>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="small"
              onClick={() => setShowUserModal(true)}
            >
              新建聊天
            </Button>
          </div>
          <div style={{ fontSize: 12, color: isConnected ? '#52c41a' : '#ff4d4f' }}>
            {isConnected ? '● 已连接' : '● 已断开'}
          </div>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          {conversations.length === 0 ? (
            <Empty description="暂无对话" style={{ padding: 40 }} />
          ) : (
            <List
              dataSource={conversations}
              renderItem={(item) => (
                <List.Item
                  onClick={() => selectConversation(item)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedConversation?.userId === item.userId ? '#e6f7ff' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedConversation?.userId !== item.userId) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedConversation?.userId !== item.userId) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={item.unreadCount} offset={[-5, 5]}>
                        <Avatar src={item.userAvatar} />
                      </Badge>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.userName}</span>
                        {item.lastMessageTime && (
                          <span style={{ fontSize: 12, color: '#999' }}>
                            {dayjs(item.lastMessageTime).fromNow()}
                          </span>
                        )}
                      </div>
                    }
                    description={
                      <div style={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: item.unreadCount > 0 ? '#1890ff' : '#999'
                      }}>
                        {item.lastMessageType === 2 ? '[图片] ' : 
                         item.lastMessageType === 3 ? '[语音] ' : ''}
                        {item.lastMessage || '暂无消息'}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
      
      {/* 右侧聊天窗口 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            {/* 聊天头部 */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <Avatar src={selectedConversation.userAvatar}>
                {selectedConversation.userName?.[0]}
              </Avatar>
              <div>
                <div style={{ fontWeight: 500 }}>{selectedConversation.userName}</div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  {isConnected ? '在线' : '离线'}
                </div>
              </div>
            </div>
            
            {/* 消息列表 */}
            <div style={{
              flex: 1,
              padding: 16,
              overflow: 'auto',
              backgroundColor: '#f5f5f5'
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Spin />
                </div>
              ) : messages.length === 0 ? (
                <Empty description="暂无聊天记录" />
              ) : (
                messages.map((msg, index) => renderMessage(msg, index))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* 输入区域 */}
            <div style={{
              padding: 16,
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fff'
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleImageUpload}
                >
                  <Button icon={<PictureOutlined />} size="small">
                    图片
                  </Button>
                </Upload>
                <Button 
                  icon={<AudioOutlined />} 
                  size="small"
                  onClick={handleVoiceRecord}
                >
                  语音
                </Button>
                <Button 
                  icon={<SmileOutlined />} 
                  size="small"
                  onClick={() => antdMessage.info('表情功能待实现')}
                >
                  表情
                </Button>
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{ flex: 1, resize: 'none' }}
                  disabled={sending || !isConnected}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={sendMessage}
                  loading={sending}
                  disabled={!inputValue.trim() || !isConnected}
                  style={{ height: 'auto', padding: '8px 16px' }}
                >
                  发送
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5'
          }}>
            <Empty description="请选择一个对话开始聊天" />
          </div>
        )}
      </div>
      
      {/* 用户选择弹窗 */}
      <UserListModal
        visible={showUserModal}
        onCancel={() => setShowUserModal(false)}
        onSelect={startNewChat}
        currentUserId={currentUser?.id}
        currentRole={currentUser?.role}
      />
    </div>
  )
}

export default Chat

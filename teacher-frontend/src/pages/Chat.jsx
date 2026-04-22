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
  const [selectedConversation, setSelectedConversation] = useState(() => {
    // 从 localStorage 恢复选中的对话
    const saved = localStorage.getItem('selectedConversation')
    return saved ? JSON.parse(saved) : null
  })
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [pendingMessage, setPendingMessage] = useState('')
  const [recallMenuVisible, setRecallMenuVisible] = useState(null) // 显示撤回菜单的消息 ID
  
  // 引用
  const messagesEndRef = useRef(null)
  const uploadRef = useRef(null)
  const selectedConversationRef = useRef(selectedConversation)
  
  // 滚动到底部 - 优化版：确保在消息加载完成且 DOM 渲染后滚动
  const scrollToBottom = () => {
    if (messagesEndRef.current && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    selectedConversationRef.current = selectedConversation
  }, [selectedConversation])
  
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
    // 持久化选中的对话到 localStorage
    localStorage.setItem('selectedConversation', JSON.stringify(conversation))
    // 切换对话时自动标记为已读
    if (conversation.userId) {
      chatAPI.markAsRead(conversation.userId)
      loadChatHistory(conversation.userId)
    }
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
    // 持久化选中的对话到 localStorage
    localStorage.setItem('selectedConversation', JSON.stringify(newConversation))
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
    
    setSending(true)
    
    // 生成临时 ID，用于乐观更新
    const tempMessageId = 'temp_' + Date.now()
    const tempTimestamp = new Date().toISOString()
    
    // 乐观更新 UI - 先显示消息（发送中状态）
    const tempMessage = {
      messageId: tempMessageId,
      senderId: currentUser.id,
      receiverId: selectedConversation.userId,
      message: inputValue.trim(),
      type: 1,
      timestamp: tempTimestamp,
      isRead: false, // 刚发送的消息默认未读
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      sending: true // 标记为发送中
    }
    setMessages(prev => [...prev, tempMessage])
    setInputValue('')
    
    const messageData = {
      senderId: currentUser.id, // 当前用户 ID
      receiverId: selectedConversation.userId,
      message: inputValue.trim(),
      type: 1 // 文字消息
    }
    
    console.log('【DEBUG】发送消息 - senderId:', currentUser.id, 'receiverId:', selectedConversation.userId, 'currentUser:', currentUser)
    
    try {
      // 通过 HTTP API 发送（统一发送链路）
      const result = await chatAPI.sendMessage(messageData)
      
      // 用后端返回的真实消息替换临时消息
      const realMessage = {
        ...result.data,
        timestamp: result.data.timestamp || tempTimestamp
      }
      
      // 替换临时消息为真实消息（字符串比较）
      setMessages(prev => prev.map(msg => 
        String(msg.messageId) === String(tempMessageId) ? realMessage : msg
      ))
      
      // 刷新对话列表
      loadConversations()
      
    } catch (error) {
      console.error('发送消息失败:', error)
      // 标记为发送失败
      setMessages(prev => prev.map(msg => 
        msg.messageId === tempMessageId ? { ...msg, sending: false, sendFailed: true } : msg
      ))
      antdMessage.error('发送失败，请重试')
    } finally {
      setSending(false)
    }
  }
  
  // 清除选中的对话
  const clearSelectedConversation = () => {
    setSelectedConversation(null)
    setMessages([])
    localStorage.removeItem('selectedConversation')
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
  
  // 撤回消息
  const recallMessage = async (messageId) => {
    try {
      await chatAPI.recallMessage(messageId)
      setMessages(prev => prev.map(msg => 
        msg.messageId === messageId
          ? { ...msg, isRecalled: true, recalledAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), recalledBy: currentUser.id }
          : msg
      ))
      setRecallMenuVisible(null)
      antdMessage.success('消息已撤回')
      loadConversations()
    } catch (error) {
      console.error('撤回消息失败:', error)
      antdMessage.error('撤回失败：' + (error.response?.data?.message || error.message))
    }
  }
  
  // 检查是否可以撤回（2 分钟内）
  const canRecall = (msg) => {
    if (!msg.timestamp || msg.isRecalled) return false
    const now = dayjs()
    const sentTime = dayjs(msg.timestamp)
    const diffMinutes = now.diff(sentTime, 'minute')
    return diffMinutes <= 2
  }
  
  // 点击其他地方关闭撤回菜单
  useEffect(() => {
    const handleClickOutside = () => {
      if (recallMenuVisible !== null) {
        setRecallMenuVisible(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [recallMenuVisible])
  
  // 当选中对话变化时，自动标记为已读（实时同步关键）
  useEffect(() => {
    if (selectedConversation?.userId) {
      console.log('切换对话，标记为已读:', selectedConversation.userId)
      chatAPI.markAsRead(selectedConversation.userId)
    }
  }, [selectedConversation?.userId])

  // 初始化 WebSocket 连接和加载数据
  useEffect(() => {
    if (currentUser?.id) {
      // 连接 WebSocket
      wsService.connect(currentUser.id)
      
      // 监听消息
      const unsubscribeMessage = wsService.onMessage((data) => {
        console.log('收到 WebSocket 消息:', data)
        
        if (data.type === 'pong' || data.type === 'ping') {
          return
        }
        
        if (data.type === 'error') {
          antdMessage.error(data.message || '消息发送失败')
          return
        }
        
        // 处理撤回通知（type=100 表示撤回通知）
        if (data.type === 100 || data.isRecalled) {
          console.log('收到撤回通知:', data)
          setMessages(prev => prev.map(msg => 
            msg.messageId === data.messageId
              ? { ...msg, isRecalled: true, recalledAt: data.recalledAt, recalledBy: data.recalledBy }
              : msg
          ))
          antdMessage.success('对方撤回了一条消息')
          loadConversations()
          return
        }
        
        // 处理已读状态更新（type=0 表示已读通知）
        if (data.type === 0 && data.readerId) {
          console.log('【DEBUG】收到已读状态更新，readerId:', data.readerId, 'currentUser.id:', currentUser.id)
          setMessages(prev => {
            const updated = prev.map(msg => {
              // 匹配所有自己发送的未读消息（不检查 messageId，因为可能是临时 ID）
              const match = String(msg.senderId) === String(currentUser.id) && !msg.isRead
              if (match) {
                console.log('【DEBUG】标记消息为已读:', msg.messageId, 'senderId:', msg.senderId, 'message:', msg.message?.substring(0, 20))
              }
              return match ? { ...msg, isRead: true } : msg
            })
            console.log('【DEBUG】已读状态更新完成，更新消息数:', updated.filter(m => m.isRead).length)
            return updated
          })
          loadConversations()
          return
        }

        // 忽略自己发送的消息（字符串比较）
        if (String(data.senderId) === String(currentUser.id)) {
          return
        }
        
        // 收到新消息
        if (data.senderId && data.receiverId && data.message) {
          console.log('处理收到的消息:', data)

          const activeConversation = selectedConversationRef.current

          // 字符串比较
          if (activeConversation && String(data.senderId) === String(activeConversation.userId)) {
            setMessages(prev => {
              const exists = prev.some(msg => msg.messageId === data.messageId)

              if (exists) {
                console.log('消息已存在，跳过添加')
                return prev
              }

              console.log('添加新消息到状态')
              return [...prev, {
                ...data,
                timestamp: data.timestamp ? dayjs(data.timestamp).format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss')
              }]
            })

            chatAPI.markAsRead(data.senderId)
            loadConversations()
          } else {
            loadConversations()
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
      
      // 如果有恢复的选中对话，加载聊天记录
      if (selectedConversationRef.current?.userId) {
        console.log('恢复选中的对话，加载聊天记录:', selectedConversationRef.current.userId)
        loadChatHistory(selectedConversationRef.current.userId)
      }
      
      // 清理
      return () => {
        unsubscribeMessage()
        unsubscribeConnection()
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
    // 注意：后端返回的 ID 现在是字符串，需要统一类型比较
    const isSelf = String(msg.senderId) === String(currentUser?.id)
    const isRead = msg.isRead === true
    const isRecalled = msg.isRecalled === true
    const time = dayjs(msg.timestamp).format('HH:mm')
    const showRecallBtn = isSelf && canRecall(msg) && recallMenuVisible === msg.messageId
    
    return (
      <div
        key={msg.messageId || index}
        style={{
          display: 'flex',
          justifyContent: isSelf ? 'flex-end' : 'flex-start',
          marginBottom: 16,
          alignItems: 'flex-start',
          position: 'relative'
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
          onContextMenu={(e) => {
            e.preventDefault()
            if (isSelf && canRecall(msg)) {
              setRecallMenuVisible(msg.messageId)
            }
          }}
          style={{
            maxWidth: '60%',
            padding: '12px 16px',
            borderRadius: 16,
            backgroundColor: isRecalled ? '#f5f5f5' : (isSelf ? '#1890ff' : '#f0f0f0'),
            color: isRecalled ? '#999' : (isSelf ? '#fff' : '#000'),
            wordBreak: 'break-word',
            position: 'relative',
            fontStyle: isRecalled ? 'italic' : 'normal'
          }}
        >
          {isRecalled ? (
            <div>↩️ 消息已撤回</div>
          ) : (msg.type === 1 ? (
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
          ))}
          <div
            style={{
              fontSize: 12,
              marginTop: 4,
              opacity: 0.7,
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 4
            }}
          >
            {time}
            {!isRecalled && isSelf && (
              <span style={{ marginLeft: 4 }}>
                {isRead ? (
                  <span style={{ color: '#fff' }} title="已读">✓</span>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.6)' }} title="未读">⏳</span>
                )}
              </span>
            )}
          </div>
          
          {/* 撤回按钮 */}
          {showRecallBtn && (
            <div style={{
              position: 'absolute',
              top: -35,
              right: 0,
              backgroundColor: '#fff',
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              padding: '4px 8px',
              fontSize: 12,
              zIndex: 1000
            }}>
              <Button 
                size="small" 
                danger 
                onClick={() => recallMessage(msg.messageId)}
                style={{ fontSize: 12 }}
              >
                撤回
              </Button>
            </div>
          )}
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

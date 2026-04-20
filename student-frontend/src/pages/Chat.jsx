import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Input, Button, Avatar, List, Badge, Upload, message as antdMessage, Spin, Empty, Card, Modal, Table, Space, Tag } from 'antd'
import { SendOutlined, PictureOutlined, AudioOutlined, SmileOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons'
import wsService from '../services/websocket'
import { chatAPI } from '../services/chatApi'
import { userAPI } from '../services/userApi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { TextArea } = Input

/**
 * 聊天页面组件（学生端）
 */
const Chat = () => {
  // 获取当前用户信息
  const currentUser = useSelector((state) => state.auth.user)
  
  // 状态管理
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(() => {
    const saved = localStorage.getItem('selectedConversation')
    return saved ? JSON.parse(saved) : null
  })
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [teacherLoading, setTeacherLoading] = useState(false)
  
  // 引用
  const messagesEndRef = useRef(null)
  
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
    localStorage.setItem('selectedConversation', JSON.stringify(conversation))
    loadChatHistory(conversation.userId)
  }
  
  // 加载教师列表
  const loadTeachers = async () => {
    setTeacherLoading(true)
    try {
      const result = await userAPI.getUsers(1) // 1=教师
      setTeachers(result.data || result || [])
    } catch (error) {
      console.error('加载教师列表失败:', error)
      // 使用模拟数据作为后备
      setTeachers([])
    } finally {
      setTeacherLoading(false)
    }
  }
  
  // 选择教师聊天
  const selectTeacherToChat = (teacher) => {
    const conversation = {
      userId: teacher.id,
      userName: teacher.name || teacher.username,
      userAvatar: teacher.avatar,
      unreadCount: 0
    }
    selectConversation(conversation)
    setShowTeacherModal(false)
  }
  
  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim()) {
      antdMessage.warning('请输入消息内容')
      return
    }
    
    if (!selectedConversation?.userId) {
      antdMessage.warning('请先选择一个聊天对象')
      return
    }
    
    setSending(true)
    
    // 不发送 timestamp，由后端自动生成
    const messageData = {
      senderId: currentUser.id, // 当前用户 ID
      receiverId: selectedConversation.userId,
      message: inputValue,
      type: 1 // 1=文字消息（确保是数字类型）
    }
    
    try {
      // 通过 API 发送（主要方式）
      const result = await chatAPI.sendMessage(messageData)
      
      // 添加到消息列表
      const newMessage = {
        ...result.data,
        senderId: currentUser.id,
        senderName: currentUser.name || currentUser.username,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      
      setMessages(prev => [...prev, newMessage])
      setInputValue('')
      
      // 不再通过 WebSocket 发送，只使用 HTTP API
      
      // 更新对话列表
      loadConversations()
      
    } catch (error) {
      console.error('发送消息失败:', error)
      antdMessage.error('发送消息失败：' + (error.response?.data?.message || error.message))
    } finally {
      setSending(false)
    }
  }
  
  // 处理 WebSocket 消息
  useEffect(() => {
    if (!currentUser?.id) return
    
    // 连接 WebSocket
    wsService.connect(currentUser.id)
    
    // 监听连接状态
    const unsubscribeConnection = wsService.onConnectionChange((connected) => {
      setIsConnected(connected)
      console.log('WebSocket 连接状态:', connected ? '已连接' : '已断开')
    })
    
    // 监听消息
    const unsubscribeMessage = wsService.onMessage((data) => {
      console.log('收到 WebSocket 消息:', data)
      
      if (data.type === 'error') {
        antdMessage.error('消息发送失败：' + data.message)
        return
      }
      
      // 如果是自己发送的消息，忽略（已经在发送时添加了）
      if (data.senderId === currentUser.id) {
        return
      }
      
      // 如果是当前选中对话的消息，添加到列表
      if (selectedConversation && data.senderId === selectedConversation.userId) {
        setMessages(prev => [...prev, {
          ...data,
          timestamp: data.timestamp ? dayjs(data.timestamp).format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss')
        }])
        
        // 标记为已读
        chatAPI.markAsRead(data.senderId)
        
        // 更新对话列表
        loadConversations()
      } else {
        // 如果不是当前对话，更新对话列表（显示未读）
        loadConversations()
      }
    })
    
    // 加载对话列表
    loadConversations()
    
    // 加载教师列表（用于选择聊天对象）
    loadTeachers()
    
    // 恢复选中的对话
    if (selectedConversation) {
      console.log('恢复选中的对话，加载聊天记录:', selectedConversation.userId)
      loadChatHistory(selectedConversation.userId)
    }
    
    // 清理
    return () => {
      unsubscribeConnection()
      unsubscribeMessage()
    }
  }, [currentUser?.id])
  
  // 处理按键发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  return (
    <div style={{ height: 'calc(100vh - 200px)', display: 'flex', gap: 16 }}>
      {/* 左侧对话列表 */}
      <Card 
        style={{ width: 320, display: 'flex', flexDirection: 'column' }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>消息列表</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge 
                count={isConnected ? 1 : 0} 
                status={isConnected ? 'success' : 'error'} 
                text={isConnected ? '在线' : '离线'}
              />
              <Button 
                type="primary" 
                size="small" 
                icon={<PlusOutlined />}
                onClick={() => setShowTeacherModal(true)}
              >
                新聊天
              </Button>
            </div>
          </div>
        }
      >
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <Empty description="暂无消息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              dataSource={conversations}
              renderItem={(item) => (
                <List.Item
                  onClick={() => selectConversation(item)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: selectedConversation?.userId === item.userId ? '#e6f7ff' : 'transparent',
                    borderRadius: 8,
                    marginBottom: 8,
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedConversation?.userId !== item.userId) {
                      e.currentTarget.style.background = '#f5f5f5'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedConversation?.userId !== item.userId) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.userName || '未知用户'}</span>
                        {item.unreadCount > 0 && (
                          <Badge count={item.unreadCount} offset={[-5, 0]} />
                        )}
                      </div>
                    }
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999' }}>
                        <span style={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.lastMessage || '暂无消息'}
                        </span>
                        <span>{item.lastMessageTime ? dayjs(item.lastMessageTime).fromNow() : ''}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Card>
      
      {/* 右侧聊天窗口 */}
      <Card 
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        title={
          selectedConversation ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              <div>
                <div style={{ fontWeight: 'bold' }}>{selectedConversation.userName || '未知用户'}</div>
                <div style={{ fontSize: 12, color: isConnected ? '#52c41a' : '#999' }}>
                  {isConnected ? '● 在线' : '○ 离线'}
                </div>
              </div>
            </div>
          ) : (
            '请选择聊天对象'
          )
        }
      >
        {selectedConversation ? (
          <>
            {/* 消息列表 */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: 16,
              background: '#f5f5f5',
              marginBottom: 16
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Spin tip="加载中..." />
                </div>
              ) : messages.length === 0 ? (
                <Empty description="暂无聊天记录" />
              ) : (
                <List
                  dataSource={messages}
                  renderItem={(item) => (
                    <div style={{
                      display: 'flex',
                      justifyContent: item.senderId === currentUser?.id ? 'flex-end' : 'flex-start',
                      marginBottom: 16,
                    }}>
                      {item.senderId !== currentUser?.id && (
                        <Avatar 
                          style={{ backgroundColor: '#1890ff', marginRight: 8 }} 
                          icon={<UserOutlined />} 
                        />
                      )}
                      <div style={{
                        maxWidth: '60%',
                        padding: '12px 16px',
                        borderRadius: 16,
                        background: item.senderId === currentUser?.id ? '#1890ff' : '#fff',
                        color: item.senderId === currentUser?.id ? '#fff' : '#333',
                      }}>
                        <div>{item.message}</div>
                        <div style={{ 
                          fontSize: 12, 
                          opacity: 0.7, 
                          textAlign: 'right',
                          marginTop: 4
                        }}>
                          {item.timestamp ? dayjs(item.timestamp).format('HH:mm') : ''}
                        </div>
                      </div>
                      {item.senderId === currentUser?.id && (
                        <Avatar 
                          style={{ backgroundColor: '#87d068', marginLeft: 8 }} 
                          icon={<UserOutlined />} 
                        />
                      )}
                    </div>
                  )}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* 输入区域 */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <Button 
                icon={<PictureOutlined />} 
                size="large"
                onClick={() => antdMessage.info('图片上传功能开发中')}
              />
              <Button 
                icon={<AudioOutlined />} 
                size="large"
                onClick={() => antdMessage.info('语音消息功能开发中')}
              />
              <Button 
                icon={<SmileOutlined />} 
                size="large"
                onClick={() => antdMessage.info('表情功能开发中')}
              />
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息，按 Enter 发送..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ flex: 1 }}
                disabled={sending}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />} 
                size="large"
                onClick={sendMessage}
                loading={sending}
              >
                发送
              </Button>
            </div>
          </>
        ) : (
          <Empty 
            description="请从左侧选择一个聊天对象" 
            style={{ marginTop: 100 }}
          />
        )}
      </Card>
      
      {/* 选择教师模态框 */}
      <Modal
        title="选择聊天对象"
        open={showTeacherModal}
        onCancel={() => setShowTeacherModal(false)}
        footer={null}
        width={700}
      >
        <Table
          rowKey="id"
          loading={teacherLoading}
          dataSource={teachers}
          columns={[
            {
              title: '教师',
              dataIndex: 'name',
              key: 'name',
              render: (name, record) => (
                <Space>
                  <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{record.subject || '未知科目'}</div>
                  </div>
                </Space>
              ),
            },
            {
              title: '用户名',
              dataIndex: 'username',
              key: 'username',
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => selectTeacherToChat(record)}
                >
                  选择
                </Button>
              ),
            },
          ]}
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: '暂无教师数据，请确保后端已创建教师账号' }}
        />
      </Modal>
    </div>
  )
}

export default Chat

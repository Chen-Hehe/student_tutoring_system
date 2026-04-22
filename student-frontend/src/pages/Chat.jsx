import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Input, Button, Avatar, List, Badge, message as antdMessage, Spin, Empty, Modal, Table, Space } from 'antd'
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
const THEME = '#52c41a'
const THEME_LIGHT = '#f6ffed'

const Chat = () => {
  const currentUser = useSelector((state) => state.auth.user)

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
  const [recallMenuVisible, setRecallMenuVisible] = useState(null) // 显示撤回菜单的消息 ID

  const messagesEndRef = useRef(null)
  const selectedConversationRef = useRef(selectedConversation)

  useEffect(() => {
    selectedConversationRef.current = selectedConversation
  }, [selectedConversation])

  // 滚动到底部 - 优化版：确保在消息加载完成且 DOM 渲染后滚动
  const scrollToBottom = () => {
    // 确保 ref 存在且消息列表不为空
    if (messagesEndRef.current && messages.length > 0) {
      // 使用 setTimeout 确保 DOM 已渲染
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }

  // 消息变化时滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    if (!currentUser?.id) return
    try {
      const result = await chatAPI.getConversations(currentUser.id)
      setConversations(result.data || [])
    } catch (error) {
      console.error('加载对话列表失败:', error)
    }
  }

  const loadChatHistory = async (userId) => {
    setLoading(true)
    try {
      const result = await chatAPI.getChatHistory(userId)
      setMessages(result.data || [])
      // 标记为已读（调用后端接口，后端会推送已读状态给发送者）
      await chatAPI.markAsRead(userId)
      // 消息设置后，useEffect 会自动滚动，这里不需要额外处理
    } catch (error) {
      console.error('加载聊天记录失败:', error)
      antdMessage.error('加载聊天记录失败')
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation)
    localStorage.setItem('selectedConversation', JSON.stringify(conversation))
    // 切换对话时自动标记为已读
    if (conversation.userId) {
      chatAPI.markAsRead(conversation.userId)
      loadChatHistory(conversation.userId)
    }
  }

  const loadTeachers = async () => {
    setTeacherLoading(true)
    try {
      const result = await userAPI.getUsers(1)
      setTeachers(result.data || result || [])
    } catch (error) {
      console.error('加载教师列表失败:', error)
      setTeachers([])
    } finally {
      setTeacherLoading(false)
    }
  }

  const selectTeacherToChat = (teacher) => {
    selectConversation({
      userId: teacher.id,
      userName: teacher.name || teacher.username,
      userAvatar: teacher.avatar,
      unreadCount: 0
    })
    setShowTeacherModal(false)
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return antdMessage.warning('请输入消息内容')
    if (!selectedConversation?.userId) return antdMessage.warning('请先选择一个聊天对象')

    setSending(true)
    try {
      const result = await chatAPI.sendMessage({
        senderId: currentUser.id,
        receiverId: selectedConversation.userId,
        message: inputValue,
        type: 1
      })
      console.log('【DEBUG】发送消息成功，result.data:', result.data)
      setMessages((prev) => [...prev, {
        ...result.data,
        messageId: result.data.messageId, // 确保 messageId 正确设置
        senderId: currentUser.id,
        senderName: currentUser.name || currentUser.username,
        timestamp: result.data.timestamp || dayjs().format('YYYY-MM-DD HH:mm:ss'),
        isRead: false // 刚发送的消息默认未读
      }])
      setInputValue('')
      loadConversations()
    } catch (error) {
      console.error('发送消息失败:', error)
      antdMessage.error('发送消息失败：' + (error.response?.data?.message || error.message))
    } finally {
      setSending(false)
    }
  }

  // 当选中对话变化时，自动标记为已读（实时同步关键）
  useEffect(() => {
    if (selectedConversation?.userId) {
      console.log('切换对话，标记为已读:', selectedConversation.userId)
      chatAPI.markAsRead(selectedConversation.userId)
    }
  }, [selectedConversation?.userId])

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
  
  useEffect(() => {
    if (!currentUser?.id) return

    wsService.connect(currentUser.id)

    const unsubConn = wsService.onConnectionChange((connected) => setIsConnected(connected))
    const unsubMsg = wsService.onMessage((data) => {
      if (data.type === 'pong' || data.type === 'ping') return
      if (data.type === 'error') return antdMessage.error('消息发送失败：' + data.message)
      
      // 处理撤回通知（type=100 表示撤回通知）
      if (data.type === 100 || data.isRecalled) {
        console.log('收到撤回通知:', data)
        setMessages((prev) => prev.map(msg => 
          String(msg.messageId) === String(data.messageId)
            ? { ...msg, isRecalled: true, recalledAt: data.recalledAt, recalledBy: data.recalledBy }
            : msg
        ))
        antdMessage.success('对方撤回了一条消息')
        loadConversations()
        return
      }
      
      // 处理已读状态更新（type=0 表示已读通知）
      if (data.type === 0 && data.readerId) {
        console.log('收到已读状态更新，readerId:', data.readerId)
        setMessages((prev) => prev.map(msg => 
          String(msg.senderId) === String(currentUser.id) && !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        ))
        // 更新对话列表中的未读数
        loadConversations()
        return
      }
      
      // 忽略自己发送的消息（字符串比较）
      if (String(data.senderId) === String(currentUser.id)) return

      const active = selectedConversationRef.current
      if (active && String(data.senderId) === String(active.userId)) {
        setMessages((prev) => [...prev, {
          ...data,
          timestamp: data.timestamp ? dayjs(data.timestamp).format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss')
        }])
        // 实时标记为已读（后端会推送已读状态给发送者）
        chatAPI.markAsRead(data.senderId)
      }
      loadConversations()
    })

    loadConversations()
    loadTeachers()
    if (selectedConversationRef.current?.userId) loadChatHistory(selectedConversationRef.current.userId)

    return () => {
      unsubConn()
      unsubMsg()
    }
  }, [currentUser?.id])

  const renderMessage = (msg, index) => {
    // 注意：后端返回的 ID 现在是字符串，需要统一类型比较
    const isSelf = String(msg.senderId) === String(currentUser?.id)
    const isRead = msg.isRead === true
    const isRecalled = msg.isRecalled === true
    const showRecallBtn = isSelf && canRecall(msg) && recallMenuVisible === msg.messageId
    
    return (
      <div key={msg.messageId || index} style={{ display: 'flex', justifyContent: isSelf ? 'flex-end' : 'flex-start', marginBottom: 16, alignItems: 'flex-start', position: 'relative' }}>
        {!isSelf && (
          <Avatar src={msg.senderAvatar} style={{ marginRight: 8 }}>
            {(msg.senderName || selectedConversation?.userName || '教')?.[0]}
          </Avatar>
        )}

        <div 
          style={{ 
            maxWidth: '60%', 
            padding: '12px 16px', 
            borderRadius: 16, 
            backgroundColor: isRecalled ? '#f5f5f5' : (isSelf ? THEME : '#fff'), 
            color: isRecalled ? '#999' : (isSelf ? '#fff' : '#333'), 
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
            wordBreak: 'break-word', 
            position: 'relative',
            fontStyle: isRecalled ? 'italic' : 'normal'
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            if (isSelf && canRecall(msg)) {
              setRecallMenuVisible(msg.messageId)
            }
          }}
        >
          {isRecalled ? (
            <div>↩️ 消息已撤回</div>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
          )}
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.75, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            {msg.timestamp ? dayjs(msg.timestamp).format('HH:mm') : ''}
            {!isRecalled && isSelf && (
              <span style={{ marginLeft: 4 }}>
                {isRead ? (
                  <span style={{ color: '#1890ff' }} title="已读">✓</span>
                ) : (
                  <span style={{ color: '#999' }} title="未读">⏳</span>
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
          <Avatar src={currentUser?.avatar} style={{ marginLeft: 8, backgroundColor: '#87d068' }}>
            {(currentUser?.name || currentUser?.username || '学')?.[0]}
          </Avatar>
        )}
      </div>
    )
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  // 撤回消息
  const recallMessage = async (messageId) => {
    console.log('【DEBUG】前端准备撤回消息，messageId:', messageId, 'type:', typeof messageId)
    try {
      const result = await chatAPI.recallMessage(messageId)
      console.log('【DEBUG】撤回成功，result:', result)
      setMessages((prev) => prev.map(msg => 
        msg.messageId === messageId
          ? { ...msg, isRecalled: true, recalledAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), recalledBy: currentUser.id }
          : msg
      ))
      setRecallMenuVisible(null)
      antdMessage.success('消息已撤回')
      loadConversations()
    } catch (error) {
      console.error('【DEBUG】撤回消息失败:', error)
      console.error('【DEBUG】错误详情:', error.response?.data)
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

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 128px)', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ width: 320, borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>消息</h3>
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setShowTeacherModal(true)} style={{ backgroundColor: THEME, borderColor: THEME }}>
              新建聊天
            </Button>
          </div>
          <div style={{ fontSize: 12, color: isConnected ? '#52c41a' : '#ff4d4f' }}>{isConnected ? '● 已连接' : '● 已断开'}</div>
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
                  style={{ padding: '12px 16px', cursor: 'pointer', backgroundColor: selectedConversation?.userId === item.userId ? THEME_LIGHT : 'transparent', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => {
                    if (selectedConversation?.userId !== item.userId) e.currentTarget.style.backgroundColor = '#f5f5f5'
                  }}
                  onMouseLeave={(e) => {
                    if (selectedConversation?.userId !== item.userId) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <List.Item.Meta
                    avatar={<Badge count={item.unreadCount} offset={[-5, 5]}><Avatar src={item.userAvatar} icon={<UserOutlined />} /></Badge>}
                    title={<div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{item.userName || '未知用户'}</span>{item.lastMessageTime && <span style={{ fontSize: 12, color: '#999' }}>{dayjs(item.lastMessageTime).fromNow()}</span>}</div>}
                    description={<div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: item.unreadCount > 0 ? THEME : '#999' }}>{item.lastMessageType === 2 ? '[图片] ' : item.lastMessageType === 3 ? '[语音] ' : ''}{item.lastMessage || '暂无消息'}</div>}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar src={selectedConversation.userAvatar}>{selectedConversation.userName?.[0]}</Avatar>
              <div>
                <div style={{ fontWeight: 500 }}>{selectedConversation.userName || '未知用户'}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{isConnected ? '在线' : '离线'}</div>
              </div>
            </div>

            <div style={{ flex: 1, padding: 16, overflow: 'auto', backgroundColor: '#f5f5f5' }}>
              {loading ? <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div> : messages.length === 0 ? <Empty description="暂无聊天记录" /> : messages.map((m, i) => renderMessage(m, i))}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: 16, borderTop: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Button icon={<PictureOutlined />} size="small" onClick={() => antdMessage.info('图片上传功能开发中')}>图片</Button>
                <Button icon={<AudioOutlined />} size="small" onClick={() => antdMessage.info('语音消息功能开发中')}>语音</Button>
                <Button icon={<SmileOutlined />} size="small" onClick={() => antdMessage.info('表情功能开发中')}>表情</Button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <TextArea value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }} placeholder="输入消息... (Enter 发送，Shift+Enter 换行)" autoSize={{ minRows: 2, maxRows: 4 }} style={{ flex: 1, resize: 'none' }} disabled={sending || !isConnected} />
                <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} loading={sending} disabled={!inputValue.trim() || !isConnected} style={{ height: 'auto', padding: '8px 16px', backgroundColor: THEME, borderColor: THEME }}>
                  发送
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
            <Empty description="请选择一个对话开始聊天" />
          </div>
        )}
      </div>

      <Modal title="选择聊天对象" open={showTeacherModal} onCancel={() => setShowTeacherModal(false)} footer={null} width={700}>
        <Table
          rowKey="id"
          loading={teacherLoading}
          dataSource={teachers}
          columns={[
            { title: '教师', dataIndex: 'name', key: 'name', render: (name, record) => <Space><Avatar style={{ backgroundColor: THEME }} icon={<UserOutlined />} /><div><div style={{ fontWeight: 'bold' }}>{name}</div><div style={{ fontSize: 12, color: '#999' }}>{record.subject || '未知科目'}</div></div></Space> },
            { title: '用户名', dataIndex: 'username', key: 'username' },
            { title: '操作', key: 'action', render: (_, record) => <Button type="primary" size="small" onClick={() => selectTeacherToChat(record)} style={{ backgroundColor: THEME, borderColor: THEME }}>选择</Button> }
          ]}
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: '暂无教师数据，请确保后端已创建教师账号' }}
        />
      </Modal>
    </div>
  )
}

export default Chat

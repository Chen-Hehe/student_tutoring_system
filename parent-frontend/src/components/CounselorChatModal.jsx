import { useState, useRef, useEffect } from 'react'
import { Modal, Input, Button, message, Spin } from 'antd'
import { SendOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { chatWithCounselor } from '../services/counselorApi'

const { TextArea } = Input

/**
 * 心理辅导员 AI 聊天弹窗组件（家长端）
 * 模拟微信聊天形式，将 AI 回复当作真人回复
 */
const CounselorChatModal = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '您好！我是学校的心理辅导员。很高兴能与您交流，请问有什么关于孩子成长、教育或心理方面的问题想要咨询吗？我会尽我所能为您提供专业的建议和支持。🌸',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (open) {
      scrollToBottom()
      // 打开弹窗时聚焦输入框
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open])

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      message.warning('请输入消息内容')
      return
    }

    if (loading) {
      return
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    // 添加用户消息
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      // 准备消息历史（只发送最近 10 条，避免 token 超限）
      const messageHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      messageHistory.push({
        role: 'user',
        content: userMessage.content
      })

      // 调用 AI API
      const aiResponse = await chatWithCounselor(messageHistory)

      // 添加 AI 回复
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('发送消息失败:', error)
      message.error(error.message || '发送失败，请稍后再试')
      // 添加错误提示消息
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        content: `⚠️ ${error.message}`,
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
      // 滚动到底部
      setTimeout(() => scrollToBottom(), 100)
    }
  }

  // 处理回车发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 关闭弹窗
  const handleClose = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: '您好！我是学校的心理辅导员。很高兴能与您交流，请问有什么关于孩子成长、教育或心理方面的问题想要咨询吗？我会尽我所能为您提供专业的建议和支持。🌸',
        timestamp: new Date()
      }
    ])
    onClose()
  }

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CustomerServiceOutlined style={{ fontSize: 20, color: '#FF9800' }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>💛 心理辅导员</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      bodyStyle={{ padding: 0, height: '600px', display: 'flex', flexDirection: 'column' }}
    >
      {/* 聊天消息区域 */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        background: '#f5f5f5'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16,
              alignItems: 'flex-start'
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#FF9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
                flexShrink: 0,
                color: 'white',
                fontSize: 18
              }}>
                💛
              </div>
            )}
            
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: 12,
              background: msg.role === 'user' 
                ? '#FF9800' 
                : msg.role === 'system'
                ? '#fff3cd'
                : '#ffffff',
              color: msg.role === 'user' ? '#ffffff' : '#333333',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              wordBreak: 'break-word'
            }}>
              <div style={{ 
                fontSize: 14, 
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
              <div style={{
                fontSize: 11,
                marginTop: 6,
                textAlign: 'right',
                opacity: 0.7
              }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>

            {msg.role === 'user' && (
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
                flexShrink: 0,
                color: 'white',
                fontSize: 18
              }}>
                👤
              </div>
            )}
          </div>
        ))}
        
        {/* 加载中提示 */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 16,
            alignItems: 'center'
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#FF9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
              color: 'white',
              fontSize: 18
            }}>
              💛
            </div>
            <div style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Spin size="small" />
              <span style={{ marginLeft: 8, color: '#999' }}>心理辅导员正在思考...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div style={{
        padding: '16px 20px',
        background: '#ffffff',
        borderTop: '1px solid #e8e8e8',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start'
      }}>
        <TextArea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="请输入您想咨询的问题，按 Enter 发送，Shift+Enter 换行..."
          rows={3}
          style={{ 
            flex: 1, 
            resize: 'none',
            borderRadius: 8
          }}
          disabled={loading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          loading={loading}
          style={{
            height: 'auto',
            padding: '10px 20px',
            borderRadius: 8,
            backgroundColor: '#FF9800',
            borderColor: '#FF9800'
          }}
        >
          发送
        </Button>
      </div>
    </Modal>
  )
}

export default CounselorChatModal

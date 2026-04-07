import { useState, useEffect } from 'react'
import { Card, Input, Button, List, Avatar, message } from 'antd'
import { SendOutlined, UserOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const { TextArea } = Input

const Chat = () => {
  const { user } = useSelector((state) => state.auth)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'teacher', content: '你好，小明！今天有什么学习问题吗？', time: '14:00' },
    { id: 2, sender: 'me', content: '老师好！我想问一下分数加减法的问题。', time: '14:01' },
    { id: 3, sender: 'teacher', content: '好的，具体来说是哪部分不太理解呢？', time: '14:02' },
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) {
      message.warning('请输入消息内容')
      return
    }

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      content: inputValue,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, newMessage])
    setInputValue('')

    // 模拟老师回复
    setTimeout(() => {
      const replyMessage = {
        id: messages.length + 2,
        sender: 'teacher',
        content: '收到你的问题了，让我来详细解答...',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, replyMessage])
    }, 1000)
  }

  return (
    <div style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ marginBottom: 16, color: '#4CAF50' }}>💬 聊天沟通</h1>

      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 聊天对象信息 */}
        <div style={{ 
          padding: '12px 16px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Avatar style={{ backgroundColor: '#4CAF50' }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>李老师</div>
            <div style={{ fontSize: 12, color: '#52c41a' }}>● 在线</div>
          </div>
        </div>

        {/* 消息列表 */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: 16,
          background: '#f5f5f5'
        }}>
          <List
            dataSource={messages}
            renderItem={(item) => (
              <div style={{
                display: 'flex',
                justifyContent: item.sender === 'me' ? 'flex-end' : 'flex-start',
                marginBottom: 16,
              }}>
                {item.sender !== 'me' && (
                  <Avatar style={{ backgroundColor: '#4CAF50', marginRight: 8 }} icon={<UserOutlined />} />
                )}
                <div style={{
                  maxWidth: '60%',
                  padding: '12px 16px',
                  borderRadius: 16,
                  background: item.sender === 'me' ? '#1890ff' : '#fff',
                  color: item.sender === 'me' ? '#fff' : '#333',
                }}>
                  <div>{item.content}</div>
                  <div style={{ 
                    fontSize: 12, 
                    opacity: 0.7, 
                    textAlign: 'right',
                    marginTop: 4
                  }}>
                    {item.time}
                  </div>
                </div>
                {item.sender === 'me' && (
                  <Avatar style={{ backgroundColor: '#87d068', marginLeft: 8 }} icon={<UserOutlined />} />
                )}
              </div>
            )}
          />
        </div>

        {/* 输入区域 */}
        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入消息..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSend}
            style={{ marginTop: 8 }}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Chat

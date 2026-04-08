import { useState } from 'react'
import { Card, Avatar, Button, Input, Space } from 'antd'
const { TextArea } = Input
const TeacherCommunication = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: '李老师',
      content: '您好，王家长！小明最近在数学学习上有很大进步，尤其是在应用题方面。建议在家多练习一些实际生活中的数学问题，帮助他巩固所学知识。',
      time: '2026-03-30 10:00',
      type: 'received'
    },
    {
      id: 2,
      sender: '王家长',
      content: '谢谢李老师的反馈！我们会按照您的建议，在家多帮助小明练习数学应用题。请问小明在课堂上的表现如何？',
      time: '2026-03-30 10:30',
      type: 'sent'
    },
    {
      id: 3,
      sender: '李老师',
      content: '小明在课堂上表现很积极，经常主动回答问题，而且作业完成质量也很好。他是个很有潜力的学生，只要继续保持，数学成绩会越来越好的。',
      time: '2026-03-30 11:00',
      type: 'received'
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: '王家长',
        content: newMessage,
        time: new Date().toLocaleString('zh-CN'),
        type: 'sent'
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }
  
  const teachers = [
    {
      id: 1,
      name: '李老师',
      subject: '数学教师 | 三年级',
      avatar: '李'
    },
    {
      id: 2,
      name: '张老师',
      subject: '语文教师 | 四年级',
      avatar: '张'
    }
  ]
  
  return (
    <div>
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 20,
          marginBottom: 30
        }}
      >
        <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>孩子的教师</h2>
        {teachers.map(teacher => (
          <div 
            key={teacher.id}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: 15, 
              borderBottom: '1px solid #e0e0e0',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Avatar 
              style={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                backgroundColor: '#FFF3E0', 
                color: '#FF9800', 
                fontWeight: 'bold',
                fontSize: '1.5em',
                marginRight: 15
              }}
            >
              {teacher.avatar}
            </Avatar>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 5 }}>{teacher.name}</div>
              <div style={{ fontSize: '0.9em', color: '#666', marginBottom: 10 }}>{teacher.subject}</div>
            </div>
            <Button 
              style={{ 
                backgroundColor: '#FF9800', 
                color: 'white', 
                fontWeight: 'bold',
                padding: '8px 16px',
                borderRadius: 5,
                fontSize: '14px'
              }}
            >
              沟通
            </Button>
          </div>
        ))}
      </Card>
      
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 20
        }}
      >
        <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>沟通记录</h2>
        <div style={{ marginBottom: 20 }}>
          {messages.map(message => (
            <div 
              key={message.id}
              style={{
                marginBottom: 20,
                padding: 15,
                borderRadius: 10,
                backgroundColor: message.type === 'sent' ? '#FFF3E0' : '#f0f8ff',
                alignSelf: message.type === 'sent' ? 'flex-end' : 'flex-start',
                borderBottomRightRadius: message.type === 'sent' ? 0 : 10,
                borderBottomLeftRadius: message.type === 'sent' ? 10 : 0
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9em' }}>
                <span style={{ fontWeight: 'bold', color: '#FF9800' }}>{message.sender}</span>
                <span style={{ color: '#999' }}>{message.time}</span>
              </div>
              <div style={{ lineHeight: 1.5 }}>{message.content}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <TextArea 
            placeholder="输入消息..."
            style={{ 
              flex: 1, 
              border: '2px solid #e0e0e0', 
              borderRadius: 8, 
              resize: 'none',
              minHeight: 100
            }}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button 
            style={{ 
              backgroundColor: '#FF9800', 
              color: 'white', 
              fontWeight: 'bold',
              alignSelf: 'flex-end',
              padding: '8px 16px',
              borderRadius: 5,
              fontSize: '14px'
            }}
            onClick={handleSendMessage}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  )
}
export default TeacherCommunication

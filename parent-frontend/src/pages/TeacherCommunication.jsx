import { useState, useEffect } from 'react'
import { Card, Avatar, Button, Input } from 'antd'
const { TextArea } = Input
const TeacherCommunication = () => {
  // 存储每个老师的沟通记录
  const [teacherMessages, setTeacherMessages] = useState({
    1: [
      {
        id: 1,
        sender: '陈老师',
        content: '您好，王家长！小明最近在数学学习上有很大进步，尤其是在应用题方面。建议在家多练习一些实际生活中的数学问题，帮助他巩固所学知识。',
        time: '2026-03-30 10:00',
        type: 'received'
      },
      {
        id: 2,
        sender: '王家长',
        content: '谢谢陈老师的反馈！我们会按照您的建议，在家多帮助小明练习数学应用题。请问小明在课堂上的表现如何？',
        time: '2026-03-30 10:30',
        type: 'sent'
      },
      {
        id: 3,
        sender: '陈老师',
        content: '小明在课堂上表现很积极，经常主动回答问题，而且作业完成质量也很好。他是个很有潜力的学生，只要继续保持，数学成绩会越来越好的。',
        time: '2026-03-30 11:00',
        type: 'received'
      }
    ],
    2: [
      {
        id: 1,
        sender: '张老师',
        content: '您好，王家长！小红最近在语文学习上有很大进步，尤其是在作文方面。建议在家多阅读一些经典文学作品，帮助她提高写作水平。',
        time: '2026-03-29 14:00',
        type: 'received'
      },
      {
        id: 2,
        sender: '王家长',
        content: '谢谢张老师的反馈！我们会按照您的建议，在家多帮助小红阅读文学作品。请问小红在课堂上的表现如何？',
        time: '2026-03-29 14:30',
        type: 'sent'
      },
      {
        id: 3,
        sender: '张老师',
        content: '小红在课堂上表现很认真，总是认真听讲并做好笔记。她的作文进步很大，特别是在描写方面，已经能够生动地描述事物和场景了。',
        time: '2026-03-29 15:00',
        type: 'received'
      }
    ]
  })
  
  const [selectedTeacher, setSelectedTeacher] = useState(null) // 默认未选中老师
  const [newMessage, setNewMessage] = useState('')
  
  // 从localStorage获取老师列表，如果没有则使用空数组
  const [teachers, setTeachers] = useState(() => {
    try {
      const storedTeachers = localStorage.getItem('teachers')
      if (storedTeachers) {
        const parsedTeachers = JSON.parse(storedTeachers)
        if (Array.isArray(parsedTeachers)) {
          return parsedTeachers
        }
      }
    } catch (error) {
      console.error('读取localStorage失败:', error)
    }
    return []
  })
  
  // 组件挂载时重新从localStorage读取数据，确保显示最新状态
  useEffect(() => {
    try {
      const storedTeachers = localStorage.getItem('teachers')
      if (storedTeachers) {
        const parsedTeachers = JSON.parse(storedTeachers)
        if (Array.isArray(parsedTeachers)) {
          setTeachers(parsedTeachers)
          // 如果有老师，默认选中第一个
          if (parsedTeachers.length > 0 && !selectedTeacher) {
            setSelectedTeacher(parsedTeachers[0].id)
          }
        }
      }
    } catch (error) {
      console.error('读取localStorage失败:', error)
    }
  }, [selectedTeacher])
  
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedTeacher) {
      const message = {
        id: (teacherMessages[selectedTeacher]?.length || 0) + 1,
        sender: '王家长',
        content: newMessage,
        time: new Date().toLocaleString('zh-CN'),
        type: 'sent'
      }
      setTeacherMessages({
        ...teacherMessages,
        [selectedTeacher]: [...(teacherMessages[selectedTeacher] || []), message]
      })
      setNewMessage('')
    }
  }
  
  const handleStartCommunication = (teacherId) => {
    setSelectedTeacher(teacherId)
  }
  
  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 教师沟通标题栏 */}
      <div style={{
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>教师沟通</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>欢迎，王家长</span>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#FF9800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>王</div>
        </div>
      </div>

      {/* 孩子的教师 */}
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 20,
          marginBottom: 30,
          backgroundColor: '#fff'
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
                backgroundColor: selectedTeacher === teacher.id ? '#F57C00' : '#FF9800', 
                color: 'white', 
                fontWeight: 'bold',
                padding: '8px 16px',
                borderRadius: 5,
                fontSize: '14px',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F57C00'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = selectedTeacher === teacher.id ? '#F57C00' : '#FF9800'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              onClick={() => handleStartCommunication(teacher.id)}
            >
              沟通
            </Button>
          </div>
        ))}
      </Card>
      
      {/* 沟通记录 */}
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 20,
          backgroundColor: '#fff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <h2 style={{ color: '#FF9800', margin: 0, fontSize: '1.5em' }}>沟通记录</h2>
          {selectedTeacher && (
            <div style={{ 
              backgroundColor: '#FFF3E0', 
              padding: '8px 16px', 
              borderRadius: 20, 
              fontSize: '0.9em',
              fontWeight: 'bold',
              color: '#FF9800'
            }}>
              {teachers.find(t => t.id === selectedTeacher)?.name}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 20 }}>
          {selectedTeacher ? (
            (teacherMessages[selectedTeacher] && teacherMessages[selectedTeacher].length > 0) ? (
              teacherMessages[selectedTeacher].map(message => (
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
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 40, 
                color: '#999',
                fontSize: '1.1em'
              }}>
                暂无沟通记录，开始与老师交流吧！
              </div>
            )
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: 40, 
              color: '#999',
              fontSize: '1.1em'
            }}>
              请从左侧选择一位老师开始沟通
            </div>
          )}
        </div>
        {selectedTeacher && (
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <TextArea 
              placeholder="输入消息..."
              style={{ 
                flex: 1, 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                resize: 'none',
                minHeight: 100,
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FF9800'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = 'none'
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
                fontSize: '14px',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F57C00'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF9800'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              onClick={handleSendMessage}
            >
              发送
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
export default TeacherCommunication

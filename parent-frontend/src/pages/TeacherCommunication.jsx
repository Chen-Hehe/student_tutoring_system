import { useState, useEffect } from 'react'
import { Card, Avatar, Button, Input, message, Spin } from 'antd'
import { useSelector } from 'react-redux'
import { parentAPI } from '../services/parentApi'
const { TextArea } = Input
const TeacherCommunication = () => {
  const currentUser = useSelector((state) => state.auth.user)
  // 存储每个老师的沟通记录
  const [teacherMessages, setTeacherMessages] = useState({})
  const [selectedTeacher, setSelectedTeacher] = useState(null) // 默认未选中老师
  const [newMessage, setNewMessage] = useState('')
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [studentId, setStudentId] = useState(null)
  const [students, setStudents] = useState([])

  useEffect(() => {
    fetchChildren()
  }, [])

  // 组件挂载时或学生ID变化时获取教师列表
  useEffect(() => {
    fetchTeachers()
  }, [studentId])
  
  // 选择教师时获取沟通记录
  useEffect(() => {
    if (selectedTeacher) {
      fetchCommunicationHistory(selectedTeacher)
    }
  }, [selectedTeacher])

  // 获取孩子列表
  const fetchChildren = async () => {
    try {
      const response = await parentAPI.getChildren()
      if (response && response.data && response.data.success && response.data.data) {
        const childList = response.data.data.map(child => ({
          id: child.id,
          name: child.name,
          grade: child.grade,
          displayName: `${child.name} (${child.grade})`
        }))
        setStudents(childList)
        if (childList.length > 0) {
          setStudentId(childList[0].id)
        }
      }
    } catch (error) {
      console.error('获取孩子列表失败:', error)
    }
  }

  // 获取教师列表
  const fetchTeachers = async () => {
    if (!studentId) {
      return
    }
    setLoading(true)
    try {
      console.log('Fetching teachers for studentId:', studentId)
      const response = await parentAPI.getTeachers(studentId)
      console.log('Response from API:', response)
      if (response && response.data) {
        // 检查后端返回的数据格式
        console.log('Response data:', response.data)
        if (response.data.success && response.data.data) {
          const teacherList = response.data.data
          setTeachers(teacherList)
          // 如果有老师，默认选中第一个
          if (teacherList.length > 0 && !selectedTeacher) {
            setSelectedTeacher(teacherList[0].id)
          }
        } else if (response.data.code === 200 && response.data.data) {
          // 处理旧的数据格式
          const teacherList = response.data.data
          setTeachers(teacherList)
          // 如果有老师，默认选中第一个
          if (teacherList.length > 0 && !selectedTeacher) {
            setSelectedTeacher(teacherList[0].id)
          }
        } else {
          message.info('暂无教师信息')
          setTeachers([])
        }
      } else {
        message.info('暂无教师信息')
        setTeachers([])
      }
    } catch (error) {
      message.error('获取教师列表失败')
      console.error('Error fetching teachers:', error)
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }
  
  // 获取沟通记录
  const fetchCommunicationHistory = async (teacherId) => {
    setLoading(true)
    try {
      console.log('Fetching communication history for studentId:', studentId, 'teacherId:', teacherId)
      const response = await parentAPI.getCommunicationHistory(studentId, teacherId)
      console.log('Response from API:', response)
      if (response && response.data && response.data.success) {
        const messages = response.data.data
        setTeacherMessages({
          ...teacherMessages,
          [teacherId]: messages
        })
      } else {
        setTeacherMessages({
          ...teacherMessages,
          [teacherId]: []
        })
      }
    } catch (error) {
      message.error('获取沟通记录失败')
      console.error('Error fetching communication history:', error)
      setTeacherMessages({
        ...teacherMessages,
        [teacherId]: []
      })
    } finally {
      setLoading(false)
    }
  }
  
  // 发送消息
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTeacher) return
    
    setLoading(true)
    try {
      const response = await parentAPI.sendMessage(studentId, selectedTeacher, newMessage)
      if (response && response.data && response.data.success) {
        // 重新获取沟通记录
        await fetchCommunicationHistory(selectedTeacher)
        setNewMessage('')
        message.success('消息发送成功')
      } else {
        message.error('消息发送失败')
      }
    } catch (error) {
      message.error('消息发送失败')
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>教师沟通</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1em', color: '#666' }}>选择孩子：</span>
            <select 
              value={studentId}
              onChange={(e) => {
                setStudentId(parseInt(e.target.value))
                setSelectedTeacher(null)
                setTeachers([])
                setTeacherMessages({})
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 5,
                border: '1px solid #e0e0e0',
                fontSize: '1em',
                backgroundColor: '#fff'
              }}
            >
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>欢迎，{currentUser?.name || '家长'}</span>
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
          }}>{currentUser?.name?.charAt(0) || '家'}</div>
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <p style={{ marginTop: 10, color: '#666' }}>加载中...</p>
          </div>
        ) : (
          teachers.length > 0 ? (
            teachers.map(teacher => (
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
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: 40, 
              color: '#999',
              fontSize: '1.1em'
            }}>
              暂无教师信息
            </div>
          )
        )}
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" />
              <p style={{ marginTop: 10, color: '#666' }}>加载中...</p>
            </div>
          ) : selectedTeacher ? (
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
              loading={loading}
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

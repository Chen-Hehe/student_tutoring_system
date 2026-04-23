import { useState, useEffect } from 'react'
import { Card, Row, Col, Progress, Avatar, Button, Modal, Input, message } from 'antd'
import { useSelector } from 'react-redux'
import { parentAPI } from '../services/parentApi'
const { TextArea } = Input
const PsychologicalStatus = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [selectedChild, setSelectedChild] = useState(null)
  const [isContactModalVisible, setIsContactModalVisible] = useState(false)
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [counselorMessages, setCounselorMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [children, setChildren] = useState([])
  const [statusData, setStatusData] = useState({})
  const [currentStatus, setCurrentStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [counselors, setCounselors] = useState([])

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await parentAPI.getCounselors()
        if (response && response.data && response.data.success && response.data.data) {
          const counselorList = response.data.data.map(c => ({
            id: c.id,
            name: c.name,
            title: c.subject || '心理辅导员',
            avatar: c.name?.charAt(0) || '辅'
          }))
          setCounselors(counselorList)
          const initialMessages = {}
          counselorList.forEach(c => {
            initialMessages[c.id] = [
              {
                id: 1,
                sender: c.name,
                content: `您好，${currentUser?.name || '家长'}！我是${c.name}，专注于儿童心理健康。请问有什么可以帮助您的？`,
                time: new Date().toLocaleString('zh-CN'),
                type: 'received'
              }
            ]
          })
          setCounselorMessages(initialMessages)
        }
      } catch (error) {
        console.error('获取心理辅导员列表失败:', error)
      }
    }
    fetchCounselors()
  }, [currentUser])
  
  // 获取孩子列表
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await parentAPI.getChildren()
        console.log('Children response:', response)
        if (response && response.data && response.data.success && response.data.data) {
        const childList = response.data.data.map(child => ({
          id: child.id,
          name: child.name,
          grade: child.grade,
          displayName: `${child.name} (${child.grade})`
        }))
        setChildren(childList)
        if (childList.length > 0) {
          setSelectedChild(childList[0])
        }
      }
      } catch (error) {
        console.error('Error fetching children:', error)
        message.error('获取孩子列表失败')
      }
    }
    
    fetchChildren()
  }, [])
  
  // 获取心理状态评估数据
  const fetchPsychologicalStatus = async (studentId) => {
    if (!studentId) return
    
    setLoading(true)
    try {
      console.log('Fetching psychological status for studentId:', studentId)
      const response = await parentAPI.getPsychologicalStatus(studentId)
      console.log('Response from API:', response)
      if (response && response.data && response.data.success && response.data.data) {
        const statusData = {
          statuses: response.data.data.statuses,
          assessments: response.data.data.assessments
        }
        setStatusData(statusData)
        setCurrentStatus(statusData)
      } else {
        console.log('No status data found')
        setCurrentStatus(null)
        message.info('暂无心理状态评估数据')
      }
    } catch (error) {
      message.error('获取心理状态评估失败')
      console.error('Error fetching psychological status:', error)
      if (error.response) {
        console.error('Error response:', error.response)
      }
      setCurrentStatus(null)
    } finally {
      setLoading(false)
    }
  }
  
  // 当选中的孩子变化时，获取对应的心理状态评估数据
  useEffect(() => {
    if (selectedChild) {
      fetchPsychologicalStatus(selectedChild.id)
    }
  }, [selectedChild])
  
  const getStatusColor = (level) => {
    switch (level) {
      case 'good': return '#28a745'
      case 'warning': return '#ffc107'
      case 'danger': return '#dc3545'
      default: return '#28a745'
    }
  }
  
  const getStatusBadge = (level, text) => {
    const style = {
      display: 'inline-block',
      padding: '5px 15px',
      borderRadius: 15,
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: 10
    }
    
    switch (level) {
      case 'good':
        return <span style={{ ...style, backgroundColor: '#d4edda', color: '#155724' }}>{text}</span>
      case 'warning':
        return <span style={{ ...style, backgroundColor: '#fff3cd', color: '#856404' }}>{text}</span>
      case 'danger':
        return <span style={{ ...style, backgroundColor: '#f8d7da', color: '#721c24' }}>{text}</span>
      default:
        return <span style={{ ...style, backgroundColor: '#d4edda', color: '#155724' }}>{text}</span>
    }
  }
  
  const handleContactCounselor = (counselor) => {
    setSelectedCounselor(counselor)
    setIsContactModalVisible(true)
  }
  
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedCounselor) {
      const message = {
        id: counselorMessages[selectedCounselor.id]?.length + 1 || 1,
        sender: currentUser?.name || '家长',
        content: newMessage,
        time: new Date().toLocaleString('zh-CN'),
        type: 'sent'
      }
      setCounselorMessages({
        ...counselorMessages,
        [selectedCounselor.id]: [...(counselorMessages[selectedCounselor.id] || []), message]
      })
      setNewMessage('')
    }
  }
  
  const handleCancelContact = () => {
    setIsContactModalVisible(false)
    setSelectedCounselor(null)
    setNewMessage('')
  }
  
  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 心理状态标题栏 */}
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
        <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>心理状态</h1>
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

      {/* 选择孩子 */}
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 20,
          marginBottom: 30,
          backgroundColor: '#fff'
        }}
      >
        <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>选择孩子</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {children.map(child => (
            <div 
              key={child.id}
              style={{
                padding: '15px 30px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedChild && selectedChild.id === child.id ? '#FFF3E0' : 'transparent',
                borderColor: selectedChild && selectedChild.id === child.id ? '#FF9800' : '#e0e0e0',
                fontWeight: selectedChild && selectedChild.id === child.id ? 'bold' : 'normal'
              }}
              onClick={() => setSelectedChild(child)}
              onMouseEnter={(e) => {
                if (!selectedChild || selectedChild.id !== child.id) {
                  e.currentTarget.borderColor = '#FF9800'
                  e.currentTarget.backgroundColor = '#FFF3E0'
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedChild || selectedChild.id !== child.id) {
                  e.currentTarget.borderColor = '#e0e0e0'
                  e.currentTarget.backgroundColor = 'transparent'
                }
              }}
            >
              {child.displayName}
            </div>
          ))}
        </div>
      </Card>
      
      {/* 心理状态评估 */}
      <Card 
        style={{ 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderRadius: 10,
          padding: 30,
          marginBottom: 30,
          backgroundColor: '#fff'
        }}
      >
        <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>心理状态评估</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>加载中心理状态评估数据...</p>
          </div>
        ) : currentStatus ? (
          <>
            <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
              {Object.entries(currentStatus.statuses).map(([title, status]) => (
                <Col xs={24} md={6} key={title}>
                  <div style={{ 
                    backgroundColor: '#f9f9f9',
                    padding: 20,
                    borderRadius: 10,
                    textAlign: 'center'
                  }}>
                    <h3 style={{ marginBottom: 10, color: '#555' }}>{title}</h3>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#FF9800' }}>{status.value}</div>
                    {getStatusBadge(status.level, status.level === 'good' ? '正常' : status.level === 'warning' ? '注意' : '危险')}
                  </div>
                </Col>
              ))}
            </Row>
            
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ marginBottom: 15, color: '#333' }}>详细评估</h3>
              {Object.entries(currentStatus.assessments).map(([title, assessment]) => (
                <div key={title} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontWeight: 'bold' }}>{title}</span>
                    <span style={{ fontWeight: 'bold' }}>{assessment.percentage}%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: 10, 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: 5, 
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${assessment.percentage}%`, 
                        backgroundColor: getStatusColor(assessment.level), 
                        borderRadius: 5
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10 }}>
              <h3 style={{ marginBottom: 15, color: '#333' }}>推荐心理辅导员</h3>
              {counselors.map(counselor => (
                <div key={counselor.id} style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                  <Avatar 
                    style={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      backgroundColor: '#FFF3E0', 
                      color: '#FF9800', 
                      fontWeight: 'bold',
                      fontSize: '1.5em'
                    }}
                  >
                    {counselor.avatar}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: 5 }}>{counselor.name}</h4>
                    <p style={{ color: '#666', fontSize: '0.9em' }}>{counselor.title}</p>
                  </div>
                  <Button 
                    style={{ 
                      backgroundColor: '#FF9800', 
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
                      e.currentTarget.style.backgroundColor = '#FF9800'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                    onClick={() => handleContactCounselor(counselor)}
                  >
                    联系
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>暂无心理状态评估数据</p>
          </div>
        )}
      </Card>
      
      {/* 联系心理辅导员模态框 */}
      <Modal
        title={`联系 ${selectedCounselor?.name}`}
        open={isContactModalVisible}
        onCancel={handleCancelContact}
        footer={null}
        style={{
          borderRadius: 10,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}
        width={600}
      >
        <div style={{ height: 400, overflowY: 'auto', marginBottom: 20 }}>
          {selectedCounselor && counselorMessages[selectedCounselor.id].map(message => (
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
        <div style={{ display: 'flex', gap: 10 }}>
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
      </Modal>
    </div>
  )
}
export default PsychologicalStatus

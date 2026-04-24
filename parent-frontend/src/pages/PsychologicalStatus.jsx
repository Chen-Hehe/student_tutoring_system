import { useState, useEffect } from 'react'
import { Card, Row, Col, Progress, Avatar, Button, message } from 'antd'
import { CustomerServiceOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { parentAPI } from '../services/parentApi'
import CounselorChatModal from '../components/CounselorChatModal'
const { PsychologicalStatus = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [selectedChild, setSelectedChild] = useState(null)
  const [children, setChildren] = useState([])
  const [statusData, setStatusData] = useState({})
  const [currentStatus, setCurrentStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isAIModalVisible, setIsAIModalVisible] = useState(false)

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
              
              {/* AI 心理辅导员 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 15,
                padding: '15px',
                backgroundColor: '#fff',
                borderRadius: 8,
                border: '2px solid #FF9800'
              }}>
                <Avatar 
                  style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    backgroundColor: '#FF9800', 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '1.5em'
                  }}
                >
                  🤖
                </Avatar>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: 5 }}>AI 心理辅导员</h4>
                  <p style={{ color: '#666', fontSize: '0.9em' }}>7×24 小时在线，即时解答您的育儿困惑</p>
                </div>
                <Button 
                  type="primary"
                  icon={<CustomerServiceOutlined />}
                  style={{ 
                    backgroundColor: '#FF9800', 
                    borderColor: '#FF9800',
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: 5,
                    fontSize: '14px'
                  }}
                  onClick={() => setIsAIModalVisible(true)}
                >
                  💛 沟通
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>暂无心理状态评估数据</p>
          </div>
        )}
      </Card>
      
      {/* AI 心理辅导员聊天弹窗 */}
      <CounselorChatModal
        open={isAIModalVisible}
        onClose={() => setIsAIModalVisible(false)}
      />
    </div>
  )
}

export default PsychologicalStatus

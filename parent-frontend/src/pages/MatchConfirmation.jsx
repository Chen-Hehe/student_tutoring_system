import { useState, useEffect } from 'react'
import { Card, Button, message } from 'antd'
import { parentAPI } from '../services/parentApi'
const MatchConfirmation = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentRequest, setCurrentRequest] = useState(null)
  const [matchRequests, setMatchRequests] = useState([])
  const [confirmedRequests, setConfirmedRequests] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 组件挂载时从后端获取匹配请求和已确认的请求
  useEffect(() => {
    fetchMatchRequests()
    fetchConfirmedRequests()
  }, [])
  
  // 获取匹配请求
  const fetchMatchRequests = async () => {
    setLoading(true)
    try {
      const response = await parentAPI.getMatchRequests()
      if (response && response.data && response.data.success) {
        // 转换数据格式，适配前端展示
        const formattedRequests = response.data.data.map(request => ({
          id: request.id,
          title: `辅导请求 - ${request.studentName}（${request.grade}）`,
          status: 'pending',
          subject: request.subject,
          requirement: request.requestMessage || '暂无需求描述',
          time: request.createdAt,
          teacher: {
            name: request.teacherName,
            education: '北京大学',
            experience: '5年',
            location: '北京市'
          }
        }))
        setMatchRequests(formattedRequests)
      }
    } catch (error) {
      message.error('获取匹配请求失败')
      console.error('Error fetching match requests:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 获取已确认的匹配请求
  const fetchConfirmedRequests = async () => {
    try {
      // 由于后端没有提供获取已确认匹配请求的API，我们暂时使用模拟数据
      // 实际项目中应该添加一个新的API接口
      const confirmedRequests = [
        {
          id: 3,
          title: '辅导请求 - 小明（三年级）',
          status: 'confirmed',
          subject: '数学',
          requirement: '为小明提供数学辅导，重点加强分数的加减法',
          time: '2026-03-30 09:30:00',
          confirmedTime: '2026-04-20 10:00:00',
          teacher: {
            name: '李老师',
            education: '北京大学',
            experience: '8年',
            location: '北京市'
          }
        },
        {
          id: 4,
          title: '辅导请求 - 小红（四年级）',
          status: 'confirmed',
          subject: '语文',
          requirement: '为小红提供语文辅导，重点加强作文指导',
          time: '2026-03-29 16:45:00',
          confirmedTime: '2026-04-20 10:00:00',
          teacher: {
            name: '张老师',
            education: '北京师范大学',
            experience: '5年',
            location: '上海市'
          }
        }
      ]
      setConfirmedRequests(confirmedRequests)
    } catch (error) {
      console.error('Error fetching confirmed requests:', error)
    }
  }
  
  const handleApprove = async (request) => {
    if (window.confirm('确定要同意这个辅导请求吗？')) {
      try {
        // 调用API确认匹配请求
        await parentAPI.confirmMatchRequest(request.id, true)
        
        // 从待确认列表中移除该请求
        const updatedPendingRequests = matchRequests.filter(req => req.id !== request.id)
        setMatchRequests(updatedPendingRequests)
        
        // 将该请求添加到已确认列表
        const confirmedRequest = {
          ...request,
          status: 'confirmed',
          confirmedTime: new Date().toLocaleString('zh-CN')
        }
        const updatedConfirmedRequests = [...confirmedRequests, confirmedRequest]
        setConfirmedRequests(updatedConfirmedRequests)
        
        message.success('已同意辅导请求，辅导状态已更新')
      } catch (error) {
        message.error('同意辅导请求失败')
        console.error('Error approving match request:', error)
      }
    }
  }
  
  const handleReject = async (request) => {
    if (window.confirm('确定要拒绝这个辅导请求吗？')) {
      try {
        // 调用API拒绝匹配请求
        await parentAPI.confirmMatchRequest(request.id, false)
        
        // 从待确认列表中移除该请求
        const updatedPendingRequests = matchRequests.filter(req => req.id !== request.id)
        setMatchRequests(updatedPendingRequests)
        
        message.success('已拒绝辅导请求')
      } catch (error) {
        message.error('拒绝辅导请求失败')
        console.error('Error rejecting match request:', error)
      }
    }
  }
  
  const handleCancel = async (request) => {
    if (window.confirm('确定要撤销这个已确认的辅导请求吗？')) {
      try {
        // 这里需要调用API撤销匹配请求，暂时使用模拟数据
        
        // 从已确认列表中移除该请求
        const updatedConfirmedRequests = confirmedRequests.filter(req => req.id !== request.id)
        setConfirmedRequests(updatedConfirmedRequests)
        
        // 将该请求重新添加到待确认列表
        const pendingRequest = {
          ...request,
          status: 'pending'
        }
        delete pendingRequest.confirmedTime
        const updatedPendingRequests = [...matchRequests, pendingRequest]
        setMatchRequests(updatedPendingRequests)
        
        message.success('已撤销辅导请求，辅导状态已更新')
      } catch (error) {
        message.error('撤销辅导请求失败')
        console.error('Error canceling match request:', error)
      }
    }
  }
  
  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 匹配确认标题栏 */}
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
        <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>匹配确认</h1>
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

      {/* 匹配请求列表 */}
      <Card 
        style={{ 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderRadius: 10,
          padding: 25,
          backgroundColor: '#fff'
        }}
      >
        {matchRequests.map(request => (
          <div 
            key={request.id}
            style={{ 
              padding: 20, 
              borderBottom: '1px solid #e0e0e0',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{request.title}</div>
              <span style={{
                padding: '5px 10px',
                borderRadius: 15,
                fontSize: '0.8em',
                fontWeight: 'bold',
                backgroundColor: '#fff3cd',
                color: '#856404'
              }}>待家长确认</span>
            </div>
            <div style={{ marginBottom: 15 }}>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>📝 辅导科目：{request.subject}</p>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>🎯 学习需求：{request.requirement}</p>
              <p style={{ fontSize: '0.9em' }}>⏰ {request.title.includes('请求') ? '申请' : '邀请'}时间：{request.time}</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 15 }}>
              <h4 style={{ marginBottom: 10, color: '#FF9800' }}>教师信息</h4>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>👩‍🏫 姓名：{request.teacher.name}</p>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>🎓 教育背景：{request.teacher.education}</p>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>📚 教学经验：{request.teacher.experience}</p>
              <p style={{ fontSize: '0.9em' }}>📍 所在地：{request.teacher.location}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button 
                style={{ 
                  backgroundColor: '#FF9800', 
                  color: 'white', 
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  borderRadius: 5,
                  fontSize: '0.9em',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleApprove(request)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F57C00'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF9800'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                同意
              </Button>
              <Button 
                style={{ 
                  backgroundColor: '#e0e0e0', 
                  color: '#333', 
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  borderRadius: 5,
                  fontSize: '0.9em',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleReject(request)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#bdbdbd'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e0e0e0'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                拒绝
              </Button>
            </div>
          </div>
        ))}
      </Card>
      
      {/* 已确认的辅导请求 */}
      {confirmedRequests.length > 0 && (
        <Card 
          style={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            borderRadius: 10,
            padding: 25,
            marginTop: 30,
            backgroundColor: '#fff'
          }}
        >
          <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>已确认的辅导请求</h2>
          {confirmedRequests.map(request => (
            <div 
              key={request.id}
              style={{ 
                padding: 20, 
                borderBottom: '1px solid #e0e0e0',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{request.title}</div>
                <span style={{
                  padding: '5px 10px',
                  borderRadius: 15,
                  fontSize: '0.8em',
                  fontWeight: 'bold',
                  backgroundColor: '#d4edda',
                  color: '#155724'
                }}>已确认</span>
              </div>
              <div style={{ marginBottom: 15 }}>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>📝 辅导科目：{request.subject}</p>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>🎯 学习需求：{request.requirement}</p>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>⏰ {request.title.includes('请求') ? '申请' : '邀请'}时间：{request.time}</p>
                <p style={{ fontSize: '0.9em' }}>✅ 确认时间：{request.confirmedTime}</p>
              </div>
              <div style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 15 }}>
                <h4 style={{ marginBottom: 10, color: '#FF9800' }}>教师信息</h4>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>👩‍🏫 姓名：{request.teacher.name}</p>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>🎓 教育背景：{request.teacher.education}</p>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>📚 教学经验：{request.teacher.experience}</p>
                <p style={{ fontSize: '0.9em' }}>📍 所在地：{request.teacher.location}</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button 
                  style={{ 
                    backgroundColor: '#FF9800', 
                    color: 'white', 
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: 5,
                    fontSize: '0.9em',
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
                >
                  与老师沟通
                </Button>
                <Button 
                  style={{ 
                    backgroundColor: '#e0e0e0', 
                    color: '#333', 
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: 5,
                    fontSize: '0.9em',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleCancel(request)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#bdbdbd'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0e0e0'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  撤销
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
export default MatchConfirmation

import { useState } from 'react'
import { Card, Button, Tag, Modal } from 'antd'
const MatchConfirmation = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentRequest, setCurrentRequest] = useState(null)
  
  const matchRequests = [
    {
      id: 1,
      title: '辅导请求 - 小明（三年级）',
      status: 'pending',
      subject: '数学',
      requirement: '分数的加减法',
      time: '2026-03-30 09:30',
      teacher: {
        name: '李老师',
        education: '北京大学数学专业',
        experience: '8年',
        location: '北京市'
      }
    },
    {
      id: 2,
      title: '辅导邀请 - 小红（四年级）',
      status: 'pending',
      subject: '语文',
      requirement: '作文指导',
      time: '2026-03-29 16:45',
      teacher: {
        name: '王老师',
        education: '北京师范大学中文专业',
        experience: '5年',
        location: '上海市'
      }
    }
  ]
  
  const handleApprove = (request) => {
    if (window.confirm('确定要同意这个辅导请求吗？')) {
      alert('已同意辅导请求')
    }
  }
  
  const handleReject = (request) => {
    if (window.confirm('确定要拒绝这个辅导请求吗？')) {
      alert('已拒绝辅导请求')
    }
  }
  
  return (
    <div>
      <Card 
        style={{ 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderRadius: 10,
          padding: 25
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
              <Tag color="orange">待家长确认</Tag>
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
                  fontSize: '0.9em'
                }}
                onClick={() => handleApprove(request)}
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
                  fontSize: '0.9em'
                }}
                onClick={() => handleReject(request)}
              >
                拒绝
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
export default MatchConfirmation

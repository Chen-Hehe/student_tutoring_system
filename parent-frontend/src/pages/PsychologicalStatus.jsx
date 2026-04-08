import { useState } from 'react'
import { Card, Row, Col, Progress, Avatar, Button } from 'antd'
const PsychologicalStatus = () => {
  const [selectedChild, setSelectedChild] = useState('小明 (三年级)')
  
  const children = [
    '小明 (三年级)',
    '小红 (四年级)'
  ]
  
  const statusData = {
    '小明 (三年级)': {
      statuses: {
        '情绪状态': { value: '良好', level: 'good', percentage: 85 },
        '社交能力': { value: '优秀', level: 'good', percentage: 90 },
        '学习压力': { value: '中等', level: 'warning', percentage: 60 },
        '心理健康': { value: '良好', level: 'good', percentage: 80 }
      },
      assessments: {
        '情绪稳定性': { percentage: 85, level: 'good' },
        '社交互动': { percentage: 90, level: 'good' },
        '学习压力': { percentage: 60, level: 'warning' },
        '自我认知': { percentage: 80, level: 'good' }
      }
    },
    '小红 (四年级)': {
      statuses: {
        '情绪状态': { value: '良好', level: 'good', percentage: 80 },
        '社交能力': { value: '良好', level: 'good', percentage: 85 },
        '学习压力': { value: '轻度', level: 'good', percentage: 45 },
        '心理健康': { value: '优秀', level: 'good', percentage: 90 }
      },
      assessments: {
        '情绪稳定性': { percentage: 80, level: 'good' },
        '社交互动': { percentage: 85, level: 'good' },
        '学习压力': { percentage: 45, level: 'good' },
        '自我认知': { percentage: 88, level: 'good' }
      }
    }
  }
  
  const counselors = [
    {
      id: 1,
      name: '王心理师',
      title: '国家二级心理咨询师 | 儿童心理专家',
      avatar: '王'
    },
    {
      id: 2,
      name: '张心理师',
      title: '国家二级心理咨询师 | 青少年心理专家',
      avatar: '张'
    }
  ]
  
  const currentStatus = statusData[selectedChild]
  
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
              key={child}
              style={{
                padding: '15px 30px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedChild === child ? '#FFF3E0' : 'transparent',
                borderColor: selectedChild === child ? '#FF9800' : '#e0e0e0',
                fontWeight: selectedChild === child ? 'bold' : 'normal'
              }}
              onClick={() => setSelectedChild(child)}
              onMouseEnter={(e) => {
                if (selectedChild !== child) {
                  e.currentTarget.borderColor = '#FF9800'
                  e.currentTarget.backgroundColor = '#FFF3E0'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChild !== child) {
                  e.currentTarget.borderColor = '#e0e0e0'
                  e.currentTarget.backgroundColor = 'transparent'
                }
              }}
            >
              {child}
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
              >
                联系
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
export default PsychologicalStatus

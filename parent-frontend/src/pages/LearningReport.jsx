import { useState, useEffect } from 'react'
import { Card, Row, Col, Progress, message, Spin } from 'antd'
import { parentAPI } from '../services/parentApi'
const LearningReport = () => {
  const [selectedChild, setSelectedChild] = useState(null)
  const [children, setChildren] = useState([])
  const [reportData, setReportData] = useState({})
  const [loading, setLoading] = useState(false)
  
  // 组件挂载时获取孩子列表
  useEffect(() => {
    fetchChildren()
  }, [])
  
  // 选择孩子变化时获取学习报告
  useEffect(() => {
    if (selectedChild) {
      fetchLearningReport(selectedChild.id)
    }
  }, [selectedChild])
  
  // 获取孩子列表
  const fetchChildren = async () => {
    setLoading(true)
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
        console.log('Child list:', childList)
        setChildren(childList)
        if (childList.length > 0) {
          setSelectedChild(childList[0])
        }
      }
    } catch (error) {
      message.error('获取孩子列表失败')
      console.error('Error fetching children:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 获取学习报告
  const fetchLearningReport = async (studentId) => {
    setLoading(true)
    try {
      console.log('Fetching learning report for studentId:', studentId)
      const response = await parentAPI.getLearningReports(studentId)
      console.log('Response from API:', response)
      if (response && response.data && response.data.success && response.data.data && response.data.data.length > 0) {
        const report = response.data.data[0] // 取最新的学习报告
        console.log('Selected report:', report)
        setReportData(report)
      } else {
        console.log('No report data found')
        setReportData({})
        message.info('暂无学习报告数据')
      }
    } catch (error) {
      message.error('获取学习报告失败')
      console.error('Error fetching learning report:', error)
      if (error.response) {
        console.error('Error response:', error.response)
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 学习报告标题栏 */}
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
        <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>学习报告</h1>
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
        {loading && !selectedChild ? (
          <Spin size="large" style={{ margin: '20px 0' }} />
        ) : (
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
                  backgroundColor: selectedChild?.id === child.id ? '#FFF3E0' : 'transparent',
                  borderColor: selectedChild?.id === child.id ? '#FF9800' : '#e0e0e0',
                  fontWeight: selectedChild?.id === child.id ? 'bold' : 'normal'
                }}
                onClick={() => setSelectedChild(child)}
                onMouseEnter={(e) => {
                  if (selectedChild?.id !== child.id) {
                    e.currentTarget.borderColor = '#FF9800'
                    e.currentTarget.backgroundColor = '#FFF3E0'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChild?.id !== child.id) {
                    e.currentTarget.borderColor = '#e0e0e0'
                    e.currentTarget.backgroundColor = 'transparent'
                  }
                }}
              >
                {child.displayName}
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* 学习情况报告 */}
      <Card 
        style={{ 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderRadius: 10,
          padding: 30,
          marginBottom: 30,
          backgroundColor: '#fff'
        }}
      >
        <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>学习情况报告</h2>
        {loading ? (
          <Spin size="large" style={{ margin: '50px 0' }} />
        ) : Object.keys(reportData).length > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, paddingBottom: 20, borderBottom: '1px solid #e0e0e0' }}>
              <div>
                <h3 style={{ fontSize: '1.2em', marginBottom: 10 }}>{reportData.studentName}</h3>
                <p style={{ color: '#666', marginBottom: 5 }}>{reportData.grade} | {reportData.subjects}</p>
                <p style={{ color: '#666' }}>报告周期：{reportData.reportPeriod}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2em', marginBottom: 10 }}>总体评价</h3>
                <p style={{ color: '#666', marginBottom: 5 }}>{reportData.overall}</p>
                <p style={{ color: '#666' }}>班级排名：{reportData.rank}</p>
              </div>
            </div>
            
            <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
              {Object.entries(reportData.grades).map(([subject, grade]) => (
                <Col xs={24} md={6} key={subject}>
                  <div style={{ 
                    backgroundColor: '#f9f9f9',
                    padding: 20,
                    borderRadius: 10,
                    textAlign: 'center'
                  }}>
                    <h4 style={{ marginBottom: 10, color: '#555' }}>{subject}</h4>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#FF9800' }}>{grade}</div>
                  </div>
                </Col>
              ))}
            </Row>
            
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ marginBottom: 15, color: '#333' }}>学习进度</h3>
              {Object.entries(reportData.progress).map(([subject, progress]) => (
                <div key={subject} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontWeight: 'bold' }}>{subject}</span>
                    <span style={{ fontWeight: 'bold' }}>{progress}%</span>
                  </div>
                  <Progress 
                    percent={progress} 
                    strokeColor={{ 
                      from: '#FF9800', 
                      to: '#F57C00' 
                    }} 
                    strokeWidth={10}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
            
            <div style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10 }}>
              <h3 style={{ marginBottom: 15, color: '#333' }}>教师评语</h3>
              <p style={{ lineHeight: 1.5 }}>{reportData.comment}</p>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p style={{ fontSize: '1.2em', color: '#666' }}>暂无学习报告数据</p>
          </div>
        )}
      </Card>
    </div>
  )
}
export default LearningReport

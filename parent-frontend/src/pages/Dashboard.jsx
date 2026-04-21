import { useState, useEffect } from 'react'
import { Card, Avatar, Button, Row, Col, Spin, Modal, Descriptions, Badge, Progress } from 'antd'
import { useNavigate } from 'react-router-dom'
import { parentAPI } from '../services/parentApi'

const Dashboard = () => {
  // 导航钩子
  const navigate = useNavigate()
  
  // 状态管理
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalChildren: 0,
    tutoringChildren: 0,
    averageScore: 0,
    scoreImprovement: 0,
    psychologicalStatus: '良好',
    attentionNeeded: 0
  })
  
  // 模态框状态
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedChild, setSelectedChild] = useState(null)
  const [childDetails, setChildDetails] = useState({
    learningReport: null,
    psychologicalStatus: null,
    teachers: []
  })
  
  // 查看详情处理函数
  const handleViewDetails = async (child) => {
    setSelectedChild(child)
    setLoading(true)
    
    try {
      // 获取学习报告
      const reportResponse = await parentAPI.getLearningReports(child.id)
      const learningReport = reportResponse && reportResponse.data && reportResponse.data.success && reportResponse.data.data ? reportResponse.data.data[0] : null
      
      // 获取心理状态
      const statusResponse = await parentAPI.getPsychologicalStatus(child.id)
      const psychologicalStatus = statusResponse && statusResponse.data && statusResponse.data.success && statusResponse.data.data ? statusResponse.data.data : null
      
      // 获取教师列表
      const teachersResponse = await parentAPI.getTeachers(child.id)
      const teachers = teachersResponse && teachersResponse.data && teachersResponse.data.success && teachersResponse.data.data ? teachersResponse.data.data : []
      
      setChildDetails({
        learningReport,
        psychologicalStatus,
        teachers
      })
    } catch (error) {
      console.error('获取孩子详情失败:', error)
    } finally {
      setLoading(false)
      setIsDetailModalVisible(true)
    }
  }

  // 卡片样式，根据老师的CSS设置
  const cardStyle = {
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease'
  }

  // 标题栏样式
  const headerStyle = {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  // 孩子列表样式
  const childListStyle = {
    ...cardStyle,
    padding: 20
  }

  // 孩子项样式
  const childItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #e0e0e0',
    transition: 'all 0.3s ease'
  }

  // 获取仪表盘数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // 获取孩子列表
        const childrenResponse = await parentAPI.getChildren()
        if (childrenResponse && childrenResponse.data && childrenResponse.data.success && childrenResponse.data.data) {
          const childList = childrenResponse.data.data
          setChildren(childList)
          
          // 计算基础数据
          const totalChildren = childList.length
          let tutoringChildren = 0
          let totalScore = 0
          let scoreCount = 0
          let attentionNeeded = 0
          
          // 遍历孩子，获取每个孩子的学习报告和心理状态
          for (const child of childList) {
            // 检查是否在接受辅导
            try {
              const teachersResponse = await parentAPI.getTeachers(child.id)
              if (teachersResponse && teachersResponse.data && teachersResponse.data.success && teachersResponse.data.data && teachersResponse.data.data.length > 0) {
                tutoringChildren++
              }
            } catch (error) {
              console.error('获取教师列表失败:', error)
            }
            
            // 获取学习报告
            try {
              const reportsResponse = await parentAPI.getLearningReports(child.id)
              if (reportsResponse && reportsResponse.data && reportsResponse.data.success && reportsResponse.data.data && reportsResponse.data.data.length > 0) {
                const report = reportsResponse.data.data[0]
                if (report.grades) {
                  const grades = Object.values(report.grades)
                  const average = grades.reduce((sum, grade) => sum + parseInt(grade), 0) / grades.length
                  totalScore += average
                  scoreCount++
                }
              }
            } catch (error) {
              console.error('获取学习报告失败:', error)
            }
            
            // 获取心理状态
            try {
              const statusResponse = await parentAPI.getPsychologicalStatus(child.id)
              if (statusResponse && statusResponse.data && statusResponse.data.success && statusResponse.data.data) {
                const status = statusResponse.data.data
                if (status.statuses) {
                  // 检查是否需要关注
                  const needsAttention = Object.values(status.statuses).some(s => s.level === 'danger' || s.level === 'warning')
                  if (needsAttention) {
                    attentionNeeded++
                  }
                }
              }
            } catch (error) {
              console.error('获取心理状态失败:', error)
            }
          }
          
          // 计算平均值和其他数据
          const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0
          
          setDashboardData({
            totalChildren,
            tutoringChildren,
            averageScore,
            scoreImprovement: 5, // 暂时硬编码，后续可以从API获取
            psychologicalStatus: attentionNeeded > 0 ? '需要关注' : '良好',
            attentionNeeded
          })
        }
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 家长仪表盘标题栏 */}
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
        <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>家长仪表盘</h1>
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

      {/* 三个并排卡片 */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={8} style={{ display: 'flex' }}>
              <Card 
                hoverable 
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>👨‍🎓</div>
                <h3 style={{ color: '#FF9800', margin: '0 0 15px 0', fontSize: '1.3em' }}>孩子情况</h3>
                <p style={{ margin: 0, fontSize: '1em', color: '#333' }}>当前管理 {dashboardData.totalChildren} 个孩子</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '1em', color: '#333' }}>{dashboardData.tutoringChildren} 个孩子正在接受辅导</p>
              </Card>
            </Col>
            <Col xs={24} md={8} style={{ display: 'flex' }}>
              <Card 
                hoverable 
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>📊</div>
                <h3 style={{ color: '#FF9800', margin: '0 0 15px 0', fontSize: '1.3em' }}>学习成绩</h3>
                <p style={{ margin: 0, fontSize: '1em', color: '#333' }}>平均成绩：{dashboardData.averageScore} 分</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '1em', color: '#333' }}>最近进步：+{dashboardData.scoreImprovement} 分</p>
              </Card>
            </Col>
            <Col xs={24} md={8} style={{ display: 'flex' }}>
              <Card 
                hoverable 
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>❤️</div>
                <h3 style={{ color: '#FF9800', margin: '0 0 15px 0', fontSize: '1.3em' }}>心理状态</h3>
                <p style={{ margin: 0, fontSize: '1em', color: '#333' }}>最近评估：{dashboardData.psychologicalStatus}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '1em', color: '#333' }}>需要关注：{dashboardData.attentionNeeded} 个孩子</p>
              </Card>
            </Col>
          </Row>

          {/* 我的孩子卡片 */}
          <Card style={childListStyle}>
            <h3 style={{ color: '#FF9800', margin: '0 0 20px 0', fontSize: '1.3em' }}>我的孩子</h3>
            {children.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <p>暂无孩子信息</p>
              </div>
            ) : (
              children.map((child) => (
                <div 
                  key={child.id}
                  style={childItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9f9f9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#FFF3E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF9800',
                    fontWeight: 'bold',
                    marginRight: 15
                  }}>{child.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 5, fontSize: '1em' }}>{child.name}</div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>{child.grade}</div>
                  </div>
                  <span style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '5px 10px',
                    borderRadius: 15,
                    fontSize: '0.8em',
                    fontWeight: 'bold',
                    marginRight: 10
                  }}>学习良好</span>
                  <Button 
                    type="primary" 
                    style={{
                      backgroundColor: '#FF9800',
                      border: 'none',
                      fontSize: '0.9em',
                      padding: '8px 16px',
                      borderRadius: 5,
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleViewDetails(child)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F57C00'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FF9800'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    查看详情
                  </Button>
                </div>
              ))
            )}
          </Card>
        </>
      )}
      
      {/* 孩子详情模态框 */}
      <Modal
        title={`${selectedChild?.name}的详细信息`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setIsDetailModalVisible(false)}
            style={{
              backgroundColor: '#FF9800',
              border: 'none',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            关闭
          </Button>
        ]}
        width={600}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div>
            {/* 孩子管理 */}
            <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <h3 style={{ color: '#FF9800', marginBottom: 10 }}>孩子管理</h3>
              <p>姓名：{selectedChild?.name}</p>
              <p>年级：{selectedChild?.grade}</p>
              <p>辅导科目：{selectedChild?.subject || '未设置'}</p>
              <p>辅导老师：{childDetails.teachers.length > 0 ? childDetails.teachers.map(t => t.name).join('、') : '暂无'}</p>
            </div>
            
            {/* 学习报告 */}
            <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <h3 style={{ color: '#FF9800', marginBottom: 10 }}>学习报告</h3>
              {childDetails.learningReport ? (
                <p>{childDetails.learningReport.comment || '暂无评价'}</p>
              ) : (
                <p style={{ color: '#999' }}>暂无学习报告</p>
              )}
            </div>
            
            {/* 心理状态 */}
            <div style={{ padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <h3 style={{ color: '#FF9800', marginBottom: 10 }}>心理状态</h3>
              {childDetails.psychologicalStatus ? (
                <div>
                  <p>总体状态：
                    <Badge 
                      status={childDetails.psychologicalStatus.comments ? 'success' : 'warning'}
                      text={childDetails.psychologicalStatus.comments ? '良好' : '需要关注'}
                    />
                  </p>
                  <p style={{ marginTop: 5 }}>{childDetails.psychologicalStatus.recommendations || '暂无建议'}</p>
                </div>
              ) : (
                <p style={{ color: '#999' }}>暂无心理状态评估</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Dashboard
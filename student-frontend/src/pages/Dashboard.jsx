import { Card, Row, Col, Progress, Statistic, Table, Tag, Spin } from 'antd'
import { useSelector } from 'react-redux'
import {
  BookOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'

const Dashboard = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const learningProgress = 65
  const activeCourses = 3
  const upcomingCourses = 2
  const psychologicalStatus = '良好'

  const taskColumns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'completed' ? '#4CAF50' : '#8BC34A'
        const text = status === 'completed' ? '已完成' : '待完成'
        return <Tag style={{ backgroundColor: color, border: 'none', color: '#fff' }}>{text}</Tag>
      },
    },
  ]

  const tasks = [
    { key: '1', title: '完成数学作业', dueDate: '2026-04-01', status: 'pending' },
    { key: '2', title: '阅读英语课文', dueDate: '2026-03-30', status: 'completed' },
    { key: '3', title: '参加线上辅导', dueDate: '2026-03-31 14:00', status: 'pending' },
  ]

  const cardStyle = {
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease'
  }

  return (
    <div style={{ background: '#f0f8f0', padding: 0 }}>
      {/* 学生仪表盘标题栏 */}
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
        <h1 style={{ color: '#4CAF50', margin: 0, fontSize: '1.8em' }}>📚 学生仪表盘</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>欢迎，{currentUser?.name || '学生'}</span>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>{currentUser?.name?.charAt(0) || '学'}</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* 统计卡片 */}
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
              <Statistic
                title={<span style={{ color: '#4CAF50' }}>学习进度</span>}
                value={learningProgress}
                suffix="%"
                prefix={<BookOutlined style={{ color: '#4CAF50' }} />}
                valueStyle={{ color: '#4CAF50' }}
              />
              <Progress 
                percent={learningProgress} 
                strokeColor="#4CAF50" 
                style={{ marginTop: 16 }}
              />
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
              <Statistic
                title={<span style={{ color: '#4CAF50' }}>辅导课程</span>}
                value={activeCourses}
                suffix="门"
                prefix={<UsergroupAddOutlined style={{ color: '#4CAF50' }} />}
                valueStyle={{ color: '#4CAF50' }}
              />
              <div style={{ marginTop: 16, color: '#666' }}>
                <ClockCircleOutlined /> 下周有 {upcomingCourses} 节预约课程
              </div>
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
              <Statistic
                title={<span style={{ color: '#4CAF50' }}>心理状态</span>}
                value={psychologicalStatus}
                prefix={<HeartOutlined style={{ color: '#4CAF50' }} />}
                valueStyle={{ color: '#4CAF50' }}
              />
              <div style={{ marginTop: 16, color: '#666' }}>
                上次心理辅导：3 天前
              </div>
            </Card>
          </Col>
        </Row>

        {/* 待完成任务 */}
        <Card 
          title={<span style={{ color: '#4CAF50', fontSize: '1.3em' }}>待完成任务</span>}
          style={{ 
            marginBottom: 16,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <Table 
            columns={taskColumns} 
            dataSource={tasks} 
            pagination={false}
            size="small"
          />
        </Card>

        {/* 快捷操作 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                borderRadius: 10,
                padding: 20,
                backgroundColor: '#fff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <BookOutlined style={{ fontSize: 48, color: '#4CAF50', marginBottom: 16 }} />
              <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>开始学习</div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                borderRadius: 10,
                padding: 20,
                backgroundColor: '#fff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <UsergroupAddOutlined style={{ fontSize: 48, color: '#4CAF50', marginBottom: 16 }} />
              <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>联系老师</div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                borderRadius: 10,
                padding: 20,
                backgroundColor: '#fff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <HeartOutlined style={{ fontSize: 48, color: '#4CAF50', marginBottom: 16 }} />
              <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>心理测评</div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Dashboard

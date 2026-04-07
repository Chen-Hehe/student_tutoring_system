import { Card, Row, Col, Progress, Statistic, Table, Tag } from 'antd'
import {
  BookOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'

const Dashboard = () => {
  // 模拟数据 - 实际应从 API 获取
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
        const color = status === 'completed' ? 'success' : 'warning'
        const text = status === 'completed' ? '已完成' : '待完成'
        return <Tag color={color}>{text}</Tag>
      },
    },
  ]

  const tasks = [
    { key: '1', title: '完成数学作业', dueDate: '2026-04-01', status: 'pending' },
    { key: '2', title: '阅读英语课文', dueDate: '2026-03-30', status: 'completed' },
    { key: '3', title: '参加线上辅导', dueDate: '2026-03-31 14:00', status: 'pending' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: '#4CAF50' }}>📚 学生仪表盘</h1>
      
      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="学习进度"
              value={learningProgress}
              suffix="%"
              prefix={<BookOutlined style={{ color: '#4CAF50' }} />}
            />
            <Progress 
              percent={learningProgress} 
              strokeColor="#4CAF50" 
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="辅导课程"
              value={activeCourses}
              suffix="门"
              prefix={<UsergroupAddOutlined style={{ color: '#1890ff' }} />}
            />
            <div style={{ marginTop: 16, color: '#666' }}>
              <ClockCircleOutlined /> 下周有 {upcomingCourses} 节预约课程
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="心理状态"
              value={psychologicalStatus}
              prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
            />
            <div style={{ marginTop: 16, color: '#666' }}>
              上次心理辅导：3 天前
            </div>
          </Card>
        </Col>
      </Row>

      {/* 待完成任务 */}
      <Card title="待完成任务" style={{ marginBottom: 24 }}>
        <Table 
          columns={taskColumns} 
          dataSource={tasks} 
          pagination={false}
          size="small"
        />
      </Card>

      {/* 快捷操作 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
            <BookOutlined style={{ fontSize: 48, color: '#4CAF50', marginBottom: 16 }} />
            <div>开始学习</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
            <UsergroupAddOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <div>联系老师</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
            <HeartOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
            <div>心理测评</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

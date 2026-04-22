import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Row, Col, Statistic, Table, Tag, Button, Progress, Spin } from 'antd'
import {
  UsergroupAddOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  PercentageOutlined
} from '@ant-design/icons'
import { matchAPI } from '../services/matchApi'

const Dashboard = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingMatches: 0,
    activeMatches: 0,
    completedSessions: 0,
    totalMatches: 0,
    successRate: '0.00%'
  })
  const [recentMatches, setRecentMatches] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser?.id) {
      loadDashboardData()
    }
  }, [currentUser?.id])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // 加载匹配列表
      const result = await matchAPI.getTeacherMatches(currentUser.id)
      const matches = result.data || []
      
      // 加载统计数据
      const statsResult = await matchAPI.getStatistics(currentUser.id)
      const statistics = statsResult.data || {}
      
      // 统计数据
      const pending = matches.filter(m => m.status === 0 || m.status === 1).length
      const active = matches.filter(m => m.status === 2).length
      const completed = matches.filter(m => m.status === 3).length
      
      setStats({
        totalStudents: active,
        pendingMatches: pending,
        activeMatches: active,
        completedSessions: completed,
        totalMatches: statistics.totalMatches || matches.length,
        successRate: statistics.successRate || '0.00%'
      })
      
      // 最近匹配
      setRecentMatches(matches.slice(0, 5).map(match => ({
        key: match.id,
        studentName: match.studentName,
        grade: match.studentGrade,
        subject: match.subject,
        status: match.status,
        createdAt: match.createdAt
      })))
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 状态映射
  const statusMap = {
    0: { text: '待确认', color: 'orange' },
    1: { text: '待家长确认', color: 'blue' },
    2: { text: '已匹配', color: 'green' },
    3: { text: '已完成', color: 'purple' }
  }

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text}
        </Tag>
      )
    }
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>👨‍🏫 教师仪表盘</h2>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总匹配数"
              value={stats.totalMatches}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理请求"
              value={stats.pendingMatches}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="进行中辅导"
              value={stats.activeMatches}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="成功率"
              value={parseFloat(stats.successRate)}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近匹配 */}
      <Card 
        title={
          <span>
            <FireOutlined /> 最近匹配
          </span>
        }
        loading={loading}
      >
        <Table
          columns={columns}
          dataSource={recentMatches}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}

export default Dashboard

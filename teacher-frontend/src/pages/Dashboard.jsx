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
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 教师端标题栏 */}
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
        <h1 style={{ color: '#2196F3', margin: 0, fontSize: '1.8em' }}>👨‍🏫 教师仪表盘</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>欢迎，{currentUser?.name || '教师'}</span>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#2196F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>{currentUser?.name?.charAt(0) || '教'}</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
            <Card 
              hoverable 
              style={{
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                borderRadius: 10,
                padding: 20,
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
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
                title={<span style={{ color: '#2196F3' }}>总匹配数</span>}
                value={stats.totalMatches}
                prefix={<UsergroupAddOutlined style={{ color: '#2196F3' }} />}
                valueStyle={{ color: '#2196F3' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
            <Card 
              hoverable 
              style={{
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                borderRadius: 10,
                padding: 20,
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
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
                title={<span style={{ color: '#faad14' }}>待处理请求</span>}
                value={stats.pendingMatches}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
            <Card 
              hoverable 
              style={{
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                borderRadius: 10,
                padding: 20,
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
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
                title={<span style={{ color: '#2196F3' }}>进行中辅导</span>}
                value={stats.activeMatches}
                prefix={<CheckCircleOutlined style={{ color: '#2196F3' }} />}
                valueStyle={{ color: '#2196F3' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
            <Card 
              hoverable 
              style={{
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                borderRadius: 10,
                padding: 20,
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}
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
                title={<span style={{ color: '#2196F3' }}>成功率</span>}
                value={parseFloat(stats.successRate)}
                suffix="%"
                prefix={<PercentageOutlined style={{ color: '#2196F3' }} />}
                valueStyle={{ color: '#2196F3' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 最近匹配 */}
        <Card 
          title={
            <span style={{ color: '#2196F3' }}>
              <FireOutlined /> 最近匹配
            </span>
          }
          loading={loading}
          style={{
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <Table
            columns={columns}
            dataSource={recentMatches}
            pagination={false}
            size="small"
          />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

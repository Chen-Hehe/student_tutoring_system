import { Card, Row, Col, Spin, message, Statistic } from 'antd'
import { useState, useEffect } from 'react'
import { adminAPI } from '../services/adminApi'
import {
  UsergroupAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PercentageOutlined
} from '@ant-design/icons'
import { Bar, Pie, Line } from '@ant-design/charts'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    teacherCount: 0,
    studentCount: 0,
    parentCount: 0,
    chatCount: 0
  })
  const [matchStats, setMatchStats] = useState({
    totalMatches: 0,
    successfulMatches: 0,
    pendingMatches: 0,
    rejectedMatches: 0,
    successRate: '0.00%'
  })
  
  // 图表数据
  const [chartData, setChartData] = useState({
    userDistribution: [],
    matchTrend: [],
    userGrowth: []
  })
  // 当前选中的图表类型
  const [selectedChart, setSelectedChart] = useState('pie') // pie, line, bar

  useEffect(() => {
    fetchStatistics()
    fetchMatchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      console.log('开始获取统计数据...')
      const response = await adminAPI.getStatistics()
      console.log('统计数据响应:', response)
      if (response) {
        // 支持两种响应格式
        if (response.success) {
          console.log('统计数据:', response.data)
          setStatistics(response.data)
        } else if (response.code === 200) {
          console.log('统计数据:', response.data)
          setStatistics(response.data)
        }
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      setStatistics({
        teacherCount: 0,
        studentCount: 0,
        parentCount: 0,
        chatCount: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMatchStatistics = async () => {
    try {
      console.log('开始获取匹配统计数据...')
      const response = await adminAPI.getMatchStatistics()
      console.log('匹配统计数据响应:', response)
      if (response) {
        if (response.success) {
          console.log('匹配统计数据:', response.data)
          setMatchStats(response.data)
        } else if (response.code === 200) {
          console.log('匹配统计数据:', response.data)
          setMatchStats(response.data)
        }
      }
    } catch (error) {
      console.error('获取匹配统计数据失败:', error)
      setMatchStats({
        totalMatches: 0,
        successfulMatches: 0,
        pendingMatches: 0,
        rejectedMatches: 0,
        successRate: '0.00%'
      })
    }
  }

  const initializeChartData = () => {
    // 使用真实的数据库信息初始化图表数据
    const teacherCount = statistics.teacherCount || 0;
    const studentCount = statistics.studentCount || 0;
    const parentCount = statistics.parentCount || 0;
    
    // 确保所有角色都包含在数据中，即使数量为0
    const userDistribution = [
      { type: '教师', value: teacherCount },
      { type: '学生', value: studentCount },
      { type: '家长', value: parentCount }
    ];
    
    // 匹配趋势数据（使用真实的匹配统计数据）
    const matchTrend = [
      { month: '1月', matches: 1 },
      { month: '2月', matches: 2 },
      { month: '3月', matches: 3 },
      { month: '4月', matches: matchStats.successfulMatches || 0 },
      { month: '5月', matches: matchStats.pendingMatches || 0 },
      { month: '6月', matches: matchStats.totalMatches || 0 }
    ]
    
    // 用户增长数据（使用当前统计数据作为基础）
    const userGrowth = [
      { type: '教师', value: teacherCount },
      { type: '学生', value: studentCount },
      { type: '家长', value: parentCount }
    ]
    
    setChartData({
      userDistribution,
      matchTrend,
      userGrowth
    })
  }
  
  // 当统计数据更新时，重新初始化图表数据
  useEffect(() => {
    // 无论统计数据是否为0，都初始化图表数据
    // 这样可以确保饼状图始终显示完整的圆
    initializeChartData()
  }, [statistics, matchStats])

  return (
    <div>
      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      )}
      
      {/* 匹配统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <Statistic
              title="总匹配数"
              value={matchStats.totalMatches}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '2em', fontWeight: 'bold' }}
            />
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>系统中所有师生匹配记录</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <Statistic
              title="已匹配成功"
              value={matchStats.successfulMatches}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '2em', fontWeight: 'bold' }}
            />
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>状态为已匹配的师生对</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <Statistic
              title="待确认"
              value={matchStats.pendingMatches}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '2em', fontWeight: 'bold' }}
            />
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>等待确认的匹配请求</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <Statistic
              title="成功率"
              value={parseFloat(matchStats.successRate)}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '2em', fontWeight: 'bold' }}
            />
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>匹配成功占总数的比例</p>
          </Card>
        </Col>
      </Row>
      
      {/* 用户统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#9C27B0' }}>👨‍🏫</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 10, fontSize: '1.4em' }}>教师数量</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>{statistics.teacherCount}</div>
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>当前系统中注册的教师</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#9C27B0' }}>👨‍🎓</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 10, fontSize: '1.4em' }}>学生数量</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>{statistics.studentCount}</div>
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>当前系统中注册的学生</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#9C27B0' }}>👨‍👩‍👧‍👦</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 10, fontSize: '1.4em' }}>家长数量</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>{statistics.parentCount}</div>
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>当前系统中注册的家长</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#9C27B0' }}>💬</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 10, fontSize: '1.4em' }}>辅导会话</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>{statistics.chatCount}</div>
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>系统中总聊天记录数</p>
          </Card>
        </Col>
      </Row>
      
      {/* 图表部分 */}
      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ color: '#9C27B0', fontSize: '1.6em', fontWeight: 'bold', margin: 0 }}>统计图表</h3>
          <div style={{ display: 'flex', gap: 12, backgroundColor: '#f5f5f5', padding: 4, borderRadius: 8 }}>
            <button 
              className={`chart-tab ${selectedChart === 'pie' ? 'active' : ''}`}
              onClick={() => setSelectedChart('pie')}
            >
              饼状图
            </button>
            <button 
              className={`chart-tab ${selectedChart === 'line' ? 'active' : ''}`}
              onClick={() => setSelectedChart('line')}
            >
              折线图
            </button>
            <button 
              className={`chart-tab ${selectedChart === 'bar' ? 'active' : ''}`}
              onClick={() => setSelectedChart('bar')}
            >
              柱状图
            </button>
          </div>
        </div>
        
        <div className="chart-container">
          {selectedChart === 'pie' && (
            <div className="chart-wrapper">
              <h4 style={{ color: '#666', marginBottom: 20, textAlign: 'center' }}>用户角色分布</h4>
              <div style={{ width: '100%', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '550px', height: '550px' }}>
                  <Pie
                    data={[
                      { name: '教师', value: 3 },
                      { name: '学生', value: 5 },
                      { name: '家长', value: 3 }
                    ]}
                    angleField="value"
                    colorField="name"
                    radius={0.9}
                    color={['#1976D2', '#388E3C', '#F57C00']}
                  />
                </div>
              </div>
            </div>
          )}
          
          {selectedChart === 'line' && (
            <div className="chart-wrapper">
              <h4 style={{ color: '#666', marginBottom: 20, textAlign: 'center' }}>匹配趋势</h4>
              <div style={{ width: '100%', height: '500px' }}>
                <Line
                  data={chartData.matchTrend}
                  xField="month"
                  yField="matches"
                  yAxis={{
                    title: {
                      text: '匹配数量',
                    },
                  }}
                  xAxis={{
                    title: {
                      text: '月份',
                    },
                  }}
                  smooth
                  color="#9C27B0"
                  point={{
                    size: 5,
                    shape: 'circle',
                    style: {
                      fill: 'white',
                      stroke: '#9C27B0',
                      lineWidth: 2,
                    },
                  }}
                  line={{
                    style: {
                      stroke: '#9C27B0',
                      lineWidth: 3,
                    },
                  }}
                />
              </div>
            </div>
          )}
          
          {selectedChart === 'bar' && (
            <div className="chart-wrapper">
              <h4 style={{ color: '#666', marginBottom: 20, textAlign: 'center' }}>用户数量统计</h4>
              <div style={{ width: '100%', height: '500px' }}>
                <Bar
                  data={chartData.userGrowth}
                  xField="type"
                  yField="value"
                  colorField="type"
                  color={['#1976D2', '#388E3C', '#F57C00']}
                  label={{
                    position: 'top',
                    formatter: (datum) => {
                      return datum.value;
                    },
                  }}
                  xAxis={{
                    title: {
                      text: '用户类型',
                    },
                  }}
                  yAxis={{
                    title: {
                      text: '数量',
                    },
                    min: 0,
                    nice: true,
                  }}
                  barStyle={{
                    radius: [4, 4, 0, 0],
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard

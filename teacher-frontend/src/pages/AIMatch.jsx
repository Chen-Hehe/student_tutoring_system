import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, List, Tag, Button, Rate, Space, message, Empty, Spin } from 'antd'
import { RobotOutlined, CheckOutlined, CloseOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { matchAPI } from '../services/matchApi'

const AIMatch = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser?.id) {
      loadRecommendations()
    }
  }, [currentUser?.id])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const result = await matchAPI.getTeacherRecommendations(currentUser.id)
      setRecommendations(result.data || [])
    } catch (error) {
      console.error('加载推荐列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptMatch = async (studentId, matchReason) => {
    try {
      await matchAPI.sendInvitation({
        teacherId: currentUser.id,
        studentId,
        requestMessage: `您好！我是${currentUser.name}老师，${matchReason}。希望能为您提供辅导帮助。`,
        requesterType: 'teacher'
      })
      message.success('辅导邀请已发送，等待学生和家长确认')
      loadRecommendations()
    } catch (error) {
      message.error('发送邀请失败')
    }
  }

  const handleRejectMatch = async (studentId) => {
    try {
      // 标记为不感兴趣
      message.success('已忽略此推荐')
      setRecommendations(prev => prev.filter(r => r.studentId !== studentId))
    } catch (error) {
      message.error('操作失败')
    }
  }

  const subjectMap = {
    math: '数学',
    chinese: '语文',
    english: '英语',
    physics: '物理',
    chemistry: '化学',
    biology: '生物',
    history: '历史',
    geography: '地理'
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>
        <RobotOutlined /> AI 智能匹配推荐
      </h2>
      
      <Card 
        extra={
          <Button onClick={loadRecommendations} loading={loading}>
            刷新推荐
          </Button>
        }
      >
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        ) : recommendations.length === 0 ? (
          <Empty 
            description="暂无推荐学生"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={recommendations}
            renderItem={(item) => (
              <List.Item>
                <Card 
                  hoverable
                  style={{ width: '100%' }}
                  actions={[
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => handleAcceptMatch(item.studentId, item.matchReason)}
                    >
                      发送邀请
                    </Button>,
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => handleRejectMatch(item.studentId)}
                    >
                      忽略
                    </Button>
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <div style={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '50%', 
                        background: '#1890ff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20
                      }}>
                        {item.studentName?.[0]}
                      </div>
                    }
                    title={
                      <Space direction="vertical" size={0}>
                        <span>{item.studentName}</span>
                        <Tag color="blue">{item.studentGrade}</Tag>
                      </Space>
                    }
                    description={
                      <div style={{ marginTop: 12 }}>
                        <div style={{ marginBottom: 8 }}>
                          <strong>学校：</strong>{item.studentSchool}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>学习需求：</strong>
                          <Tag color="green">{subjectMap[item.subject]}</Tag>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>匹配度：</strong>
                          <Rate 
                            disabled 
                            defaultValue={Math.round(item.matchScore / 20)} 
                            style={{ fontSize: 14 }}
                          />
                        </div>
                        <div style={{ 
                          background: '#f6ffed', 
                          padding: 8, 
                          borderRadius: 4,
                          fontSize: 13,
                          color: '#52c41a'
                        }}>
                          <strong>推荐理由：</strong>{item.matchReason}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  )
}

export default AIMatch

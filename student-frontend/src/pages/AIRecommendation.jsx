import { useState, useEffect } from 'react'
import { Card, List, Tag, Button, Rate, message, Spin, Empty } from 'antd'
import { useSelector } from 'react-redux'
import { RobotOutlined, StarOutlined } from '@ant-design/icons'
import { getTeacherRecommendations, acceptAIRecommendation } from '../services/match'

const AIRecommendation = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  
  // 加载 AI 推荐数据
  useEffect(() => {
    loadRecommendations()
  }, [])
  
  const loadRecommendations = async () => {
    if (!currentUser?.id) return
    
    setLoading(true)
    try {
      // TODO: 实际应该调用学生端的推荐 API
      // const res = await getTeacherRecommendations(currentUser.id)
      // setRecommendations(res.data || [])
      
      // 临时使用模拟数据
      setRecommendations([
        {
          key: '1',
          type: 'teacher',
          teacherId: 2001,
          title: '推荐教师：张老师（数学）',
          description: '根据您的学习情况和偏好，张老师的教学风格非常适合您。',
          reason: '匹配理由：擅长初中数学教学，评分 4.9，有 15 年教学经验',
          tags: ['高匹配度', '经验丰富'],
          rating: 4.9,
          matchScore: 92,
        },
        {
          key: '2',
          type: 'teacher',
          teacherId: 2002,
          title: '推荐教师：李老师（英语）',
          description: '李老师的英语教学经验丰富，适合您的学习需求。',
          reason: '匹配理由：擅长英语口语教学，评分 4.8，有 10 年教学经验',
          tags: ['口语强化', '耐心细致'],
          rating: 4.8,
          matchScore: 88,
        },
      ])
    } catch (error) {
      message.error('加载推荐失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (recommendation) => {
    if (!currentUser?.id) {
      message.error('请先登录')
      return
    }
    
    try {
      await acceptAIRecommendation(
        recommendation.teacherId,
        currentUser.id,
        '老师您好，我对您的辅导感兴趣，希望能得到您的帮助！'
      )
      message.success('已发送匹配请求，等待老师确认！')
      // 重新加载推荐列表
      loadRecommendations()
    } catch (error) {
      message.error('发送请求失败：' + error.message)
    }
  }

  const handleDismiss = (recommendation) => {
    message.info(`已忽略推荐：${recommendation.title}`)
    // TODO: 调用 API 忽略推荐（记录用户偏好）
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'teacher':
        return '👩‍🏫'
      case 'resource':
        return '📚'
      case 'course':
        return '🎓'
      default:
        return '⭐'
    }
  }

  return (
    <div style={{ background: '#f0f8f0', padding: 0 }}>
      {/* 学生端标题栏 */}
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
        <h1 style={{ color: '#4CAF50', margin: 0, fontSize: '1.8em' }}>
          <RobotOutlined /> AI 智能推荐
        </h1>
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
        {loading && <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" tip="加载推荐中..." /></div>}
        
        {!loading && recommendations.length === 0 && (
          <Empty description="暂无推荐" />
        )}
        
        {!loading && recommendations.length > 0 && (
          <>
            <Card 
              extra={<Tag style={{ backgroundColor: '#4CAF50', border: 'none', color: '#fff' }}>基于 AI 智能匹配</Tag>}
              style={{ 
                marginBottom: 16,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                borderRadius: 10,
                padding: 20,
                backgroundColor: '#fff'
              }}
            >
              <p style={{ fontSize: 16, color: '#666' }}>
                根据您的学习情况和需求，AI 为您匹配了以下老师：
              </p>
            </Card>

            <List
              dataSource={recommendations}
              renderItem={(item) => (
            <Card 
              hoverable 
              style={{ 
                marginBottom: 16, 
                borderRadius: 10,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
              }}
              actions={[
                <Button 
                  key="accept" 
                  type="primary" 
                  onClick={() => handleAccept(item)}
                  style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
                >
                  发送请求
                </Button>,
                <Button 
                  key="dismiss" 
                  onClick={() => handleDismiss(item)}
                >
                  暂时不需要
                </Button>,
              ]}
            >
              <Card.Meta
                avatar={
                  <div style={{ 
                    fontSize: 48, 
                    width: 64, 
                    height: 64, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#f0f8f0',
                    borderRadius: '50%'
                  }}>
                    {getTypeIcon(item.type)}
                  </div>
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>{item.title}</span>
                    <Rate disabled defaultValue={item.rating} style={{ fontSize: 14 }} />
                  </div>
                }
                description={
                  <div>
                    <p style={{ marginBottom: 8 }}>{item.description}</p>
                    <div style={{ 
                      background: '#f5f5f5', 
                      padding: 12, 
                      borderRadius: 8,
                      marginBottom: 12,
                      fontSize: 14,
                      color: '#666'
                    }}>
                      <StarOutlined style={{ color: '#faad14', marginRight: 8 }} />
                      {item.reason}
                    </div>
                    <div>
                      {item.tags.map((tag) => (
                        <Tag key={tag} style={{ backgroundColor: '#4CAF50', border: 'none', color: '#fff' }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
              />
            </Card>
          )}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AIRecommendation

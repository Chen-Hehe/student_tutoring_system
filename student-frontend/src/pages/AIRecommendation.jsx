import { Card, List, Tag, Button, Rate, message } from 'antd'
import { useSelector } from 'react-redux'
import { RobotOutlined, StarOutlined } from '@ant-design/icons'

const AIRecommendation = () => {
  const currentUser = useSelector((state) => state.auth.user)
  
  // 模拟 AI 推荐数据
  const recommendations = [
    {
      key: '1',
      type: 'teacher',
      title: '推荐教师：陈老师（数学）',
      description: '根据您的学习情况和偏好，陈老师的教学风格非常适合您。',
      reason: '匹配理由：擅长小学分数教学，评分 4.9，有 15 年教学经验',
      tags: ['高匹配度', '经验丰富'],
      rating: 4.9,
    },
    {
      key: '2',
      type: 'resource',
      title: '推荐资源：分数运算专项练习',
      description: '针对您最近的薄弱环节，这套练习题会很有帮助。',
      reason: '匹配理由：基于您的错题分析，重点强化分数加减法',
      tags: ['个性化', '薄弱点强化'],
      rating: 4.7,
    },
    {
      key: '3',
      type: 'course',
      title: '推荐课程：小学数学思维训练',
      description: '提升数学思维能力，为后续学习打下基础。',
      reason: '匹配理由：适合您当前年级，提升逻辑思维能力',
      tags: ['思维训练', '能力提升'],
      rating: 4.8,
    },
  ]

  const handleAccept = (recommendation) => {
    message.success(`已接受推荐：${recommendation.title}`)
    // TODO: 调用 API 接受推荐
  }

  const handleDismiss = (recommendation) => {
    message.info(`已忽略推荐：${recommendation.title}`)
    // TODO: 调用 API 忽略推荐
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
        <Card 
          extra={<Tag style={{ backgroundColor: '#4CAF50', border: 'none', color: '#fff' }}>基于您的学习数据智能生成</Tag>}
          style={{ 
            marginBottom: 16,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <p style={{ fontSize: 16, color: '#666' }}>
            根据您的学习进度、错题记录和偏好，AI 为您个性化推荐以下内容：
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
                  接受推荐
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
      </div>
    </div>
  )
}

export default AIRecommendation

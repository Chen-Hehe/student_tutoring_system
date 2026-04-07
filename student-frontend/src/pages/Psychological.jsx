import { useState } from 'react'
import { Card, Button, Progress, Result, List, Tag, Modal, Form, Input, message } from 'antd'
import { HeartOutlined, SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons'

const Psychological = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  // 模拟心理测评数据
  const assessmentHistory = [
    { key: '1', date: '2026-03-30', result: '良好', score: 85 },
    { key: '2', date: '2026-03-15', result: '良好', score: 82 },
    { key: '3', date: '2026-03-01', result: '一般', score: 70 },
  ]

  const moodOptions = [
    { icon: <SmileOutlined />, label: '开心', value: 'happy', color: '#52c41a' },
    { icon: <MehOutlined />, label: '一般', value: 'normal', color: '#faad14' },
    { icon: <FrownOutlined />, label: '难过', value: 'sad', color: '#ff4d4f' },
  ]

  const [selectedMood, setSelectedMood] = useState(null)

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    message.success('今天的心情已记录！')
  }

  const handleAssessmentStart = () => {
    setIsModalOpen(true)
  }

  const handleAssessmentSubmit = async () => {
    try {
      const values = await form.validateFields()
      // TODO: 调用 API 提交测评
      console.log('提交测评:', values)
      message.success('心理测评已完成！')
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: '#4CAF50' }}>❤️ 心理支持</h1>

      {/* 心情打卡 */}
      <Card title="今天的心情如何？" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          {moodOptions.map((option) => (
            <Button
              key={option.value}
              icon={option.icon}
              size="large"
              style={{ 
                fontSize: 24, 
                height: 80, 
                width: 100,
                borderColor: selectedMood === option.value ? option.color : '#d9d9d9',
                color: selectedMood === option.value ? option.color : '#666',
              }}
              onClick={() => handleMoodSelect(option.value)}
            >
              <div style={{ fontSize: 14, marginTop: 8 }}>{option.label}</div>
            </Button>
          ))}
        </div>
      </Card>

      {/* 心理状态概览 */}
      <Card title="心理状态概览" style={{ marginBottom: 24 }}>
        <Result
          icon={<HeartOutlined style={{ color: '#ff4d4f', fontSize: 48 }} />}
          title="最近评估：良好"
          subTitle="保持积极心态，继续加油！"
          extra={
            <Button type="primary" size="large" onClick={handleAssessmentStart}>
              开始新测评
            </Button>
          }
        />
        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>心理健康指数</span>
              <span>85/100</span>
            </div>
            <Progress percent={85} strokeColor={{ '0%': '#ff4d4f', '100%': '#52c41a' }} />
          </div>
          <div style={{ color: '#666', fontSize: 14 }}>
            上次心理辅导：3 天前
          </div>
        </div>
      </Card>

      {/* 测评历史 */}
      <Card title="测评历史">
        <List
          dataSource={assessmentHistory}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`测评日期：${item.date}`}
                description={
                  <div>
                    <Tag color={item.score >= 80 ? 'green' : 'orange'}>
                      {item.result}
                    </Tag>
                    <span style={{ marginLeft: 16 }}>得分：{item.score}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 测评模态框 */}
      <Modal
        title="心理测评"
        open={isModalOpen}
        onOk={handleAssessmentSubmit}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okText="提交"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="question1"
            label="1. 最近睡眠质量如何？"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Input.TextArea rows={2} placeholder="请描述您的睡眠情况..." />
          </Form.Item>
          <Form.Item
            name="question2"
            label="2. 最近学习压力大吗？"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Input.TextArea rows={2} placeholder="请描述您的学习压力..." />
          </Form.Item>
          <Form.Item
            name="question3"
            label="3. 和同学相处得怎么样？"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Input.TextArea rows={2} placeholder="请描述您的人际关系..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Psychological

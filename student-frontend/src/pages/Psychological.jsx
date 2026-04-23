import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Button, Progress, Result, List, Tag, Modal, Form, Input, message, Radio, DatePicker } from 'antd'
import { HeartOutlined, SmileOutlined, MehOutlined, FrownOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons'
import { psychologicalAPI } from '../services/psychologicalApi'

const { TextArea } = Input

function Psychological() {
  const currentUser = useSelector((state) => state.auth.user)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [assessments, setAssessments] = useState([]) // 初始值就是空数组
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodDate, setMoodDate] = useState(new Date())

  // 加载数据
  useEffect(() => {
    if (currentUser) {
      loadAssessments()
      loadStatus()
    }
  }, [currentUser])

  // 加载评估历史（绝对安全）
  const loadAssessments = async () => {
    if (!currentUser || !currentUser.id || !currentUser.studentId) return
    try {
      const studentId = currentUser.studentId // 使用当前登录学生的ID
      const result = await psychologicalAPI.getAssessmentsByStudentIdAndType(studentId, 'student_self')
      if (result?.success && Array.isArray(result.data)) {
        setAssessments(result.data)
      } else {
        setAssessments([])
      }
    } catch (error) {
      console.error('获取测评记录失败:', error)
      message.error('获取测评记录失败')
      setAssessments([]) // 报错也给空数组
    }
  }

  // 加载心理状态（绝对安全）
  const loadStatus = async () => {
    if (!currentUser || !currentUser.id || !currentUser.studentId) return
    try {
      const studentId = currentUser.studentId // 使用当前登录学生的ID
      const result = await psychologicalAPI.getStatus(studentId)
      if (result?.success && result.data) {
        setStatus(result.data)
      } else {
        setStatus(null)
      }
    } catch (error) {
      console.error('获取心理状态失败:', error)
      message.error('获取心理状态失败')
      setStatus(null) // 报错也清空
    }
  }

  const moodOptions = [
    { icon: <SmileOutlined />, label: '开心', value: 'happy', color: '#52c41a' },
    { icon: <MehOutlined />, label: '一般', value: 'normal', color: '#faad14' },
    { icon: <FrownOutlined />, label: '难过', value: 'sad', color: '#ff4d4f' },
  ]

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
  }

  const handleMoodSubmit = () => {
    console.log('提交心情记录:', { mood: selectedMood, date: moodDate })
    message.success('心情记录保存成功！')
    setIsMoodModalOpen(false)
    setSelectedMood(null)
    setMoodDate(new Date())
  }

  const handleAssessmentStart = () => {
    setIsAssessmentModalOpen(true)
  }

  const handleAssessmentSubmit = async () => {
    if (!currentUser || !currentUser.id) {
      message.error('用户信息不完整')
      return
    }

    try {
      const values = await form.validateFields()
      const emotionScore = calculateScore(values.question1)
      const stressScore = calculateScore(values.question2)
      const socialScore = calculateScore(values.question3)
      const mentalScore = calculateScore(values.question4)
      const averageScore = Math.round((emotionScore + stressScore + socialScore + mentalScore) / 4)
      
      const studentId = currentUser.studentId // 使用当前登录学生的ID
      const assessorId = currentUser.id
      
      const assessmentData = {
        studentId: studentId,
        assessorId: assessorId,
        assessmentDate: new Date(),
        score: averageScore,
        comments: values.comment || '',
        assessType: 'student_self'
      }
      
      console.log('提交的评估数据:', assessmentData)
      
      const assessmentResult = await psychologicalAPI.createAssessment(assessmentData)
      console.log('评估结果:', assessmentResult)
      
      if (assessmentResult?.success && assessmentResult.data?.id) {
        const assessmentId = assessmentResult.data.id
        const details = [
          { assessmentId, assessmentType: '情绪稳定性', percentage: emotionScore, level: getLevel(emotionScore) },
          { assessmentId, assessmentType: '学习压力', percentage: stressScore, level: getLevel(stressScore) },
          { assessmentId, assessmentType: '社交互动', percentage: socialScore, level: getLevel(socialScore) },
          { assessmentId, assessmentType: '自我认知', percentage: mentalScore, level: getLevel(mentalScore) }
        ]
        
        for (const detail of details) {
          console.log('提交的评估详情:', detail)
          await psychologicalAPI.createAssessmentDetail(detail)
        }
        
        const statusData = {
          studentId: studentId,
          emotionStatus: getStatusText(emotionScore),
          emotionLevel: getLevel(emotionScore),
          emotionPercentage: emotionScore,
          socialStatus: getStatusText(socialScore),
          socialLevel: getLevel(socialScore),
          socialPercentage: socialScore,
          stressStatus: getStatusText(stressScore),
          stressLevel: getLevel(stressScore),
          stressPercentage: stressScore,
          mentalStatus: getStatusText(mentalScore),
          mentalLevel: getLevel(mentalScore),
          mentalPercentage: mentalScore
        }
        console.log('提交的状态数据:', statusData)
        await psychologicalAPI.createStatus(statusData)
        
        message.success('心理测评已完成！')
        setIsAssessmentModalOpen(false)
        form.resetFields()
        
        await loadAssessments()
        await loadStatus()
      } else {
        console.error('提交失败原因:', assessmentResult)
        message.error('提交失败：' + (assessmentResult?.error || '未知错误'))
      }
    } catch (error) {
      console.error('提交失败:', error)
      message.error('提交失败，请重试')
    }
  }

  const calculateScore = (value) => {
    switch (value) {
      case 'very_good':
      case 'no':
      case 'very_confident':
        return 90
      case 'good':
      case 'little':
      case 'confident':
        return 75
      case 'normal':
        return 60
      case 'bad':
      case 'medium':
      case 'unconfident':
        return 45
      case 'high':
        return 30
      default:
        return 60
    }
  }

  const getLevel = (score) => {
    if (score >= 80) return 'good'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const getStatusText = (score) => {
    if (score >= 80) return '优秀'
    if (score >= 60) return '良好'
    return '需关注'
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
        <h1 style={{ color: '#4CAF50', margin: 0, fontSize: '1.8em' }}>❤️ 心理支持</h1>
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
          title="今天的心情如何？" 
          style={{ 
            marginBottom: 24, 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 16 }}>
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
          <Button 
            type="primary" 
            icon={<CalendarOutlined />}
            onClick={() => setIsMoodModalOpen(true)}
            disabled={!selectedMood}
            style={{
              backgroundColor: '#4CAF50',
              borderColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#45a049',
                borderColor: '#45a049'
              }
            }}
          >
            记录心情
          </Button>
        </Card>

        <Card 
          title="心理状态概览" 
          style={{ 
            marginBottom: 24, 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <Result
            icon={<HeartOutlined style={{ color: '#4CAF50', fontSize: 48 }} />}
            title={loading ? '加载中...' : status ? '最近评估完成' : '暂无评估'}
            subTitle={status ? '保持积极心态，继续加油！' : '开始第一次心理测评吧'}
            extra={
              <Button 
                type="primary" 
                size="large" 
                icon={<PlusOutlined />} 
                onClick={handleAssessmentStart}
                style={{
                  backgroundColor: '#4CAF50',
                  borderColor: '#4CAF50',
                  '&:hover': {
                    backgroundColor: '#45a049',
                    borderColor: '#45a049'
                  }
                }}
              >
                开始新测评
              </Button>
            }
          />
          
          {/* ✅ 绝对不会崩溃的渲染 */}
          {status && (
            <div style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>心理健康指数</span>
                  <span>
                    {Math.round(
                      ((status.emotionPercentage || 0) +
                      (status.socialPercentage || 0) +
                      (status.stressPercentage || 0) +
                      (status.mentalPercentage || 0)) / 4
                    )}/100
                  </span>
                </div>
                <Progress 
                  percent={Math.round(
                    ((status.emotionPercentage || 0) +
                    (status.socialPercentage || 0) +
                    (status.stressPercentage || 0) +
                    (status.mentalPercentage || 0)) / 4
                  )} 
                  strokeColor={{ '0%': '#4CAF50', '100%': '#81C784' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#4CAF50' }}>情绪状态</div>
                  <div style={{ fontSize: 24, color: status.emotionLevel === 'good' ? '#4CAF50' : status.emotionLevel === 'warning' ? '#8BC34A' : '#FF5722', marginBottom: 4 }}>
                    {status.emotionPercentage || 0}%
                  </div>
                  <div style={{ color: status.emotionLevel === 'good' ? '#4CAF50' : status.emotionLevel === 'warning' ? '#8BC34A' : '#FF5722' }}>
                    {status.emotionStatus || '未知'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#4CAF50' }}>社交能力</div>
                  <div style={{ fontSize: 24, color: status.socialLevel === 'good' ? '#4CAF50' : status.socialLevel === 'warning' ? '#8BC34A' : '#FF5722', marginBottom: 4 }}>
                    {status.socialPercentage || 0}%
                  </div>
                  <div style={{ color: status.socialLevel === 'good' ? '#4CAF50' : status.socialLevel === 'warning' ? '#8BC34A' : '#FF5722' }}>
                    {status.socialStatus || '未知'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#4CAF50' }}>学习压力</div>
                  <div style={{ fontSize: 24, color: status.stressLevel === 'good' ? '#4CAF50' : status.stressLevel === 'warning' ? '#8BC34A' : '#FF5722', marginBottom: 4 }}>
                    {status.stressPercentage || 0}%
                  </div>
                  <div style={{ color: status.stressLevel === 'good' ? '#4CAF50' : status.stressLevel === 'warning' ? '#8BC34A' : '#FF5722' }}>
                    {status.stressStatus || '未知'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#4CAF50' }}>自我认知</div>
                  <div style={{ fontSize: 24, color: status.mentalLevel === 'good' ? '#4CAF50' : status.mentalLevel === 'warning' ? '#8BC34A' : '#FF5722', marginBottom: 4 }}>
                    {status.mentalPercentage || 0}%
                  </div>
                  <div style={{ color: status.mentalLevel === 'good' ? '#4CAF50' : status.mentalLevel === 'warning' ? '#8BC34A' : '#FF5722' }}>
                    {status.mentalStatus || '未知'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card 
          title="测评历史" 
          style={{ 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          {/* ✅ 永远不会崩溃的 List */}
          <List
            dataSource={assessments || []}
            renderItem={(item) => (
              <List.Item key={item?.id || Math.random()}>
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span>{item?.assessmentDate ? new Date(item.assessmentDate).toLocaleDateString() : ''}</span>
                      <Tag color={(item?.score || 0) >= 80 ? '#4CAF50' : (item?.score || 0) >= 60 ? '#8BC34A' : '#FF5722'}>
                        {item?.score || 0} 分
                      </Tag>
                    </div>
                  }
                  description={item?.comments || '无'}
                />
              </List.Item>
            )}
            locale={{ emptyText: '暂无测评记录' }}
          />
        </Card>

        <Modal
          title="心理测评"
          open={isAssessmentModalOpen}
          onOk={handleAssessmentSubmit}
          onCancel={() => {
            setIsAssessmentModalOpen(false)
            form.resetFields()
          }}
          okText="提交"
          cancelText="取消"
          width={600}
          destroyOnClose={true}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="question1"
              label="1. 最近一周，你感觉情绪如何？"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Radio.Group>
                <Radio value="very_good">非常好</Radio>
                <Radio value="good">良好</Radio>
                <Radio value="normal">一般</Radio>
                <Radio value="bad">较差</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="question2"
              label="2. 最近学习压力大吗？"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Radio.Group>
                <Radio value="no">没有压力</Radio>
                <Radio value="little">轻度压力</Radio>
                <Radio value="medium">中等压力</Radio>
                <Radio value="high">压力很大</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="question3"
              label="3. 和同学、朋友相处得怎么样？"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Radio.Group>
                <Radio value="very_good">非常好</Radio>
                <Radio value="good">良好</Radio>
                <Radio value="normal">一般</Radio>
                <Radio value="bad">较差</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="question4"
              label="4. 你对自己的认知如何？"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Radio.Group>
                <Radio value="very_confident">非常自信</Radio>
                <Radio value="confident">比较自信</Radio>
                <Radio value="normal">一般</Radio>
                <Radio value="unconfident">不太自信</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="comment"
              label="5. 你还有什么想补充的吗？"
            >
              <TextArea rows={3} placeholder="请输入..." />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="记录心情"
          open={isMoodModalOpen}
          onOk={handleMoodSubmit}
          onCancel={() => {
            setIsMoodModalOpen(false)
            setSelectedMood(null)
            setMoodDate(new Date())
          }}
          okText="确认"
          cancelText="取消"
          destroyOnClose={true}
        >
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>选择日期：</label>
            <DatePicker 
              value={moodDate} 
              onChange={(date) => setMoodDate(date)} 
              style={{ width: '100%' }} 
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>当前心情：</label>
            <div style={{ display: 'flex', gap: 16 }}>
              {moodOptions.map((option) => (
                <Button
                  key={option.value}
                  icon={option.icon}
                  style={{ 
                    borderColor: selectedMood === option.value ? option.color : '#d9d9d9',
                    color: selectedMood === option.value ? option.color : '#666',
                  }}
                  onClick={() => handleMoodSelect(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>心情备注：</label>
            <TextArea rows={3} placeholder="请输入今天的心情..." />
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Psychological;
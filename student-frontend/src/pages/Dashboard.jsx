import { Card, Row, Col, Progress, Statistic, Table, Tag, Spin, Button, message, Modal, Form, Input, DatePicker, TimePicker } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import {
  BookOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import api from '../services/api'
import dayjs from 'dayjs'

const Dashboard = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [learningProgress, setLearningProgress] = useState(0)
  const [activeCourses, setActiveCourses] = useState(0)
  const [upcomingCourses, setUpcomingCourses] = useState(0)
  const [psychologicalStatus, setPsychologicalStatus] = useState('')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [addTaskForm] = Form.useForm()

  // 获取学生数据
  useEffect(() => {
    if (currentUser?.id) {
      fetchStudentData()
      fetchTasks()
    }
  }, [currentUser])

  // 模拟获取学生学习数据
  const fetchStudentData = async () => {
    try {
      // 这里应该调用真实的API获取数据
      // 暂时使用模拟数据
      setActiveCourses(3)
      setUpcomingCourses(2)
      setPsychologicalStatus('良好')
    } catch (error) {
      console.error('获取学生数据失败:', error)
    }
  }

  // 计算学习进度（基于任务完成情况）
  const calculateLearningProgress = (tasks) => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === 'completed').length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  // 获取任务数据
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/tasks/student/${currentUser.id}`)
      const formattedTasks = response.map(task => ({
        key: task.id,
        id: task.id,
        title: task.title,
        dueDate: new Date(task.dueDate).toLocaleString('zh-CN'),
        status: task.status
      }))
      setTasks(formattedTasks)
      // 根据任务完成情况计算学习进度
      const progress = calculateLearningProgress(formattedTasks)
      setLearningProgress(progress)
    } catch (error) {
      console.error('获取任务数据失败:', error)
      // 如果API调用失败，使用模拟数据
      const mockTasks = [
        { key: '1', id: 1, title: '完成数学作业', dueDate: '2026-04-01', status: 'pending' },
        { key: '2', id: 2, title: '阅读英语课文', dueDate: '2026-03-30', status: 'completed' },
        { key: '3', id: 3, title: '参加线上辅导', dueDate: '2026-03-31 14:00', status: 'pending' },
      ]
      setTasks(mockTasks)
      // 根据模拟任务计算学习进度
      const progress = calculateLearningProgress(mockTasks)
      setLearningProgress(progress)
    } finally {
      setLoading(false)
    }
  }

  // 完成任务
  const handleCompleteTask = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: 'completed' })
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: 'completed' } : task
      )
      setTasks(updatedTasks)
      // 重新计算学习进度
      const progress = calculateLearningProgress(updatedTasks)
      setLearningProgress(progress)
      message.success('任务已完成')
    } catch (error) {
      console.error('完成任务失败:', error)
      message.error('完成任务失败')
    }
  }

  // 删除任务
  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      const updatedTasks = tasks.filter(task => task.id !== taskId)
      setTasks(updatedTasks)
      // 重新计算学习进度
      const progress = calculateLearningProgress(updatedTasks)
      setLearningProgress(progress)
      message.success('任务已删除')
    } catch (error) {
      console.error('删除任务失败:', error)
      message.error('删除任务失败')
    }
  }

  // 打开添加任务模态框
  const handleOpenAddModal = () => {
    addTaskForm.resetFields()
    setIsAddModalVisible(true)
  }

  // 关闭添加任务模态框
  const handleCloseAddModal = () => {
    setIsAddModalVisible(false)
  }

  // 提交添加任务表单
  const handleAddTask = async (values) => {
    try {
      const dueDate = dayjs(`${values.dueDate.format('YYYY-MM-DD')} ${values.time.format('HH:mm:ss')}`)
      const taskData = {
        studentId: currentUser.id,
        title: values.title,
        description: values.description || '',
        dueDate: dueDate.format('YYYY-MM-DD HH:mm:ss'),
        status: 'pending'
      }
      console.log('添加任务数据:', taskData)
      const response = await api.post('/tasks', taskData)
      console.log('添加任务响应:', response)
      const task = response // 直接使用响应数据，因为响应拦截器已经返回了response.data
      const newTask = {
        key: task.id,
        id: task.id,
        title: task.title,
        dueDate: new Date(task.dueDate).toLocaleString('zh-CN'),
        status: task.status
      }
      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)
      // 重新计算学习进度
      const progress = calculateLearningProgress(updatedTasks)
      setLearningProgress(progress)
      setIsAddModalVisible(false)
      message.success('任务已添加')
    } catch (error) {
      console.error('添加任务失败:', error)
      console.error('错误详情:', error.response)
      message.error('添加任务失败')
    }
  }

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
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {record.status === 'pending' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<CheckOutlined />} 
              onClick={() => handleCompleteTask(record.id)}
            >
              完成
            </Button>
          )}
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteTask(record.id)}
          >
            删除
          </Button>
        </div>
      ),
    },
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
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4CAF50', fontSize: '1.3em' }}>待完成任务</span>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleOpenAddModal}
              >
                添加任务
              </Button>
            </div>
          }
          style={{ 
            marginBottom: 16,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <Spin spinning={loading} tip="加载任务中...">
            <Table 
              columns={taskColumns} 
              dataSource={tasks} 
              pagination={false}
              size="small"
              locale={{ emptyText: '暂无任务' }}
            />
          </Spin>
        </Card>

        {/* 添加任务模态框 */}
        <Modal
          title="添加任务"
          open={isAddModalVisible}
          onCancel={handleCloseAddModal}
          footer={null}
        >
          <Form
            form={addTaskForm}
            onFinish={handleAddTask}
            layout="vertical"
          >
            <Form.Item
              name="title"
              label="任务名称"
              rules={[{ required: true, message: '请输入任务名称' }]}
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>
            <Form.Item
              name="description"
              label="任务描述"
            >
              <Input.TextArea placeholder="请输入任务描述" rows={3} />
            </Form.Item>
            <Form.Item
              name="dueDate"
              label="截止日期"
              rules={[{ required: true, message: '请选择截止日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="time"
              label="截止时间"
              rules={[{ required: true, message: '请选择截止时间' }]}
            >
              <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={handleCloseAddModal}>取消</Button>
              <Button type="primary" htmlType="submit">添加</Button>
            </div>
          </Form>
        </Modal>

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

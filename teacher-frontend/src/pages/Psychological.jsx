import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Table, Button, Tag, Modal, Form, Input, Select, Rate, message, Drawer, Descriptions } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import { psychologicalAPI } from '../services/psychologicalApi'

const { TextArea } = Input
const { Option } = Select

const Psychological = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [assessments, setAssessments] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    if (currentUser?.id) {
      loadAssessments()
      loadStudents()
    }
  }, [currentUser?.id])

  const loadAssessments = async () => {
    setLoading(true)
    try {
      const result = await psychologicalAPI.getList()
      setAssessments(result.data || [])
    } catch (error) {
      console.error('加载评估列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async () => {
    try {
      // TODO: 获取已匹配的学生列表
      setStudents([])
    } catch (error) {
      console.error('加载学生列表失败:', error)
    }
  }

  const handleAddAssessment = async (values) => {
    try {
      await psychologicalAPI.create({
        ...values,
        assessorId: currentUser.id,
        assessmentDate: new Date().toISOString()
      })
      message.success('评估添加成功')
      setModalVisible(false)
      form.resetFields()
      loadAssessments()
    } catch (error) {
      message.error('添加失败')
    }
  }

  const handleViewDetail = (assessment) => {
    setSelectedAssessment(assessment)
    setDrawerVisible(true)
  }

  const scoreColor = (score) => {
    if (score >= 80) return '#52c41a'
    if (score >= 60) return '#faad14'
    return '#ff4d4f'
  }

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: '评估日期',
      dataIndex: 'assessmentDate',
      key: 'assessmentDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: '评估分数',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <span style={{ color: scoreColor(score), fontWeight: 'bold' }}>
          {score} 分
        </span>
      )
    },
    {
      title: '评估者',
      dataIndex: 'assessorName',
      key: 'assessorName'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      )
    }
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>💚 心理辅导</h2>
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            添加心理评估
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={assessments}
          loading={loading}
          pagination={{
            pageSize: 6,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条评估记录`
          }}
        />
      </Card>

      {/* 添加评估弹窗 */}
      <Modal
        title="添加心理评估"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddAssessment}
        >
          <Form.Item
            name="studentId"
            label="选择学生"
            rules={[{ required: true, message: '请选择学生' }]}
          >
            <Select placeholder="请选择学生">
              {students.map(student => (
                <Option key={student.id} value={student.id}>
                  {student.name} - {student.grade}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="score"
            label="心理状态评分"
            rules={[{ required: true, message: '请输入评分' }]}
          >
            <Rate count={10} style={{ fontSize: 24 }} />
          </Form.Item>

          <Form.Item
            name="comments"
            label="评估意见"
            rules={[{ required: true, message: '请输入评估意见' }]}
          >
            <TextArea rows={4} placeholder="请输入详细的评估意见" />
          </Form.Item>

          <Form.Item
            name="recommendations"
            label="建议"
          >
            <TextArea rows={3} placeholder="请输入辅导建议（选填）" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="心理评估详情"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedAssessment && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="学生姓名">
              {selectedAssessment.studentName}
            </Descriptions.Item>
            <Descriptions.Item label="评估日期">
              {new Date(selectedAssessment.assessmentDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="评估分数">
              <span style={{ color: scoreColor(selectedAssessment.score), fontWeight: 'bold' }}>
                {selectedAssessment.score} 分
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="评估者">
              {selectedAssessment.assessorName}
            </Descriptions.Item>
            <Descriptions.Item label="评估意见" span={2}>
              {selectedAssessment.comments}
            </Descriptions.Item>
            <Descriptions.Item label="建议" span={2}>
              {selectedAssessment.recommendations || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}

export default Psychological

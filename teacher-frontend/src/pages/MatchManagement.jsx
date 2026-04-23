import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Table, Button, Tag, Modal, Form, Input, Space, message, Descriptions, Drawer } from 'antd'
import { CheckOutlined, CloseOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons'
import { matchAPI } from '../services/matchApi'

const { TextArea } = Input

const MatchManagement = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    if (currentUser?.id) {
      loadMatches()
    }
  }, [currentUser?.id])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const result = await matchAPI.getTeacherMatches(currentUser.id)
      setMatches(result.data || [])
    } catch (error) {
      console.error('加载匹配列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (matchId) => {
    try {
      await matchAPI.updateStatus(matchId, {
        teacherConfirm: 1 // 1: 已同意
      })
      message.success('已接受辅导请求')
      loadMatches()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleRejectRequest = async (matchId) => {
    Modal.confirm({
      title: '确认拒绝',
      content: '确定要拒绝这个辅导请求吗？',
      onOk: async () => {
        try {
          await matchAPI.updateStatus(matchId, {
            teacherConfirm: 2 // 2: 已拒绝
          })
          message.success('已拒绝辅导请求')
          loadMatches()
        } catch (error) {
          message.error('操作失败')
        }
      }
    })
  }

  const handleSendInvitation = async (values) => {
    try {
      await matchAPI.sendInvitation({
        teacherId: currentUser.id,
        studentId: selectedMatch.studentId,
        requestMessage: values.message,
        requesterType: 'teacher'
      })
      message.success('辅导邀请已发送')
      setModalVisible(false)
      form.resetFields()
      loadMatches()
    } catch (error) {
      message.error('发送邀请失败')
    }
  }

  const handleViewDetail = (match) => {
    setSelectedMatch(match)
    setDrawerVisible(true)
  }

  const statusMap = {
    0: { text: '待确认', color: 'orange' },
    1: { text: '待家长确认', color: 'blue' },
    2: { text: '已匹配', color: 'green' },
    3: { text: '已完成', color: 'purple' }
  }

  const requesterTypeMap = {
    student: '学生',
    teacher: '教师'
  }

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: '年级',
      dataIndex: 'studentGrade',
      key: 'studentGrade',
      render: (grade) => <Tag color="blue">{grade}</Tag>
    },
    {
      title: '辅导科目',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: '请求类型',
      dataIndex: 'requesterType',
      key: 'requesterType',
      render: (type) => (
        <Tag color={type === 'student' ? 'green' : 'purple'}>
          {requesterTypeMap[type]}
        </Tag>
      )
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
    },
    {
      title: '请求时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const actions = []
        
        // 查看详情
        actions.push(
          <Button
            key="view"
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
        )

        // 如果是待确认状态且是学生发起的请求，显示接受/拒绝按钮
        if (record.status === 0 && record.requesterType === 'student') {
          actions.push(
            <Button
              key="accept"
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleAcceptRequest(record.id)}
            >
              接受
            </Button>,
            <Button
              key="reject"
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleRejectRequest(record.id)}
            >
              拒绝
            </Button>
          )
        }

        // 如果是已匹配状态，可以发消息
        if (record.status === 2) {
          actions.push(
            <Button
              key="message"
              type="link"
              size="small"
              icon={<SendOutlined />}
              onClick={() => message.info('跳转到聊天页面')}
            >
              发消息
            </Button>
          )
        }

        return <Space size="small">{actions}</Space>
      }
    }
  ]

  // 过滤出待处理的请求
  const pendingMatches = matches.filter(m => m.status === 0 || m.status === 1)
  const activeMatches = matches.filter(m => m.status === 2)

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>📋 匹配管理</h2>
      
      {/* 待处理请求 */}
      <Card 
        title={
          <span>
            <span style={{ color: '#faad14' }}>●</span> 待处理请求
            <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>
              ({pendingMatches.length} 个)
            </span>
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        <Table
          columns={columns}
          dataSource={pendingMatches}
          loading={loading}
          pagination={false}
          size="small"
          rowClassName={(record) => record.status === 0 ? 'pending-row' : ''}
        />
      </Card>

      {/* 进行中的辅导 */}
      <Card 
        title={
          <span>
            <span style={{ color: '#52c41a' }}>●</span> 进行中的辅导
            <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>
              ({activeMatches.length} 个)
            </span>
          </span>
        }
      >
        <Table
          columns={columns}
          dataSource={activeMatches}
          loading={loading}
          pagination={{
            pageSize: 6,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个辅导`
          }}
          size="small"
        />
      </Card>

      {/* 发送邀请弹窗 */}
      <Modal
        title="发送辅导邀请"
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
          onFinish={handleSendInvitation}
        >
          <Form.Item
            name="message"
            label="邀请消息"
            rules={[{ required: true, message: '请输入邀请消息' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入邀请消息，介绍自己并说明能提供的帮助..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="匹配详情"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedMatch && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="学生姓名">
              {selectedMatch.studentName}
            </Descriptions.Item>
            <Descriptions.Item label="年级">
              {selectedMatch.studentGrade}
            </Descriptions.Item>
            <Descriptions.Item label="学校">
              {selectedMatch.studentSchool}
            </Descriptions.Item>
            <Descriptions.Item label="辅导科目">
              {selectedMatch.subject}
            </Descriptions.Item>
            <Descriptions.Item label="学习需求" span={2}>
              {selectedMatch.studentLearningNeeds || '暂无'}
            </Descriptions.Item>
            <Descriptions.Item label="请求类型">
              <Tag color={selectedMatch.requesterType === 'student' ? 'green' : 'purple'}>
                {requesterTypeMap[selectedMatch.requesterType]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[selectedMatch.status]?.color}>
                {statusMap[selectedMatch.status]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="请求消息" span={2}>
              {selectedMatch.requestMessage || '无'}
            </Descriptions.Item>
            <Descriptions.Item label="请求时间">
              {new Date(selectedMatch.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}

export default MatchManagement

import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Modal, message } from 'antd'
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const Match = () => {
  const [activeTab, setActiveTab] = useState('sent')

  // 模拟数据 - 我发送的请求
  const sentRequests = [
    {
      key: '1',
      id: 1,
      teacherName: '李老师',
      subject: '数学',
      content: '我希望在数学方面得到辅导，特别是分数的加减法',
      sendTime: '2026-03-30 09:30',
      status: 'pending',
      statusText: '待家长确认',
    },
    {
      key: '2',
      id: 2,
      teacherName: '王老师',
      subject: '语文',
      content: '我希望在语文作文方面得到辅导',
      sendTime: '2026-03-28 14:20',
      confirmTime: '2026-03-29 10:15',
      status: 'approved',
      statusText: '已匹配',
    },
  ]

  // 模拟数据 - 我收到的邀请
  const receivedInvitations = [
    {
      key: '3',
      id: 3,
      teacherName: '张老师',
      subject: '英语',
      content: '我看到您在英语方面有学习需求，我很乐意帮助您',
      sendTime: '2026-03-31 10:00',
      status: 'pending',
      statusText: '待确认',
    },
  ]

  // 模拟数据 - 已匹配
  const matched = [
    {
      key: '2',
      id: 2,
      teacherName: '王老师',
      subject: '语文',
      matchTime: '2026-03-29 10:15',
      status: 'active',
      statusText: '进行中',
    },
  ]

  const columns = [
    {
      title: '教师',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (name, record) => (
        <Space>
          <span style={{ fontWeight: 'bold' }}>{name}</span>
          <Tag color="blue">{record.subject}</Tag>
        </Space>
      ),
    },
    {
      title: '请求内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '时间',
      key: 'time',
      render: (_, record) => (
        <div>
          <div><ClockCircleOutlined /> 发送：{record.sendTime}</div>
          {record.confirmTime && (
            <div style={{ color: '#52c41a' }}>
              <CheckCircleOutlined /> 确认：{record.confirmTime}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'statusText',
      key: 'status',
      render: (text, record) => {
        let color = 'default'
        let icon = null
        if (record.status === 'pending') {
          color = 'warning'
          icon = <ClockCircleOutlined />
        } else if (record.status === 'approved' || record.status === 'active') {
          color = 'success'
          icon = <CheckCircleOutlined />
        } else if (record.status === 'rejected') {
          color = 'error'
          icon = <CloseCircleOutlined />
        }
        return (
          <Tag color={color}>
            {icon} {text}
          </Tag>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        if (activeTab === 'sent') {
          return (
            <Space>
              <Button 
                size="small" 
                onClick={() => handleCancelRequest(record.id)}
              >
                取消请求
              </Button>
            </Space>
          )
        } else if (activeTab === 'received') {
          return (
            <Space>
              <Button 
                size="small" 
                type="primary"
                onClick={() => handleAcceptInvitation(record.id)}
              >
                接受
              </Button>
              <Button 
                size="small"
                onClick={() => handleRejectInvitation(record.id)}
              >
                拒绝
              </Button>
            </Space>
          )
        } else {
          return (
            <Space>
              <Button 
                size="small" 
                type="primary"
                onClick={() => handleViewDetails(record.id)}
              >
                查看详情
              </Button>
            </Space>
          )
        }
      },
    },
  ]

  const handleCancelRequest = (requestId) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消这个辅导请求吗？',
      onOk: () => {
        message.success('辅导请求已取消')
        // TODO: 调用 API 取消请求
      },
    })
  }

  const handleAcceptInvitation = (invitationId) => {
    message.success('已接受邀请，等待家长确认！')
    // TODO: 调用 API 接受邀请
  }

  const handleRejectInvitation = (invitationId) => {
    message.info('已拒绝邀请')
    // TODO: 调用 API 拒绝邀请
  }

  const handleViewDetails = (matchId) => {
    message.info('查看匹配详情')
    // TODO: 调用 API 获取详情或打开详情页面
  }

  const tabItems = [
    {
      key: 'sent',
      label: '我发送的请求',
      children: (
        <Table 
          columns={columns} 
          dataSource={sentRequests} 
          pagination={false}
        />
      ),
    },
    {
      key: 'received',
      label: '我收到的邀请',
      children: (
        <Table 
          columns={columns} 
          dataSource={receivedInvitations} 
          pagination={false}
        />
      ),
    },
    {
      key: 'matched',
      label: '已匹配',
      children: (
        <Table 
          columns={columns} 
          dataSource={matched} 
          pagination={false}
        />
      ),
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: '#4CAF50' }}>🤝 匹配管理</h1>

      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  )
}

export default Match

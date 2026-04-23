import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Modal, message } from 'antd'
import { useSelector } from 'react-redux'
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const Match = () => {
  const currentUser = useSelector((state) => state.auth.user)
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
          <Tag style={{ backgroundColor: '#4CAF50', border: 'none', color: '#fff' }}>{record.subject}</Tag>
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
            <div style={{ color: '#4CAF50' }}>
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
        let color = '#999'
        let bgColor = '#f5f5f5'
        let icon = null
        if (record.status === 'pending') {
          color = '#faad14'
          bgColor = '#fffbe6'
          icon = <ClockCircleOutlined />
        } else if (record.status === 'approved' || record.status === 'active') {
          color = '#4CAF50'
          bgColor = '#f6ffed'
          icon = <CheckCircleOutlined />
        } else if (record.status === 'rejected') {
          color = '#ff4d4f'
          bgColor = '#fff1f0'
          icon = <CloseCircleOutlined />
        }
        return (
          <Tag style={{ backgroundColor: bgColor, color: color, border: 'none' }}>
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
                style={{ borderColor: '#4CAF50', color: '#4CAF50' }}
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
                style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
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
                style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
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
        <h1 style={{ color: '#4CAF50', margin: 0, fontSize: '1.8em' }}>🤝 匹配管理</h1>
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
          style={{ 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={tabItems}
          />
        </Card>
      </div>
    </div>
  )
}

export default Match

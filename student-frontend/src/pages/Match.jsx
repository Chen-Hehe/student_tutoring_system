import { useState, useEffect } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Modal, message, Spin } from 'antd'
import { useSelector } from 'react-redux'
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { getStudentMatches, acceptMatch, rejectMatch, cancelMatchRequest } from '../services/match'

const Match = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [activeTab, setActiveTab] = useState('sent')
  const [loading, setLoading] = useState(false)
  const [sentRequests, setSentRequests] = useState([])
  const [receivedInvitations, setReceivedInvitations] = useState([])
  const [matched, setMatched] = useState([])

  // 加载匹配数据
  useEffect(() => {
    loadMatches()
  }, [currentUser?.id])

  const loadMatches = async () => {
    if (!currentUser?.id) return
    
    setLoading(true)
    try {
      const res = await getStudentMatches(currentUser.id)
      const data = res.data || []
      
      // 按状态分类
      const sent = data.filter(item => item.requesterType === 'student')
      const received = data.filter(item => item.requesterType === 'teacher')
      const matchedList = data.filter(item => item.status === 2)
      
      setSentRequests(sent)
      setReceivedInvitations(received)
      setMatched(matchedList)
    } catch (error) {
      message.error('加载匹配数据失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

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
      onOk: async () => {
        try {
          await cancelMatchRequest(requestId)
          message.success('辅导请求已取消')
          loadMatches()
        } catch (error) {
          message.error('取消失败：' + error.message)
        }
      },
    })
  }

  const handleAcceptInvitation = (invitationId) => {
    Modal.confirm({
      title: '确认接受',
      content: '接受后将等待家长确认，确认接受吗？',
      onOk: async () => {
        try {
          await acceptMatch(invitationId, currentUser.id, 'student')
          message.success('已接受邀请，等待家长确认！')
          loadMatches()
        } catch (error) {
          message.error('接受失败：' + error.message)
        }
      },
    })
  }

  const handleRejectInvitation = (invitationId) => {
    Modal.confirm({
      title: '确认拒绝',
      content: '确定要拒绝这个邀请吗？',
      onOk: async () => {
        try {
          await rejectMatch(invitationId, currentUser.id, 'student')
          message.info('已拒绝邀请')
          loadMatches()
        } catch (error) {
          message.error('拒绝失败：' + error.message)
        }
      },
    })
  }

  const handleViewDetails = (matchId) => {
    message.info('查看匹配详情：' + matchId)
    // TODO: 打开详情页面或弹窗
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
        {loading && <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" tip="加载匹配数据..." /></div>}
        
        {!loading && (
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
        )}
      </div>
    </div>
  )
}

export default Match

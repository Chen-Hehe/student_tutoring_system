import { Table, Tag, Space, Button, Input, Select, Row, Col, Card } from 'antd'

const { Option } = Select

const UserManagement = () => {
  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 80,
      align: 'center'
    },
    { 
      title: '用户名', 
      dataIndex: 'username', 
      key: 'username',
      align: 'center'
    },
    { 
      title: '真实姓名', 
      dataIndex: 'name', 
      key: 'name',
      align: 'center'
    },
    { 
      title: '角色', 
      dataIndex: 'role', 
      key: 'role', 
      align: 'center',
      render: (role) => {
        const roleMap = {
          teacher: { color: '#E3F2FD', textColor: '#1976D2', text: '教师' },
          student: { color: '#E8F5E9', textColor: '#388E3C', text: '学生' },
          parent: { color: '#FFF3E0', textColor: '#F57C00', text: '家长' },
          admin: { color: '#F3E5F5', textColor: '#7B1FA2', text: '管理员' }
        }
        const roleInfo = roleMap[role] || { color: '#EEEEEE', textColor: '#999', text: '未知' }
        return (
          <span 
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 12,
              backgroundColor: roleInfo.color,
              color: roleInfo.textColor,
              fontSize: 12
            }}
          >
            {roleInfo.text}
          </span>
        )
      }
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      align: 'center',
      render: (status) => {
        const statusMap = {
          active: { color: '#E8F5E9', textColor: '#388E3C', text: '活跃' },
          inactive: { color: '#FFEBEE', textColor: '#C62828', text: '禁用' }
        }
        const statusInfo = statusMap[status] || { color: '#EEEEEE', textColor: '#999', text: '未知' }
        return (
          <span 
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 12,
              backgroundColor: statusInfo.color,
              color: statusInfo.textColor,
              fontSize: 12
            }}
          >
            {statusInfo.text}
          </span>
        )
      }
    },
    { 
      title: '注册时间', 
      dataIndex: 'registerTime', 
      key: 'registerTime',
      align: 'center'
    },
    { 
      title: '操作', 
      key: 'action',
      align: 'center', 
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            style={{ 
              backgroundColor: '#9C27B0', 
              borderColor: '#9C27B0',
              borderRadius: 4
            }}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            style={{ 
              backgroundColor: '#e0e0e0', 
              color: '#333',
              borderRadius: 4
            }}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ]

  const data = [
    { id: 1, username: 'teacher1', name: '李老师', role: 'teacher', status: 'active', registerTime: '2026-03-01' },
    { id: 2, username: 'teacher2', name: '王老师', role: 'teacher', status: 'active', registerTime: '2026-03-02' },
    { id: 3, username: 'student1', name: '小明', role: 'student', status: 'active', registerTime: '2026-03-03' },
    { id: 4, username: 'student2', name: '小红', role: 'student', status: 'active', registerTime: '2026-03-04' },
    { id: 5, username: 'parent1', name: '张三爸爸', role: 'parent', status: 'active', registerTime: '2026-03-05' },
    { id: 6, username: 'parent2', name: '李四妈妈', role: 'parent', status: 'inactive', registerTime: '2026-03-06' },
    { id: 7, username: 'admin1', name: '管理员', role: 'admin', status: 'active', registerTime: '2026-03-01' },
  ]

  return (
    // 3. 整个右侧内容区 全屏淡蓝色背景
    <div style={{ background: '#f0f7ff', padding: '20px 24px', minHeight: '100vh', fontSize: '16px' }}>
      
      {/* 2. 已删除 搜索上方的“用户管理”标题 */}

      {/* 搜索区域卡片 */}
      <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12, marginBottom: 20, padding: '20px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>搜索:</span>
            <Input placeholder="输入用户名或姓名" style={{ width: 250, fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col>
            <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>角色:</span>
            <Select style={{ width: 150, fontSize: '16px' }} defaultValue="">
              <Option value="" style={{ fontSize: '16px' }}>全部</Option>
              <Option value="teacher" style={{ fontSize: '16px' }}>教师</Option>
              <Option value="student" style={{ fontSize: '16px' }}>学生</Option>
              <Option value="parent" style={{ fontSize: '16px' }}>家长</Option>
              <Option value="admin" style={{ fontSize: '16px' }}>管理员</Option>
            </Select>
          </Col>
          <Col>
            <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>状态:</span>
            <Select style={{ width: 150, fontSize: '16px' }} defaultValue="">
              <Option value="" style={{ fontSize: '16px' }}>全部</Option>
              <Option value="active" style={{ fontSize: '16px' }}>活跃</Option>
              <Option value="inactive" style={{ fontSize: '16px' }}>禁用</Option>
            </Select>
          </Col>
          <Col>
            <Button style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}>搜索</Button>
          </Col>
          <Col>
            <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}>重置</Button>
          </Col>
          <Col>
            <Button style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}>添加用户</Button>
          </Col>
        </Row>
      </Card>

      {/* 用户列表卡片 */}
      <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12, padding: '20px' }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 16, fontSize: '20px', fontWeight: 600 }}>用户列表</h3>
        
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          size="large"
          pagination={{
            // 1. 页码 底部 + 居中
            position: ['bottomCenter'],
            current: 1,
            pageSize: 10,
            total: 25,
            showSizeChanger: false,
            showQuickJumper: false,
            itemRender: (page, type, originalElement) => {
              if (type === 'prev') return <span style={{ margin: '0 8px', cursor: 'pointer', fontSize: '16px' }}>上一页</span>
              if (type === 'next') return <span style={{ margin: '0 8px', cursor: 'pointer', fontSize: '16px' }}>下一页</span>
              if (type === 'page') {
                return (
                  <span 
                    style={{
                      margin: '0 8px',
                      padding: '6px 12px',
                      borderRadius: 4,
                      backgroundColor: page === 1 ? '#9C27B0' : 'white',
                      color: page === 1 ? 'white' : '#333',
                      border: '1px solid #e0e0e0',
                      display: 'inline-block',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    {page}
                  </span>
                )
              }
              return originalElement
            }
          }}
        />
      </Card>
    </div>
  )
}

export default UserManagement
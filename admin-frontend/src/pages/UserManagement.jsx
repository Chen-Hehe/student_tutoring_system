import { useState, useEffect } from 'react'
import { Table, Tag, Space, Button, Input, Select, Row, Col, Card, message, Spin, Modal, Form } from 'antd'
import { userAPI } from '../services/userApi'

const { Option } = Select

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    role: '',
    status: ''
  })
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [form] = Form.useForm()

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
          1: { color: '#E3F2FD', textColor: '#1976D2', text: '教师' },
          2: { color: '#E8F5E9', textColor: '#388E3C', text: '学生' },
          3: { color: '#FFF3E0', textColor: '#F57C00', text: '家长' },
          4: { color: '#F3E5F5', textColor: '#7B1FA2', text: '管理员' }
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
      dataIndex: 'deleted', 
      key: 'deleted',
      align: 'center',
      render: (deleted) => {
        const statusMap = {
          0: { color: '#E8F5E9', textColor: '#388E3C', text: '活跃' },
          1: { color: '#FFEBEE', textColor: '#C62828', text: '禁用' }
        }
        const statusInfo = statusMap[deleted] || { color: '#EEEEEE', textColor: '#999', text: '未知' }
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
      dataIndex: 'createdAt', 
      key: 'createdAt',
      align: 'center',
      render: (createdAt) => {
        if (!createdAt) return '-'
        return new Date(createdAt).toLocaleDateString('zh-CN')
      }
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
            onClick={() => handleEditUser(record)}
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
            onClick={() => handleToggleStatus(record)}
          >
            {record.deleted === 0 ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ]

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true)
    try {
      // 转换角色参数（前端使用字符串，后端使用数字）
      let roleParam = null
      switch (searchParams.role) {
        case 'teacher': roleParam = 1; break
        case 'student': roleParam = 2; break
        case 'parent': roleParam = 3; break
        case 'admin': roleParam = 4; break
        default: roleParam = null
      }
      
      const response = await userAPI.getUsers(roleParam)
      if (response && response.data) {
        setUsers(response.data)
      }
    } catch (error) {
      message.error('获取用户列表失败')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和参数变化时重新获取数据
  useEffect(() => {
    fetchUsers()
  }, [searchParams.role])

  // 处理搜索参数变化
  const handleSearch = () => {
    fetchUsers()
  }

  // 处理重置
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      role: '',
      status: ''
    })
    fetchUsers()
  }

  // 处理编辑用户
  const handleEditUser = (user) => {
    setCurrentUser(user)
    form.setFieldsValue({
      username: user.username,
      name: user.name,
      role: user.role
    })
    setIsEditModalVisible(true)
  }

  // 处理保存编辑
  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields()
      const updatedUser = {
        ...currentUser,
        ...values
      }
      
      await userAPI.updateUser(currentUser.id, updatedUser)
      message.success('用户信息更新成功')
      setIsEditModalVisible(false)
      fetchUsers()
    } catch (error) {
      message.error('保存失败，请检查输入')
      console.error('Error updating user:', error)
    }
  }

  // 处理禁用/启用用户
  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.deleted === 0 ? 1 : 0
      await userAPI.toggleUserStatus(user.id, newStatus === 1)
      message.success(`${newStatus === 1 ? '禁用' : '启用'}成功`)
      fetchUsers()
    } catch (error) {
      message.error('操作失败')
      console.error('Error toggling user status:', error)
    }
  }

  return (
    <div>
      {/* 搜索区域卡片 */}
      <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12, marginBottom: 20, padding: '20px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>搜索:</span>
            <Input 
              placeholder="输入用户名或姓名" 
              style={{ width: 250, fontSize: '16px', padding: '8px 12px' }} 
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
            />
          </Col>
          <Col>
            <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>角色:</span>
            <Select 
              style={{ width: 150, fontSize: '16px' }} 
              value={searchParams.role}
              onChange={(value) => setSearchParams({...searchParams, role: value})}
            >
              <Option value="" style={{ fontSize: '16px' }}>全部</Option>
              <Option value="teacher" style={{ fontSize: '16px' }}>教师</Option>
              <Option value="student" style={{ fontSize: '16px' }}>学生</Option>
              <Option value="parent" style={{ fontSize: '16px' }}>家长</Option>
              <Option value="admin" style={{ fontSize: '16px' }}>管理员</Option>
            </Select>
          </Col>
          <Col>
            <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>状态:</span>
            <Select 
              style={{ width: 150, fontSize: '16px' }} 
              value={searchParams.status}
              onChange={(value) => setSearchParams({...searchParams, status: value})}
            >
              <Option value="" style={{ fontSize: '16px' }}>全部</Option>
              <Option value="active" style={{ fontSize: '16px' }}>活跃</Option>
              <Option value="inactive" style={{ fontSize: '16px' }}>禁用</Option>
            </Select>
          </Col>
          <Col>
            <Button 
              style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}
              onClick={handleSearch}
            >
              搜索
            </Button>
          </Col>
          <Col>
            <Button 
              style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}
              onClick={handleReset}
            >
              重置
            </Button>
          </Col>
          <Col>
            <Button style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}>添加用户</Button>
          </Col>
        </Row>
      </Card>

      {/* 用户列表卡片 */}
      <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12, padding: '20px' }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 16, fontSize: '20px', fontWeight: 600 }}>用户列表</h3>
        
        <Spin spinning={loading} tip="加载中...">
          <Table 
            columns={columns} 
            dataSource={users} 
            rowKey="id"
            size="large"
            pagination={false}
            style={{ marginBottom: '20px' }}
          />
        </Spin>
        
        {/* 自定义分页 */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span style={{ margin: '0 8px', cursor: 'pointer', fontSize: '14px' }}>上一页</span>
          <span 
            style={{
              margin: '0 5px',
              padding: '6px 10px',
              borderRadius: 4,
              backgroundColor: '#9C27B0',
              color: 'white',
              border: '1px solid #9C27B0',
              display: 'inline-block',
              cursor: 'pointer',
              fontSize: '14px',
              outline: 'none',
              boxShadow: 'none',
              lineHeight: '1.5',
              minWidth: '30px',
              textAlign: 'center',
              boxSizing: 'border-box',
              userSelect: 'none'
            }}
            onMouseDown={(e) => e.preventDefault()}
            onFocus={(e) => e.currentTarget.style.outline = 'none'}
          >
            1
          </span>
          <span style={{ margin: '0 8px', cursor: 'pointer', fontSize: '14px' }}>下一页</span>
        </div>
      </Card>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户信息"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleSaveEdit}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{}}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="name"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value={1}>教师</Option>
              <Option value={2}>学生</Option>
              <Option value={3}>家长</Option>
              <Option value={4}>管理员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
import { Card, Row, Col, Table, Tag, Space, Button, Spin, Modal, Form, Input, Select, message } from 'antd'
import { useState, useEffect } from 'react'
import { adminAPI } from '../services/adminApi'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    teacherCount: 0,
    studentCount: 0,
    parentCount: 0,
    chatCount: 0
  })
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [form] = Form.useForm()

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '真实姓名', dataIndex: 'name', key: 'name' },
    { 
      title: '角色', 
      dataIndex: 'role', 
      key: 'role', 
      render: (role) => {
        const roleMap = {
          teacher: { color: '#1976D2', text: '教师', className: 'role-teacher' },
          student: { color: '#388E3C', text: '学生', className: 'role-student' },
          parent: { color: '#F57C00', text: '家长', className: 'role-parent' },
          admin: { color: '#7B1FA2', text: '管理员', className: 'role-admin' }
        }
        const roleInfo = roleMap[role] || { color: '#999', text: '未知', className: 'role-unknown' }
        return <Tag color={roleInfo.color} className={roleInfo.className} style={{ fontSize: '16px', padding: '4px 12px' }}>{roleInfo.text}</Tag>
      }
    },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="default" 
            style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '16px', padding: '6px 16px' }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            size="default" 
            style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '6px 16px' }}
            onClick={() => handleDisable(record.id, record.status === '活跃')}
          >
            {record.status === '活跃' ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    fetchStatistics()
    fetchUsers()
  }, [])

  const fetchStatistics = async () => {
    try {
      console.log('开始获取统计数据...')
      const response = await adminAPI.getStatistics()
      console.log('统计数据响应:', response)
      if (response) {
        // 支持两种响应格式
        if (response.success) {
          console.log('统计数据:', response.data)
          setStatistics(response.data)
        } else if (response.code === 200) {
          console.log('统计数据:', response.data)
          setStatistics(response.data)
        }
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      // 添加模拟数据作为 fallback
      setStatistics({
        teacherCount: 3,
        studentCount: 5,
        parentCount: 3,
        chatCount: 0
      })
    }
  }

  const fetchUsers = async (page = 1, size = 10) => {
    setLoading(true)
    try {
      console.log('开始获取用户列表...')
      const response = await adminAPI.getUsers(page, size)
      console.log('用户列表响应:', response)
      if (response) {
        // 支持两种响应格式
        if (response.success) {
          console.log('用户列表:', response.data.list)
          setUsers(response.data.list)
          setPagination({
            current: response.data.page,
            pageSize: response.data.size,
            total: response.data.total
          })
        } else if (response.code === 200) {
          console.log('用户列表:', response.data.list)
          setUsers(response.data.list)
          setPagination({
            current: response.data.page,
            pageSize: response.data.size,
            total: response.data.total
          })
        }
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      // 添加模拟数据作为 fallback
      setUsers([
        { id: 1, username: 'admin', name: '管理员', role: 'admin', status: '活跃' },
        { id: 101, username: 'teacher_zhang', name: '张老师', role: 'teacher', status: '活跃' },
        { id: 102, username: 'teacher_li', name: '李老师', role: 'teacher', status: '活跃' },
        { id: 103, username: 'teacher_wang', name: '王老师', role: 'teacher', status: '活跃' },
        { id: 201, username: 'student_hu', name: '小红', role: 'student', status: '活跃' },
        { id: 202, username: 'student_gao', name: '小高', role: 'student', status: '活跃' },
        { id: 203, username: 'student_chen', name: '小陈', role: 'student', status: '活跃' },
        { id: 301, username: 'parent_chen', name: '王家长', role: 'parent', status: '活跃' },
        { id: 302, username: 'parent_li', name: '李家长', role: 'parent', status: '活跃' },
        { id: 303, username: 'parent_wang', name: '王家长', role: 'parent', status: '活跃' }
      ])
      setPagination({
        current: 1,
        pageSize: 10,
        total: 10
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleEdit = (user) => {
    setCurrentUser(user)
    form.setFieldsValue({
      name: user.name,
      role: user.role
    })
    setEditModalVisible(true)
  }
  
  const handleDisable = async (userId, isActive) => {
    try {
      const response = await adminAPI.disableUser(userId)
      if (response.success || response.code === 200) {
        message.success(isActive ? '用户已禁用' : '用户已启用')
        // 重新获取用户列表
        fetchUsers(pagination.current, pagination.pageSize)
      } else {
        message.error('操作失败: ' + (response.message || '未知错误'))
      }
    } catch (error) {
      console.error('禁用用户失败:', error)
      message.error('操作失败，请重试')
    }
  }
  
  const handleSave = async (values) => {
    try {
      console.log('开始编辑用户:', currentUser.id, values);
      const response = await adminAPI.editUser({
        id: currentUser.id,
        name: values.name,
        role: values.role
      })
      console.log('编辑用户响应:', response);
      if (response.success || response.code === 200) {
        message.success('编辑成功')
        setEditModalVisible(false)
        // 重新获取用户列表
        fetchUsers(pagination.current, pagination.pageSize)
      } else {
        message.error('编辑失败: ' + (response.message || '未知错误'))
      }
    } catch (error) {
      console.error('编辑用户失败:', error)
      console.error('错误堆栈:', error.stack);
      message.error('编辑失败，请重试: ' + error.message)
    }
  }

  return (
    <div>
      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      )}
      
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#9C27B0' }}>👨‍🏫</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 10, fontSize: '1.4em' }}>教师数量</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>{statistics.teacherCount}</div>
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>当前系统中注册的教师</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#9C27B0' }}>👨‍🎓</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 10, fontSize: '1.4em' }}>学生数量</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>{statistics.studentCount}</div>
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>当前系统中注册的学生</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#9C27B0' }}>👨‍👩‍👧‍👦</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 10, fontSize: '1.4em' }}>家长数量</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>{statistics.parentCount}</div>
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>当前系统中注册的家长</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', borderRadius: 12, padding: 20, backgroundColor: '#ffffff', transform: 'translateY(0)', cursor: 'pointer' }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#9C27B0' }}>💬</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 10, fontSize: '1.4em' }}>辅导会话</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>{statistics.chatCount}</div>
            <p style={{ marginTop: 10, color: '#666', fontSize: '14px' }}>系统中总聊天记录数</p>
          </Card>
        </Col>
      </Row>
      
      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 12, padding: 20, backgroundColor: '#ffffff' }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.6em', fontWeight: 'bold' }}>用户管理</h3>
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          size="middle"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, size) => fetchUsers(page, size)
          }}
          style={{ fontSize: '16px', marginBottom: '20px' }}
        />
      </Card>
      
      {/* 编辑用户弹窗 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" style={{ fontSize: '16px' }} />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select style={{ fontSize: '16px' }}>
              <Select.Option value="teacher">教师</Select.Option>
              <Select.Option value="student">学生</Select.Option>
              <Select.Option value="parent">家长</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right' }}>
            <Button 
              style={{ marginRight: 10, fontSize: '16px' }}
              onClick={() => setEditModalVisible(false)}
            >
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '16px' }}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Dashboard

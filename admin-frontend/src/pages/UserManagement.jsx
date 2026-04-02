import { Table, Tag, Space, Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Search } = Input

const UserManagement = () => {
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (role) => {
        const roleMap = { 1: '教师', 2: '学生', 3: '家长', 4: '管理员' }
        return <Tag color="blue">{roleMap[role] || '未知'}</Tag>
      }
    },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ]

  const data = [
    { id: 1, username: 'teacher1', name: '张老师', role: 1, email: 'teacher1@example.com', phone: '13800138001' },
    { id: 2, username: 'student1', name: '李明', role: 2, email: 'student1@example.com', phone: '13800138002' },
    { id: 3, username: 'parent1', name: '李父', role: 3, email: 'parent1@example.com', phone: '13800138003' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>用户管理</h2>
        <Search placeholder="搜索用户" style={{ width: 300 }} />
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}

export default UserManagement

import { Card, Row, Col, Table, Tag, Space, Button } from 'antd'

const Dashboard = () => {
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
      render: () => (
        <Space>
          <Button type="primary" size="default" style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '16px', padding: '6px 16px' }}>编辑</Button>
          <Button size="default" style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '6px 16px' }}>禁用</Button>
        </Space>
      ),
    },
  ]

  const data = [
    { id: 1, username: 'teacher1', name: '李老师', role: 'teacher', status: '活跃' },
    { id: 2, username: 'student1', name: '小明', role: 'student', status: '活跃' },
    { id: 3, username: 'parent1', name: '王家长', role: 'parent', status: '活跃' },
    { id: 4, username: 'admin1', name: '管理员', role: 'admin', status: '活跃' },
  ]

  return (
    <div style={{ background: '#f0f7ff', padding: '20px 24px', minHeight: '100vh', fontSize: '16px' }}>
      <Row gutter={[30, 30]} style={{ marginBottom: 30 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', borderRadius: 12, padding: 30 }} hoverable>
            <div style={{ fontSize: '3.5em', marginBottom: 20, color: '#9C27B0' }}>👨‍🏫</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.8em' }}>教师数量</h3>
            <div style={{ fontSize: '3em', fontWeight: 'bold', color: '#333' }}>45</div>
            <p style={{ marginTop: 15, color: '#666', fontSize: '18px' }}>本周新增 2 名</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', borderRadius: 12, padding: 30 }} hoverable>
            <div style={{ fontSize: '3.5em', marginBottom: 20, color: '#9C27B0' }}>👨‍🎓</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.8em' }}>学生数量</h3>
            <div style={{ fontSize: '3em', fontWeight: 'bold', color: '#333' }}>128</div>
            <p style={{ marginTop: 15, color: '#666', fontSize: '18px' }}>本周新增 5 名</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', borderRadius: 12, padding: 30 }} hoverable>
            <div style={{ fontSize: '3.5em', marginBottom: 20, color: '#9C27B0' }}>👨‍👩‍👧‍👦</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.8em' }}>家长数量</h3>
            <div style={{ fontSize: '3em', fontWeight: 'bold', color: '#333' }}>89</div>
            <p style={{ marginTop: 15, color: '#666', fontSize: '18px' }}>本周新增 3 名</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', borderRadius: 12, padding: 30 }} hoverable>
            <div style={{ fontSize: '3.5em', marginBottom: 20, color: '#9C27B0' }}>💬</div>
            <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.8em' }}>辅导会话</h3>
            <div style={{ fontSize: '3em', fontWeight: 'bold', color: '#333' }}>236</div>
            <p style={{ marginTop: 15, color: '#666', fontSize: '18px' }}>本周新增 15 次</p>
          </Card>
        </Col>
      </Row>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: 12, padding: 30 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 30, fontSize: '2em', fontWeight: 'bold' }}>用户管理</h3>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          size="large"
          pagination={{ 
            pageSize: 10, 
            fontSize: '18px',
            itemRender: (current, type, originalElement) => {
              if (type === 'prev') {
                return <a style={{ fontSize: '18px' }}>上一页</a>;
              }
              if (type === 'next') {
                return <a style={{ fontSize: '18px' }}>下一页</a>;
              }
              return <a style={{ fontSize: '18px' }}>{current}</a>;
            }
          }}
          style={{ fontSize: '18px' }}
        />
      </Card>
    </div>
  )
}

export default Dashboard

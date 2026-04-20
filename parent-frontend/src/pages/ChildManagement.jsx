import { useState, useEffect } from 'react'
import { Card, Form, Input, Select, Button, Table, Modal } from 'antd'
const { Option } = Select
const ChildManagement = () => {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  // 从localStorage获取孩子列表，如果没有则使用默认数据
  const [children, setChildren] = useState(() => {
    try {
      const storedChildren = localStorage.getItem('children')
      if (storedChildren) {
        const parsedChildren = JSON.parse(storedChildren)
        if (Array.isArray(parsedChildren) && parsedChildren.length > 0) {
          return parsedChildren
        }
      }
    } catch (error) {
      console.error('读取localStorage失败:', error)
    }
    // 默认数据
    const defaultChildren = [
      { id: 1, name: '小明', grade: '三年级', subject: '数学', status: 'active', tutoringStatus: '进行中', teacher: '陈老师' },
      { id: 2, name: '小红', grade: '四年级', subject: '语文', status: 'active', tutoringStatus: '进行中', teacher: '张老师' }
    ]
    // 保存默认数据到localStorage
    try {
      localStorage.setItem('children', JSON.stringify(defaultChildren))
    } catch (error) {
      console.error('保存localStorage失败:', error)
    }
    return defaultChildren
  })
  
  // 组件挂载时重新从localStorage读取数据，确保显示最新状态
  useEffect(() => {
    try {
      const storedChildren = localStorage.getItem('children')
      if (storedChildren) {
        const parsedChildren = JSON.parse(storedChildren)
        if (Array.isArray(parsedChildren)) {
          setChildren(parsedChildren)
        }
      }
    } catch (error) {
      console.error('读取localStorage失败:', error)
    }
  }, [])
  const [editingChild, setEditingChild] = useState(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  
  const handleAddChild = (values) => {
    const newChild = {
      id: children.length + 1,
      name: values.name,
      grade: values.grade,
      subject: values.subject,
      status: 'active',
      tutoringStatus: '未进行',
      teacher: null
    }
    const updatedChildren = [...children, newChild]
    setChildren(updatedChildren)
    // 保存更新后的孩子列表到localStorage
    localStorage.setItem('children', JSON.stringify(updatedChildren))
    form.resetFields()
  }
  
  const handleEdit = (id) => {
    const child = children.find(child => child.id === id)
    if (child) {
      setEditingChild(child)
      editForm.setFieldsValue({
        name: child.name,
        grade: child.grade,
        subject: child.subject,
        status: child.status,
        tutoringStatus: child.tutoringStatus,
        teacher: child.teacher
      })
      setIsEditModalVisible(true)
    }
  }
  
  const handleUpdateChild = (values) => {
    const updatedChildren = children.map(child => 
      child.id === editingChild.id ? { ...child, ...values } : child
    )
    setChildren(updatedChildren)
    // 保存更新后的孩子列表到localStorage
    localStorage.setItem('children', JSON.stringify(updatedChildren))
    setIsEditModalVisible(false)
    editForm.resetFields()
  }
  
  const handleCancelEdit = () => {
    setIsEditModalVisible(false)
    editForm.resetFields()
  }
  
  const handleDelete = (id) => {
    const updatedChildren = children.filter(child => child.id !== id)
    setChildren(updatedChildren)
    // 保存更新后的孩子列表到localStorage
    localStorage.setItem('children', JSON.stringify(updatedChildren))
  }
  
  const columns = [
    {
      title: '孩子姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      ellipsis: true
    },
    {
      title: '辅导科目',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{
          padding: '5px 12px',
          borderRadius: 15,
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: status === 'active' ? '#d4edda' : '#f8d7da',
          color: status === 'active' ? '#155724' : '#721c24'
        }}>
          {status === 'active' ? '活跃' : '未活跃'}
        </span>
      )
    },
    {
      title: '辅导状态',
      dataIndex: 'tutoringStatus',
      key: 'tutoringStatus',
      render: (tutoringStatus) => (
        <span style={{
          padding: '5px 12px',
          borderRadius: 15,
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: tutoringStatus === '进行中' ? '#d4edda' : '#fff3cd',
          color: tutoringStatus === '进行中' ? '#155724' : '#856404'
        }}>
          {tutoringStatus}
        </span>
      )
    },
    {
      title: '辅导老师',
      dataIndex: 'teacher',
      key: 'teacher',
      ellipsis: true,
      render: (teacher) => (
        <span>{teacher || '无'}</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 10 }}>
          <Button 
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: '1em',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F57C00'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF9800'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Button 
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: '1em',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F57C00'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF9800'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ]
  
  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 孩子管理标题栏 */}
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
        <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>孩子管理</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>欢迎，王家长</span>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#FF9800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>王</div>
        </div>
      </div>

      {/* 添加孩子表单 */}
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 20,
          marginBottom: 30,
          backgroundColor: '#fff'
        }}
      >
        <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>添加孩子</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddChild}
        >
          <Form.Item
            name="name"
            label="孩子姓名"
            rules={[{ required: true, message: '请输入孩子姓名' }]}
          >
            <Input 
              placeholder="请输入孩子姓名" 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                padding: '12px',
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }} 
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FF9800'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请选择年级' }]}
          >
            <Select 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }}
            >
              <Option value="一年级">一年级</Option>
              <Option value="二年级">二年级</Option>
              <Option value="三年级">三年级</Option>
              <Option value="四年级">四年级</Option>
              <Option value="五年级">五年级</Option>
              <Option value="六年级">六年级</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="subject"
            label="需要辅导的科目"
            rules={[{ required: true, message: '请选择辅导科目' }]}
          >
            <Select 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }}
            >
              <Option value="数学">数学</Option>
              <Option value="语文">语文</Option>
              <Option value="英语">英语</Option>
              <Option value="物理">物理</Option>
              <Option value="化学">化学</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{ 
                backgroundColor: '#FF9800', 
                color: 'white', 
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: '1em',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F57C00'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF9800'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              添加孩子
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      {/* 孩子列表 */}
      <div style={{
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Table 
          columns={columns} 
          dataSource={children} 
          rowKey="id"
          style={{ width: '100%' }}
          pagination={false}
          components={{
            header: {
              wrapper: (props) => {
                return (
                  <thead style={{ backgroundColor: '#f5f5f5' }}>
                    {props.children}
                  </thead>
                )
              },
              cell: (props) => {
                return (
                  <th {...props} style={{ ...props.style, textAlign: 'left' }}>
                    {props.children}
                  </th>
                )
              }
            },
            body: {
              row: (props) => {
                return (
                  <tr 
                    {...props}
                    style={{
                      transition: 'all 0.3s ease',
                      ...props.style
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9f9f9'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {props.children}
                  </tr>
                )
              }
            }
          }}
          columnProps={{
            style: {
              padding: '15px',
              borderBottom: '1px solid #e0e0e0',
              textAlign: 'left'
            }
          }}
        />
      </div>
      
      {/* 编辑孩子模态框 */}
      <Modal
        title="编辑孩子信息"
        open={isEditModalVisible}
        onCancel={handleCancelEdit}
        footer={null}
        style={{
          borderRadius: 10,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateChild}
        >
          <Form.Item
            name="name"
            label="孩子姓名"
            rules={[{ required: true, message: '请输入孩子姓名' }]}
          >
            <Input 
              placeholder="请输入孩子姓名" 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                padding: '12px',
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }} 
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FF9800'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请选择年级' }]}
          >
            <Select 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }}
            >
              <Option value="一年级">一年级</Option>
              <Option value="二年级">二年级</Option>
              <Option value="三年级">三年级</Option>
              <Option value="四年级">四年级</Option>
              <Option value="五年级">五年级</Option>
              <Option value="六年级">六年级</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="subject"
            label="需要辅导的科目"
            rules={[{ required: true, message: '请选择辅导科目' }]}
          >
            <Select 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }}
            >
              <Option value="数学">数学</Option>
              <Option value="语文">语文</Option>
              <Option value="英语">英语</Option>
              <Option value="物理">物理</Option>
              <Option value="化学">化学</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }}
            >
              <Option value="active">活跃</Option>
              <Option value="inactive">未活跃</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="tutoringStatus"
            label="辅导状态"
            rules={[{ required: true, message: '请选择辅导状态' }]}
          >
            <Select 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }}
            >
              <Option value="未进行">未进行</Option>
              <Option value="进行中">进行中</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="teacher"
            label="辅导老师"
          >
            <Input 
              placeholder="请输入辅导老师姓名（如果有）" 
              style={{ 
                border: '2px solid #e0e0e0', 
                borderRadius: 8, 
                padding: '12px',
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }} 
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FF9800'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </Form.Item>
          <Form.Item style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleCancelEdit}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: '1em',
                border: '1px solid #e0e0e0',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{ 
                backgroundColor: '#FF9800', 
                color: 'white', 
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: '1em',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F57C00'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF9800'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default ChildManagement

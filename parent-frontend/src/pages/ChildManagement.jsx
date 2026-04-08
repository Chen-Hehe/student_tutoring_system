import { useState } from 'react'
import { Card, Form, Input, Select, Button, Table } from 'antd'
const { Option } = Select
const ChildManagement = () => {
  const [form] = Form.useForm()
  const [children, setChildren] = useState([
    { id: 1, name: '小明', grade: '三年级', subject: '数学', status: 'active' },
    { id: 2, name: '小红', grade: '四年级', subject: '语文', status: 'active' }
  ])
  
  const handleAddChild = (values) => {
    const newChild = {
      id: children.length + 1,
      name: values.name,
      grade: values.grade,
      subject: values.subject,
      status: 'active'
    }
    setChildren([...children, newChild])
    form.resetFields()
  }
  
  const handleEdit = (id) => {
    console.log('Edit child:', id)
  }
  
  const handleDelete = (id) => {
    setChildren(children.filter(child => child.id !== id))
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
    </div>
  )
}
export default ChildManagement

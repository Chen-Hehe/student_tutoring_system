import { useState } from 'react'
import { Card, Form, Input, Select, Button, Table, Tag } from 'antd'
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
      key: 'name'
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: '辅导科目',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '未活跃'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button 
            style={{ marginRight: 10, backgroundColor: '#FF9800', color: 'white', fontWeight: 'bold' }}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Button 
            style={{ backgroundColor: '#FF9800', color: 'white', fontWeight: 'bold' }}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ]
  
  return (
    <div>
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 20,
          marginBottom: 30
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
            <Input placeholder="请输入孩子姓名" style={{ border: '2px solid #e0e0e0', borderRadius: 8, padding: '12px' }} />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请选择年级' }]}
          >
            <Select style={{ border: '2px solid #e0e0e0', borderRadius: 8, padding: '4px' }}>
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
            <Select style={{ border: '2px solid #e0e0e0', borderRadius: 8, padding: '4px' }}>
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
                fontSize: '1em'
              }}
            >
              添加孩子
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          overflow: 'hidden'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={children} 
          rowKey="id"
          style={{ width: '100%' }}
          pagination={false}
        />
      </Card>
    </div>
  )
}
export default ChildManagement

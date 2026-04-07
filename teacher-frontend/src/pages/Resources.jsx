import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Table, Button, Tag, Input, Space, Modal, message, Upload, Form, Select } from 'antd'
import { PlusOutlined, UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { resourcesAPI } from '../services/resourceApi'

const { TextArea } = Input
const { Option } = Select

const Resources = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (currentUser?.id) {
      loadResources()
    }
  }, [currentUser?.id])

  const loadResources = async () => {
    setLoading(true)
    try {
      const result = await resourcesAPI.getList()
      setResources(result.data || [])
    } catch (error) {
      console.error('加载资源列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      // TODO: 实现文件上传到 OSS
      message.info('文件上传功能待实现')
      return false
    } catch (error) {
      message.error('上传失败')
      return false
    } finally {
      setUploading(false)
    }
  }

  const handleAddResource = async (values) => {
    try {
      await resourcesAPI.create({
        ...values,
        uploaderId: currentUser.id
      })
      message.success('添加成功')
      setModalVisible(false)
      form.resetFields()
      loadResources()
    } catch (error) {
      message.error('添加失败')
    }
  }

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个资源吗？',
      onOk: async () => {
        try {
          await resourcesAPI.delete(id)
          message.success('删除成功')
          loadResources()
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }

  const typeMap = {
    document: { text: '文档', color: 'blue' },
    video: { text: '视频', color: 'red' },
    audio: { text: '音频', color: 'green' }
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={typeMap[type]?.color}>
          {typeMap[type]?.text || type}
        </Tag>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: '上传者',
      dataIndex: 'uploaderName',
      key: 'uploaderName'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time) => new Date(time).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => window.open(record.url, '_blank')}
          >
            查看
          </Button>
          {record.uploaderId === currentUser?.id && (
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>📚 教学资源</h2>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              添加资源
            </Button>
            <Upload
              accept="*"
              showUploadList={false}
              beforeUpload={handleUpload}
            >
              <Button icon={<UploadOutlined />}>
                上传文件
              </Button>
            </Upload>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={resources}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个资源`
          }}
        />
      </Card>

      {/* 添加资源弹窗 */}
      <Modal
        title="添加教学资源"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        confirmLoading={uploading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddResource}
        >
          <Form.Item
            name="title"
            label="资源标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入资源标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入资源描述" />
          </Form.Item>

          <Form.Item
            name="type"
            label="资源类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Option value="document">文档</Option>
              <Option value="video">视频</Option>
              <Option value="audio">音频</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
          >
            <Select placeholder="请选择分类">
              <Option value="math">数学</Option>
              <Option value="chinese">语文</Option>
              <Option value="english">英语</Option>
              <Option value="physics">物理</Option>
              <Option value="chemistry">化学</Option>
              <Option value="biology">生物</Option>
              <Option value="history">历史</Option>
              <Option value="geography">地理</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="url"
            label="资源链接"
            rules={[{ required: true, message: '请输入资源链接' }]}
          >
            <Input placeholder="请输入资源链接（URL）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Resources

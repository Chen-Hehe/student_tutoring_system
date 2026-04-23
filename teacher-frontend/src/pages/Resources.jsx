import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Table, Button, Tag, Input, Space, Modal, message, Upload, Form, Select, Typography, Row, Col, Statistic } from 'antd'
import { PlusOutlined, UploadOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined, VideoCameraOutlined, AudioOutlined } from '@ant-design/icons'

import { resourcesAPI } from '../services/resourceApi'
import { userAPI } from '../services/userApi'

const { TextArea } = Input
const { Option } = Select
const { Title } = Typography

const Resources = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [teachers, setTeachers] = useState({})

  useEffect(() => {
    if (currentUser?.id) {
      loadResources()
      loadTeachers()
    }
  }, [currentUser?.id])

  const loadTeachers = async () => {
    try {
      const result = await userAPI.getUsers(1)
      const teacherMap = {}
      // 检查响应结构，确保正确获取教师列表
      const teachersList = result.data?.data || result.data || result || []
      teachersList.forEach(teacher => {
        teacherMap[teacher.id] = teacher.name || teacher.username
      })
      setTeachers(teacherMap)
    } catch (error) {
      console.error('加载教师列表失败:', error)
    }
  }

  const loadResources = async () => {
    setLoading(true)
    try {
      console.log('开始加载资源列表')
      const result = await resourcesAPI.getList()
      console.log('资源列表加载成功:', result)
      setResources(result.data || [])
    } catch (error) {
      console.error('加载资源列表失败:', error)
      console.error('错误详情:', error.response)
      message.error('加载资源列表失败：' + (error.message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  const handleAddResource = async (values) => {
    if (fileList.length === 0) {
      message.warning('请选择要上传的文件')
      return
    }

    // 直接使用 fileList[0]，因为 beforeUpload 中已经保存了原始 file 对象
    const file = fileList[0]
    if (!file) {
      message.warning('文件无效')
      return
    }

    setUploading(true)
    try {
      console.log('【DEBUG】开始上传资源:', { ...values, fileName: file.name, fileSize: file.size })
      
      const result = await resourcesAPI.uploadResource(
        file,
        values.title,
        values.description || '',
        values.type,
        values.category,
        currentUser.id
      )
      
      console.log('【DEBUG】上传成功:', result)
      
      message.success('资源添加成功')
      setModalVisible(false)
      form.resetFields()
      setFileList([])
      loadResources()
    } catch (error) {
      console.error('【DEBUG】上传失败:', error)
      message.error('上传失败：' + (error.response?.data?.message || error.message))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个资源吗？',
      okText: '确认',
      cancelText: '取消',
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

  const typeConfig = {
    document: { text: '文档', color: 'blue', icon: <FileTextOutlined /> },
    video: { text: '视频', color: 'red', icon: <VideoCameraOutlined /> },
    audio: { text: '音频', color: 'green', icon: <AudioOutlined /> },
    other: { text: '其他', color: 'default', icon: <FileTextOutlined /> }
  }

  const categoryConfig = {
    math: '数学',
    chinese: '语文',
    english: '英语',
    physics: '物理',
    chemistry: '化学',
    biology: '生物',
    history: '历史',
    geography: '地理',
    politics: '政治',
    other: '其他'
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer" onClick={(e) => {
          e.preventDefault()
          window.open(record.url, '_blank')
          // 增加下载次数
          resourcesAPI.incrementDownloadCount(record.id).catch(console.error)
        }}>
          {text}
        </a>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const config = typeConfig[type] || typeConfig.other
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        )
      }
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => categoryConfig[category] || category
    },
    {
      title: '上传者',
      dataIndex: 'uploaderId',
      key: 'uploaderId',
      render: (id) => teachers[id] || `教师${id}`
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size) => {
        if (!size) return '-'
        if (size < 1024) return size + ' B'
        if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
        return (size / (1024 * 1024)).toFixed(2) + ' MB'
      }
    },
    {
      title: '下载次数',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      render: (count) => count || 0
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time) => time ? new Date(time).toLocaleString('zh-CN') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              window.open(record.url, '_blank')
              resourcesAPI.incrementDownloadCount(record.id).catch(console.error)
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      )
    }
  ]

  // 文件上传配置
  const uploadProps = {
    onRemove: (file) => {
      setFileList((prev) => {
        const index = prev.indexOf(file)
        const newFileList = prev.slice()
        newFileList.splice(index, 1)
        return newFileList
      })
    },
    beforeUpload: (file) => {
      // 自动检测文件类型
      const fileType = detectFileType(file)
      console.log('【DEBUG】选择文件:', file.name, '类型:', fileType, '大小:', file.size)
      
      setFileList([file])
      
      // 自动填充类型字段
      form.setFieldsValue({ type: fileType })
      
      return false // 阻止自动上传
    },
    fileList,
    maxCount: 1
  }

  const detectFileType = (file) => {
    const type = file.type
    const name = file.name.toLowerCase()
    
    if (type.startsWith('video/') || name.endsWith('.mp4') || name.endsWith('.avi')) {
      return 'video'
    }
    if (type.startsWith('audio/') || name.endsWith('.mp3') || name.endsWith('.wav')) {
      return 'audio'
    }
    if (type.startsWith('application/') || type.startsWith('text/') || 
        name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx') || 
        name.endsWith('.ppt') || name.endsWith('.pptx')) {
      return 'document'
    }
    return 'other'
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Statistic 
              title="资源总数" 
              value={resources.length} 
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="文档" 
              value={resources.filter(r => r.type === 'document').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="视频/音频" 
              value={resources.filter(r => r.type === 'video' || r.type === 'audio').length}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
        </Row>

        <div style={{ marginBottom: 16 }}>
          <Title level={4}>教学资源管理</Title>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setModalVisible(true)}
            disabled={uploading}
          >
            添加资源
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={resources}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 添加资源弹窗 */}
      <Modal
        title="添加教学资源"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
          setFileList([])
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddResource}
          initialValues={{
            type: 'document',
            category: 'math'
          }}
        >
          <Form.Item
            name="title"
            label="资源标题"
            rules={[{ required: true, message: '请输入资源标题' }]}
          >
            <Input placeholder="例如：二次函数讲解课件" />
          </Form.Item>

          <Form.Item
            name="description"
            label="资源描述"
          >
            <TextArea 
              rows={3} 
              placeholder="简要描述这个教学资源的内容和用途"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="资源类型"
            rules={[{ required: true, message: '请选择资源类型' }]}
          >
            <Select>
              <Option value="document">📄 文档</Option>
              <Option value="video">🎬 视频</Option>
              <Option value="audio">🎵 音频</Option>
              <Option value="other">📦 其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="学科分类"
            rules={[{ required: true, message: '请选择学科分类' }]}
          >
            <Select>
              <Option value="math">数学</Option>
              <Option value="chinese">语文</Option>
              <Option value="english">英语</Option>
              <Option value="physics">物理</Option>
              <Option value="chemistry">化学</Option>
              <Option value="biology">生物</Option>
              <Option value="history">历史</Option>
              <Option value="geography">地理</Option>
              <Option value="politics">政治</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="上传文件"
            rules={[{ required: true, message: '请选择要上传的文件' }]}
          >
            <Upload.Dragger {...uploadProps} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.avi,.mov,.mp3,.wav,.zip,.rar">
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个文件上传，自动识别文件类型<br/>
                支持格式：PDF、Word、PPT、Excel、MP4、AVI、MP3 等
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={uploading}>
                上传
              </Button>
              <Button onClick={() => {
                setModalVisible(false)
                form.resetFields()
                setFileList([])
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Resources

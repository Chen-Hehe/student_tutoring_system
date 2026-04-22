import { useState, useEffect } from 'react'
import { Card, Tabs, Input, Select, Button, Table, Tag, Space, Row, Col, message, Modal, Form, Input as AntInput } from 'antd'
import { adminAPI } from '../services/adminApi'

const { Option } = Select

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [resources, setResources] = useState([])
  const [learningMaterials, setLearningMaterials] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [announcementsLoading, setAnnouncementsLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    type: '',
    teacher: ''
  })
  const [materialsSearchParams, setMaterialsSearchParams] = useState({
    keyword: '',
    subject: ''
  })
  const [announcementsSearchParams, setAnnouncementsSearchParams] = useState({
    keyword: '',
    status: ''
  })
  const [teachers, setTeachers] = useState({})
  
  // 编辑和删除相关状态
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [editForm] = Form.useForm()
  const [createForm] = Form.useForm()
  const [currentTab, setCurrentTab] = useState('1')

  // 获取教师信息
  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getUsers(1, 100, 1) // 获取所有教师
      if (response && (response.code === 200 || response.success)) {
        const teacherMap = {}
        response.data.list.forEach(teacher => {
          teacherMap[teacher.id] = teacher.name || teacher.username
        })
        setTeachers(teacherMap)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  // 获取教学资源列表
  const fetchResources = async () => {
    setLoading(true)
    try {
      let keywordParam = searchParams.keyword || undefined
      let typeParam = searchParams.type || undefined
      let uploaderIdParam = searchParams.teacher || undefined
      
      const response = await adminAPI.getResources(keywordParam, typeParam, uploaderIdParam)
      if (response && (response.code === 200 || response.success)) {
        setResources(response.data)
      }
    } catch (error) {
      message.error('获取教学资源失败')
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取学习资料列表
  const fetchLearningMaterials = async () => {
    setMaterialsLoading(true)
    try {
      let keywordParam = materialsSearchParams.keyword || undefined
      let subjectParam = materialsSearchParams.subject || undefined
      
      const response = await adminAPI.getLearningMaterials(keywordParam, subjectParam)
      if (response && (response.code === 200 || response.success)) {
        setLearningMaterials(response.data)
      }
    } catch (error) {
      message.error('获取学习资料失败')
      console.error('Error fetching learning materials:', error)
    } finally {
      setMaterialsLoading(false)
    }
  }

  // 获取公告列表
  const fetchAnnouncements = async () => {
    setAnnouncementsLoading(true)
    try {
      let keywordParam = announcementsSearchParams.keyword || undefined
      let statusParam = announcementsSearchParams.status || undefined
      
      const response = await adminAPI.getAnnouncements(keywordParam, statusParam)
      if (response && (response.code === 200 || response.success)) {
        setAnnouncements(response.data)
      }
    } catch (error) {
      message.error('获取公告列表失败')
      console.error('Error fetching announcements:', error)
    } finally {
      setAnnouncementsLoading(false)
    }
  }

  // 组件加载时获取资源和教师信息
  useEffect(() => {
    fetchTeachers()
    if (activeTab === '1') {
      fetchResources()
    } else if (activeTab === '2') {
      fetchLearningMaterials()
    } else if (activeTab === '3') {
      fetchAnnouncements()
    }
  }, [activeTab])
  
  // 编辑功能
  const handleEdit = (record) => {
    setCurrentItem(record)
    setCurrentTab(activeTab)
    setIsEditModalVisible(true)
    // 根据当前标签页设置表单初始值
    if (activeTab === '1') {
      // 教学资源
      editForm.setFieldsValue({
        title: record.title,
        type: record.type,
        description: record.description || ''
      })
    } else if (activeTab === '2') {
      // 学习资料
      editForm.setFieldsValue({
        title: record.title,
        subject: record.subject,
        grade: record.grade,
        type: record.type
      })
    } else if (activeTab === '3') {
      // 公告
      editForm.setFieldsValue({
        title: record.title,
        content: record.content,
        status: record.status
      })
    }
  }
  
  // 删除功能
  const handleDelete = (record) => {
    setCurrentItem(record)
    setCurrentTab(activeTab)
    setIsDeleteModalVisible(true)
  }
  
  // 确认删除
  const confirmDelete = async () => {
    try {
      if (currentTab === '1') {
        // 删除教学资源
        await adminAPI.deleteResource(currentItem.id)
        message.success('教学资源删除成功')
      } else if (currentTab === '2') {
        // 删除学习资料
        await adminAPI.deleteLearningMaterial(currentItem.id)
        message.success('学习资料删除成功')
      } else if (currentTab === '3') {
        // 删除公告
        await adminAPI.deleteAnnouncement(currentItem.id)
        message.success('公告删除成功')
      }
      setIsDeleteModalVisible(false)
      // 重新获取列表
      if (currentTab === '1') {
        fetchResources()
      } else if (currentTab === '2') {
        fetchLearningMaterials()
      } else if (currentTab === '3') {
        fetchAnnouncements()
      }
    } catch (error) {
      message.error('删除失败')
      console.error('Error deleting item:', error)
    }
  }
  
  // 保存编辑
  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields()
      if (currentTab === '1') {
        // 编辑教学资源
        await adminAPI.editResource({ ...values, id: currentItem.id })
        message.success('教学资源编辑成功')
      } else if (currentTab === '2') {
        // 编辑学习资料
        await adminAPI.editLearningMaterial({ ...values, id: currentItem.id })
        message.success('学习资料编辑成功')
      } else if (currentTab === '3') {
        // 编辑公告
        await adminAPI.editAnnouncement({ ...values, id: currentItem.id })
        message.success('公告编辑成功')
      }
      setIsEditModalVisible(false)
      // 重新获取列表
      if (currentTab === '1') {
        fetchResources()
      } else if (currentTab === '2') {
        fetchLearningMaterials()
      } else if (currentTab === '3') {
        fetchAnnouncements()
      }
    } catch (error) {
      message.error('编辑失败')
      console.error('Error saving edit:', error)
    }
  }
  
  // 发布公告
  const handleCreateAnnouncement = () => {
    setIsCreateModalVisible(true)
    createForm.resetFields()
  }
  
  // 保存发布公告
  const handleSaveCreate = async () => {
    try {
      const values = await createForm.validateFields()
      await adminAPI.createAnnouncement(values)
      message.success('公告发布成功')
      setIsCreateModalVisible(false)
      fetchAnnouncements()
    } catch (error) {
      message.error('发布失败')
      console.error('Error creating announcement:', error)
    }
  }

  const columns = [
    { title: '序号', key: 'index', width: 80, render: (_, __, index) => index + 1 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type', 
      render: (type) => {
        const typeMap = {
          courseware: { color: '#1976D2', text: '课件', className: 'type-courseware' },
          lesson_plan: { color: '#388E3C', text: '教案', className: 'type-lesson-plan' },
          exercise: { color: '#F57C00', text: '习题', className: 'type-exercise' },
          video: { color: '#7B1FA2', text: '视频', className: 'type-video' },
          other: { color: '#00838F', text: '其他', className: 'type-other' }
        }
        const typeInfo = typeMap[type] || { color: '#999', text: '未知', className: 'type-unknown' }
        return <Tag color={typeInfo.color} className={typeInfo.className} style={{ fontSize: '14px', padding: '2px 8px' }}>{typeInfo.text}</Tag>
      }
    },
    { 
      title: '上传教师', 
      dataIndex: 'uploaderId', 
      key: 'uploaderId',
      render: (uploaderId) => {
        return teachers[uploaderId] || uploaderId || '未知'
      }
    },
    { 
      title: '上传时间', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (createdAt) => {
        return createdAt ? new Date(createdAt).toLocaleString() : '未知'
      }
    },
    { 
      title: '下载次数', 
      dataIndex: 'downloadCount', 
      key: 'downloadCount',
      render: () => 0 // 暂时返回0，实际应该从数据库获取
    },
    { 
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '14px', padding: '4px 12px' }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            danger
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white', fontSize: '14px', padding: '4px 12px' }}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const materialColumns = [
    { title: '序号', key: 'index', width: 80, render: (_, __, index) => index + 1 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '学科', dataIndex: 'subject', key: 'subject' },
    { title: '年级', dataIndex: 'grade', key: 'grade' },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => {
        const typeMap = {
          document: { color: '#1976D2', text: '文档', className: 'type-document' },
          video: { color: '#7B1FA2', text: '视频', className: 'type-video' },
          audio: { color: '#388E3C', text: '音频', className: 'type-audio' },
          image: { color: '#F57C00', text: '图片', className: 'type-image' },
          other: { color: '#00838F', text: '其他', className: 'type-other' }
        }
        const typeInfo = typeMap[type] || { color: '#999', text: '未知', className: 'type-unknown' }
        return <Tag color={typeInfo.color} className={typeInfo.className} style={{ fontSize: '14px', padding: '2px 8px' }}>{typeInfo.text}</Tag>
      }
    },
    { title: '浏览次数', dataIndex: 'viewCount', key: 'viewCount' },
    { title: '下载次数', dataIndex: 'downloadCount', key: 'downloadCount' },
    { 
      title: '上传教师', 
      dataIndex: 'uploaderId', 
      key: 'uploaderId',
      render: (uploaderId) => {
        return teachers[uploaderId] || uploaderId || '未知'
      }
    },
    { 
      title: '上传时间', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (createdAt) => {
        return createdAt ? new Date(createdAt).toLocaleString() : '未知'
      }
    },
    { 
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '14px', padding: '4px 12px' }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            danger
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white', fontSize: '14px', padding: '4px 12px' }}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const announcementColumns = [
    { title: '序号', key: 'index', width: 80, render: (_, __, index) => index + 1 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: '发布者', dataIndex: 'authorId', key: 'authorId',
      render: (authorId) => {
        if (authorId === 1) {
          return '管理员'
        }
        return teachers[authorId] || authorId || '未知'
      }
    },
    { 
      title: '发布时间', 
      dataIndex: 'publishDate', 
      key: 'publishDate',
      render: (publishDate) => {
        return publishDate ? new Date(publishDate).toLocaleString() : '未知'
      }
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const statusMap = {
          published: { color: '#52c41a', text: '已发布' },
          draft: { color: '#faad14', text: '草稿' },
          archived: { color: '#999', text: '已归档' }
        }
        const statusInfo = statusMap[status] || { color: '#999', text: '未知' }
        return <Tag color={statusInfo.color} style={{ fontSize: '14px', padding: '2px 8px' }}>{statusInfo.text}</Tag>
      }
    },
    { title: '浏览次数', dataIndex: 'viewCount', key: 'viewCount' },
    { 
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '14px', padding: '4px 12px' }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            danger
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white', fontSize: '14px', padding: '4px 12px' }}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 20, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div 
            onClick={() => setActiveTab('1')}
            style={{
              backgroundColor: activeTab === '1' ? '#9C27B0' : 'white',
              color: activeTab === '1' ? 'white' : '#333',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              minWidth: '100px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: activeTab === '1' ? '2px solid #9C27B0' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== '1') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.color = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== '1') {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#333';
              }
            }}
          >
            教学资源
          </div>
          <div 
            onClick={() => setActiveTab('2')}
            style={{
              backgroundColor: activeTab === '2' ? '#9C27B0' : 'white',
              color: activeTab === '2' ? 'white' : '#333',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              minWidth: '100px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: activeTab === '2' ? '2px solid #9C27B0' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== '2') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.color = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== '2') {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#333';
              }
            }}
          >
            学习资料
          </div>
          <div 
            onClick={() => setActiveTab('3')}
            style={{
              backgroundColor: activeTab === '3' ? '#9C27B0' : 'white',
              color: activeTab === '3' ? 'white' : '#333',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              minWidth: '100px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: activeTab === '3' ? '2px solid #9C27B0' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== '3') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.color = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== '3') {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#333';
              }
            }}
          >
            公告管理
          </div>

        </div>
      </Card>
      
      {/* 教学资源标签页 */}
      {activeTab === '1' && (
        <>
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 20, padding: 20, borderRadius: 12 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>搜索:</span>
                <Input 
                  placeholder="输入资源标题" 
                  style={{ width: 250, fontSize: '16px', padding: '8px 12px' }}
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                />
              </Col>
              <Col>
                <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>资源类型:</span>
                <Select 
                  style={{ width: 150, fontSize: '16px' }} 
                  value={searchParams.type}
                  onChange={(value) => setSearchParams({ ...searchParams, type: value })}
                >
                  <Option value="" style={{ fontSize: '16px' }}>全部</Option>
                  <Option value="courseware" style={{ fontSize: '16px' }}>课件</Option>
                  <Option value="lesson_plan" style={{ fontSize: '16px' }}>教案</Option>
                  <Option value="exercise" style={{ fontSize: '16px' }}>习题</Option>
                  <Option value="video" style={{ fontSize: '16px' }}>视频</Option>
                  <Option value="other" style={{ fontSize: '16px' }}>其他</Option>
                </Select>
              </Col>
              <Col>
                <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>教师:</span>
                <Select 
                  style={{ width: 150, fontSize: '16px' }} 
                  value={searchParams.teacher}
                  onChange={(value) => setSearchParams({ ...searchParams, teacher: value })}
                >
                  <Option value="" style={{ fontSize: '16px' }}>全部</Option>
                  {Object.entries(teachers).map(([id, name]) => (
                    <Option key={id} value={id} style={{ fontSize: '16px' }}>{name}</Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Button 
                  style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}
                  onClick={fetchResources}
                >
                  搜索
                </Button>
              </Col>
              <Col>
                <Button 
                  style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}
                  onClick={() => {
                    setSearchParams({ keyword: '', type: '', teacher: '' })
                    setTimeout(() => fetchResources(), 0)
                  }}
                >
                  重置
                </Button>
              </Col>
            </Row>
          </Card>
          
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.6em', fontWeight: 'bold' }}>教学资源列表</h3>
            <Table 
              columns={columns} 
              dataSource={resources} 
              rowKey="id"
              size="middle"
              style={{ fontSize: '16px', marginBottom: '20px' }}
              loading={loading}
              pagination={false}
            />
            
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
              <span style={{ margin: '0 5px', cursor: 'pointer', fontSize: '14px' }}>2</span>
              <span style={{ margin: '0 5px', cursor: 'pointer', fontSize: '14px' }}>3</span>
              <span style={{ margin: '0 8px', cursor: 'pointer', fontSize: '14px' }}>下一页</span>
            </div>
          </Card>
        </>
      )}
      
      {/* 学习资料标签页 */}
      {activeTab === '2' && (
        <>
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 20, padding: 20, borderRadius: 12 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>搜索:</span>
                <Input 
                  placeholder="输入资料标题" 
                  style={{ width: 250, fontSize: '16px', padding: '8px 12px' }}
                  value={materialsSearchParams.keyword}
                  onChange={(e) => setMaterialsSearchParams({ ...materialsSearchParams, keyword: e.target.value })}
                />
              </Col>
              <Col>
                <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>学科:</span>
                <Select 
                  style={{ width: 150, fontSize: '16px' }} 
                  value={materialsSearchParams.subject}
                  onChange={(value) => setMaterialsSearchParams({ ...materialsSearchParams, subject: value })}
                >
                  <Option value="" style={{ fontSize: '16px' }}>全部</Option>
                  <Option value="数学" style={{ fontSize: '16px' }}>数学</Option>
                  <Option value="语文" style={{ fontSize: '16px' }}>语文</Option>
                  <Option value="英语" style={{ fontSize: '16px' }}>英语</Option>
                  <Option value="物理" style={{ fontSize: '16px' }}>物理</Option>
                  <Option value="化学" style={{ fontSize: '16px' }}>化学</Option>
                </Select>
              </Col>
              <Col>
                <Button 
                  style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}
                  onClick={fetchLearningMaterials}
                >
                  搜索
                </Button>
              </Col>
              <Col>
                <Button 
                  style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}
                  onClick={() => {
                    setMaterialsSearchParams({ keyword: '', subject: '' })
                    setTimeout(() => fetchLearningMaterials(), 0)
                  }}
                >
                  重置
                </Button>
              </Col>
            </Row>
          </Card>
          
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.6em', fontWeight: 'bold' }}>学习资料列表</h3>
            <Table 
              columns={materialColumns} 
              dataSource={learningMaterials} 
              rowKey="id"
              size="middle"
              style={{ fontSize: '16px', marginBottom: '20px' }}
              loading={materialsLoading}
              pagination={false}
            />
            
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
              <span style={{ margin: '0 5px', cursor: 'pointer', fontSize: '14px' }}>2</span>
              <span style={{ margin: '0 5px', cursor: 'pointer', fontSize: '14px' }}>3</span>
              <span style={{ margin: '0 8px', cursor: 'pointer', fontSize: '14px' }}>下一页</span>
            </div>
          </Card>
        </>
      )}
      
      {/* 公告管理标签页 */}
      {activeTab === '3' && (
        <>
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 20, padding: 20, borderRadius: 12 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>搜索:</span>
                <Input 
                  placeholder="输入公告标题" 
                  style={{ width: 250, fontSize: '16px', padding: '8px 12px' }}
                  value={announcementsSearchParams.keyword}
                  onChange={(e) => setAnnouncementsSearchParams({ ...announcementsSearchParams, keyword: e.target.value })}
                />
              </Col>
              <Col>
                <span style={{ color: '#333', marginRight: 12, fontWeight: 600, fontSize: '16px' }}>状态:</span>
                <Select 
                  style={{ width: 150, fontSize: '16px' }} 
                  value={announcementsSearchParams.status}
                  onChange={(value) => setAnnouncementsSearchParams({ ...announcementsSearchParams, status: value })}
                >
                  <Option value="" style={{ fontSize: '16px' }}>全部</Option>
                  <Option value="published" style={{ fontSize: '16px' }}>已发布</Option>
                  <Option value="draft" style={{ fontSize: '16px' }}>草稿</Option>
                  <Option value="archived" style={{ fontSize: '16px' }}>已归档</Option>
                </Select>
              </Col>
              <Col>
                <Button 
                  style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}
                  onClick={fetchAnnouncements}
                >
                  搜索
                </Button>
              </Col>
              <Col>
                <Button 
                  style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}
                  onClick={() => {
                    setAnnouncementsSearchParams({ keyword: '', status: '' })
                    setTimeout(() => fetchAnnouncements(), 0)
                  }}
                >
                  重置
                </Button>
              </Col>
              <Col>
                <Button 
                  style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}
                  onClick={handleCreateAnnouncement}
                >
                  发布公告
                </Button>
              </Col>
            </Row>
          </Card>
          
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.6em', fontWeight: 'bold' }}>公告列表</h3>
            <Table 
              columns={announcementColumns} 
              dataSource={announcements} 
              rowKey="id"
              size="middle"
              style={{ fontSize: '16px', marginBottom: '20px' }}
              loading={announcementsLoading}
              pagination={false}
            />
            
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
              <span style={{ margin: '0 5px', cursor: 'pointer', fontSize: '14px' }}>2</span>
              <span style={{ margin: '0 5px', cursor: 'pointer', fontSize: '14px' }}>3</span>
              <span style={{ margin: '0 8px', cursor: 'pointer', fontSize: '14px' }}>下一页</span>
            </div>
          </Card>
        </>
      )}
      
      {/* 编辑模态框 */}
      <Modal
        title={currentTab === '1' ? '编辑教学资源' : currentTab === '2' ? '编辑学习资料' : '编辑公告'}
        open={isEditModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <AntInput style={{ fontSize: '16px' }} />
          </Form.Item>
          
          {currentTab === '1' && (
            <>
              <Form.Item
                name="type"
                label="资源类型"
                rules={[{ required: true, message: '请选择资源类型' }]}
              >
                <Select style={{ width: '100%', fontSize: '16px' }}>
                  <Option value="courseware">课件</Option>
                  <Option value="lesson_plan">教案</Option>
                  <Option value="exercise">习题</Option>
                  <Option value="video">视频</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                label="描述"
              >
                <AntInput.TextArea style={{ fontSize: '16px' }} rows={4} />
              </Form.Item>
            </>
          )}
          
          {currentTab === '2' && (
            <>
              <Form.Item
                name="subject"
                label="学科"
                rules={[{ required: true, message: '请选择学科' }]}
              >
                <Select style={{ width: '100%', fontSize: '16px' }}>
                  <Option value="数学">数学</Option>
                  <Option value="语文">语文</Option>
                  <Option value="英语">英语</Option>
                  <Option value="物理">物理</Option>
                  <Option value="化学">化学</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="grade"
                label="年级"
                rules={[{ required: true, message: '请输入年级' }]}
              >
                <AntInput style={{ fontSize: '16px' }} />
              </Form.Item>
              <Form.Item
                name="type"
                label="资料类型"
                rules={[{ required: true, message: '请选择资料类型' }]}
              >
                <Select style={{ width: '100%', fontSize: '16px' }}>
                  <Option value="document">文档</Option>
                  <Option value="video">视频</Option>
                  <Option value="audio">音频</Option>
                  <Option value="image">图片</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </>
          )}
          
          {currentTab === '3' && (
            <>
              <Form.Item
                name="content"
                label="内容"
                rules={[{ required: true, message: '请输入内容' }]}
              >
                <AntInput.TextArea style={{ fontSize: '16px' }} rows={6} />
              </Form.Item>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select style={{ width: '100%', fontSize: '16px' }}>
                  <Option value="published">已发布</Option>
                  <Option value="draft">草稿</Option>
                  <Option value="archived">已归档</Option>
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      
      {/* 删除确认模态框 */}
      <Modal
        title="确认删除"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="确认删除"
        cancelText="取消"
        okType="danger"
      >
        <p>确定要删除 {currentTab === '1' ? '教学资源' : currentTab === '2' ? '学习资料' : '公告'} 吗？</p>
        <p style={{ marginTop: '8px', color: '#666' }}>删除后将无法恢复。</p>
      </Modal>
      
      {/* 发布公告模态框 */}
      <Modal
        title="发布公告"
        open={isCreateModalVisible}
        onOk={handleSaveCreate}
        onCancel={() => setIsCreateModalVisible(false)}
        width={600}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <AntInput style={{ fontSize: '16px' }} />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <AntInput.TextArea style={{ fontSize: '16px' }} rows={6} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select style={{ width: '100%', fontSize: '16px' }}>
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ContentManagement

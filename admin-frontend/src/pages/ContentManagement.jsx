import { useState, useEffect } from 'react'
import { Card, Tabs, Input, Select, Button, Table, Tag, Space, Row, Col, InputNumber, Modal, Form, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { adminAPI } from '../services/adminApi'
import api from '../services/api'

const { TabPane } = Tabs
const { Option } = Select

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [resources, setResources] = useState([])
  const [learningMaterials, setLearningMaterials] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [carousels, setCarousels] = useState([])
  const [loading, setLoading] = useState(false)
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [announcementsLoading, setAnnouncementsLoading] = useState(false)
  const [carouselsLoading, setCarouselsLoading] = useState(false)
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentCarousel, setCurrentCarousel] = useState(null)
  const [isAddMode, setIsAddMode] = useState(true)
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

  // 获取轮播图列表
  const fetchCarousels = async () => {
    setCarouselsLoading(true)
    try {
      const response = await adminAPI.getCarousels()
      if (response && (response.code === 200 || response.success)) {
        setCarousels(response.data)
      }
    } catch (error) {
      message.error('获取轮播图列表失败')
      console.error('Error fetching carousels:', error)
    } finally {
      setCarouselsLoading(false)
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
    } else if (activeTab === '4') {
      fetchCarousels()
    }
  }, [activeTab])

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
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
      render: () => (
        <Space>
          <Button type="primary" size="small" style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '14px', padding: '4px 12px' }}>编辑</Button>
          <Button size="small" style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '14px', padding: '4px 12px' }}>删除</Button>
          <Button size="small" style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '14px', padding: '4px 12px' }}>下载</Button>
        </Space>
      ),
    },
  ]

  const materialColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
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
      render: () => (
        <Space>
          <Button type="primary" size="small" style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '14px', padding: '4px 12px' }}>编辑</Button>
          <Button size="small" style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '14px', padding: '4px 12px' }}>删除</Button>
          <Button size="small" style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '14px', padding: '4px 12px' }}>下载</Button>
        </Space>
      ),
    },
  ]

  const announcementColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
    {
      title: '发布者', 
      dataIndex: 'authorId', 
      key: 'authorId',
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
      render: () => (
        <Space>
          <Button type="primary" size="small" style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '14px', padding: '4px 12px' }}>编辑</Button>
          <Button size="small" style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '14px', padding: '4px 12px' }}>删除</Button>
        </Space>
      ),
    },
  ]

  // 轮播图相关方法
  const handleAddCarousel = () => {
    setIsAddMode(true)
    setCurrentCarousel(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditCarousel = (carousel) => {
    setIsAddMode(false)
    setCurrentCarousel(carousel)
    form.setFieldsValue({
      title: carousel.title,
      imageUrl: carousel.imageUrl,
      linkUrl: carousel.linkUrl,
      sort: carousel.sort,
      status: carousel.status
    })
  setIsModalVisible(true)
}

  const handleSaveCarousel = async (values) => {
    console.log('开始保存轮播图:', values);
    try {
      // 处理图片URL，确保是相对路径
      let processedValues = { ...values };
      if (processedValues.imageUrl) {
        // 如果是完整的本地文件路径，转换为相对路径
        if (processedValues.imageUrl.startsWith('D:') || processedValues.imageUrl.startsWith('d:')) {
          // 提取相对路径部分
          const relativePath = processedValues.imageUrl.replace(/.*public\\/, '/').replace(/\\/g, '/');
          processedValues.imageUrl = relativePath;
        }
      }
      
      console.log('处理后的值:', processedValues);
      
      // 直接测试保存接口，不使用adminAPI
      console.log('直接调用保存接口...');
      const response = await fetch('http://localhost:8080/api/admin/content/carousels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedValues)
      });
      
      console.log('保存响应状态:', response.status);
      
      const responseData = await response.json();
      console.log('保存响应数据:', responseData);
      
      if (response.ok && (responseData.code === 200 || responseData.success)) {
        message.success('添加轮播图成功');
        setIsModalVisible(false);
        fetchCarousels();
      } else {
        message.error('添加轮播图失败: ' + (responseData.message || '未知错误'));
      }
    } catch (error) {
      console.error('保存轮播图失败:', error);
      console.error('错误堆栈:', error.stack);
      message.error('保存失败，请重试: ' + error.message);
    }
  }

// 测试文件上传
const testUpload = async () => {
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt');
    
    // 使用axios发送请求，这样会经过响应拦截器
    const response = await api.post('/api/admin/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('测试上传响应:', response);
    message.info('测试上传结果: ' + JSON.stringify(response));
  } catch (error) {
    console.error('测试上传失败:', error);
    message.error('测试上传失败: ' + error.message);
  }
};



  const handleDeleteCarousel = async (id) => {
    try {
      const response = await adminAPI.deleteCarousel(id)
      if (response && (response.code === 200 || response.success)) {
        message.success('删除轮播图成功')
        fetchCarousels()
      } else {
        message.error('删除轮播图失败')
      }
    } catch (error) {
      console.error('删除轮播图失败:', error)
      message.error('删除失败，请重试')
    }
  }

  const carouselColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { 
      title: '图片', 
      dataIndex: 'imageUrl', 
      key: 'imageUrl',
      render: (imageUrl) => {
        return imageUrl ? (
          <img src={imageUrl} alt="轮播图" style={{ width: 100, height: 50, objectFit: 'cover' }} />
        ) : '无'
      }
    },
    { title: '链接', dataIndex: 'linkUrl', key: 'linkUrl', ellipsis: true },
    { title: '排序', dataIndex: 'sort', key: 'sort' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        return status === 1 ? (
          <Tag color="#52c41a" style={{ fontSize: '14px', padding: '2px 8px' }}>启用</Tag>
        ) : (
          <Tag color="#999" style={{ fontSize: '14px', padding: '2px 8px' }}>禁用</Tag>
        )
      }
    },
    { 
      title: '创建时间', 
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
            onClick={() => handleEditCarousel(record)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '14px', padding: '4px 12px' }}
            onClick={() => handleDeleteCarousel(record.id)}
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
          <div 
            onClick={() => setActiveTab('4')}
            style={{
              backgroundColor: activeTab === '4' ? '#9C27B0' : 'white',
              color: activeTab === '4' ? 'white' : '#333',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              minWidth: '100px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: activeTab === '4' ? '2px solid #9C27B0' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== '4') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.color = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== '4') {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#333';
              }
            }}
          >
            轮播图
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
              <Col>
                <Button style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}>上传资源</Button>
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
              <Col>
                <Button style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}>上传资料</Button>
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
                <Button style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}>发布公告</Button>
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

      {/* 轮播图标签页 */}
      {activeTab === '4' && (
        <>
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 20, padding: 20, borderRadius: 12 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <Button 
                  style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px' }}
                  onClick={handleAddCarousel}
                >
                  添加轮播图
                </Button>
                <Button 
                  style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', fontSize: '16px', padding: '8px 16px', marginLeft: '10px' }}
                  onClick={testUpload}
                >
                  测试上传
                </Button>
              </Col>
            </Row>
          </Card>
          
          <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.6em', fontWeight: 'bold' }}>轮播图列表</h3>
            <Table 
              columns={carouselColumns} 
              dataSource={carousels} 
              rowKey="id"
              size="middle"
              style={{ fontSize: '16px', marginBottom: '20px' }}
              loading={carouselsLoading}
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

      {/* 轮播图编辑弹窗 */}
      <Modal
        title={isAddMode ? "添加轮播图" : "编辑轮播图"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCarousel}
          onFinishFailed={(errorInfo) => {
            console.log('表单验证失败:', errorInfo);
            message.error('请检查表单填写是否正确');
          }}
          autoComplete="off"
          style={{ width: '100%' }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入轮播图标题" style={{ fontSize: '16px', padding: '8px 12px' }} />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="图片"
            rules={[{ required: true, message: '请输入图片URL' }]}
          >
            <div>
              <Input placeholder="请输入图片URL，例如：/images/carousel/图片文件名.png" style={{ marginBottom: '10px', fontSize: '16px', padding: '8px 12px' }} />
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                或者上传图片：
              </div>
              <Upload.Dragger 
                name="file" 
                action="http://localhost:8080/api/admin/content/upload"
                onChange={(info) => {
                  console.log('上传状态:', info);
                  if (info.file.status === 'done') {
                    console.log('上传成功:', info.file.response);
                    if (info.file.response && (info.file.response.code === 200 || info.file.response.success)) {
                      const fileUrl = info.file.response.data;
                      console.log('文件URL:', fileUrl);
                      form.setFieldsValue({ imageUrl: fileUrl });
                      message.success('上传成功');
                    } else {
                      message.error('上传失败: ' + (info.file.response?.message || '未知错误'));
                    }
                  } else if (info.file.status === 'error') {
                    message.error('上传失败');
                  }
                }}
                listType="picture"
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持 JPG、PNG 格式，建议尺寸 1920x600
                </p>
              </Upload.Dragger>
            </div>
          </Form.Item>
          <Form.Item
            name="linkUrl"
            label="链接URL"
            rules={[{ required: false, message: '请输入链接URL' }]}
          >
            <Input placeholder="请输入轮播图链接URL（可选）" style={{ fontSize: '16px', padding: '8px 12px' }} />
          </Form.Item>
          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序值' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%', fontSize: '16px' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select style={{ fontSize: '16px' }}>
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button 
                style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}
                onClick={() => setIsModalVisible(false)}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '16px', padding: '8px 16px' }}
              >
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ContentManagement

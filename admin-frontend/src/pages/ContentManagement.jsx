import { useState, useEffect } from 'react'
import { Card, Tabs, Input, Select, Button, Table, Tag, Space, Row, Col, message } from 'antd'
import { adminAPI } from '../services/adminApi'

const { TabPane } = Tabs
const { Option } = Select

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [resources, setResources] = useState([])
  const [learningMaterials, setLearningMaterials] = useState([])
  const [loading, setLoading] = useState(false)
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    type: '',
    teacher: ''
  })
  const [materialsSearchParams, setMaterialsSearchParams] = useState({
    keyword: '',
    subject: ''
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

  // 组件加载时获取资源和教师信息
  useEffect(() => {
    fetchTeachers()
    if (activeTab === '1') {
      fetchResources()
    } else if (activeTab === '2') {
      fetchLearningMaterials()
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
    </div>
  )
}

export default ContentManagement

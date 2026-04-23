import { useState, useEffect } from 'react'
import { Card, Input, Button, Select, Grid, Tag, message, Spin, Empty } from 'antd'
import { SearchOutlined, FileTextOutlined, VideoCameraOutlined, AudioOutlined, DesktopOutlined, BookOutlined, FileOutlined } from '@ant-design/icons'
import { resourcesAPI } from '../services/resourceApi'

const { useBreakpoint } = Grid

// 科目映射
const subjectMap = {
  'math': '数学',
  'chinese': '语文',
  'english': '英语',
  'physics': '物理',
  'chemistry': '化学',
  'biology': '生物'
}

// 资源类型映射
const typeMap = {
  'courseware': '课件',
  'lesson_plan': '教案',
  'video': '视频',
  'unknown': '未知'
}

// 资源类型图标
const typeIcons = {
  'courseware': <BookOutlined />,
  'lesson_plan': <FileOutlined />,
  'video': <VideoCameraOutlined />,
  'unknown': <FileTextOutlined />
}

// 资源类型颜色
const typeColors = {
  'courseware': '#4CAF50',
  'lesson_plan': '#2196F3',
  'video': '#FF9800',
  'unknown': '#9E9E9E'
}

const Resources = () => {
  const screens = useBreakpoint()
  
  // 筛选状态
  const [subject, setSubject] = useState('')
  const [type, setType] = useState('')
  const [searchText, setSearchText] = useState('')
  
  // 数据状态
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)

  // 加载资源列表
  const loadResources = async () => {
    setLoading(true)
    try {
      // 构建查询参数（category 使用中文值，与数据库保持一致）
      const params = {}
      if (subject) {
        // 从选择框值映射到中文值
        const subjectMap = {
          'math': '数学',
          'chinese': '语文',
          'english': '英语',
          'physics': '物理',
          'chemistry': '化学',
          'biology': '生物'
        }
        params.category = subjectMap[subject] || subject
      }
      if (type) {
        // 从选择框值映射到英文值，与数据库保持一致
        const typeMap = {
          'document': 'document',
          'video': 'video',
          'audio': 'audio',
          'presentation': 'presentation'
        }
        params.type = typeMap[type] || type
      }
      
      const response = await resourcesAPI.getList(params)
      
      if (response && response.code === 200 && response.data) {
        setResources(response.data)
      } else {
        setResources([])
        message.warning('未找到相关资源')
      }
    } catch (error) {
      console.error('加载资源失败:', error)
      message.error('加载资源失败：' + (error.message || '未知错误'))
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  // 初始加载及筛选条件变化时自动拉取
  useEffect(() => {
    loadResources()
  }, [subject, type])



  // 处理下载
  const handleDownload = async (resource) => {
    try {
      // 先增加下载次数
      await resourcesAPI.incrementDownloadCount(resource.id)
      
      // 打开下载链接（需要使用完整后端 URL，因为 window.open 不经过 Vite 代理）
      const backendUrl = 'http://localhost:8080'
      const downloadUrl = `${backendUrl}${resource.url}`
      window.open(downloadUrl, '_blank')
      
      message.success('资源下载已启动！')
    } catch (error) {
      console.error('下载资源失败:', error)
      message.error('下载失败：' + (error.message || '未知错误'))
    }
  }

  // 前端搜索过滤（仅按标题和描述）
  const filteredResources = resources.filter(resource => {
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      const titleMatch = (resource.title || '').toLowerCase().includes(searchLower)
      const descMatch = (resource.description || '').toLowerCase().includes(searchLower)
      if (!titleMatch && !descMatch) {
        return false
      }
    }
    return true
  })

  return (
    <div style={{ background: '#f0f8f0', padding: 0 }}>
      {/* 学生端标题栏 */}
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
        <h1 style={{ color: '#4CAF50', margin: 0, fontSize: '1.8em' }}>📚 学习资源</h1>
      </div>

      <div style={{ padding: 20 }}>
        {/* 搜索筛选 */}
        <Card 
          style={{ 
            marginBottom: 16,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <Input
            placeholder="搜索学习资源"
            prefix={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={loadResources}
            style={{ marginBottom: 16 }}
            addonAfter={
              <Button type="primary" onClick={loadResources} style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>搜索</Button>
            }
          />
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'end' }}>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>科目</div>
              <Select
                placeholder="全部科目"
                style={{ width: 150 }}
                value={subject}
                onChange={setSubject}
                allowClear
              >
                <Select.Option value="math">数学</Select.Option>
                <Select.Option value="chinese">语文</Select.Option>
                <Select.Option value="english">英语</Select.Option>
                <Select.Option value="physics">物理</Select.Option>
                <Select.Option value="chemistry">化学</Select.Option>
                <Select.Option value="biology">生物</Select.Option>
              </Select>
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>资源类型</div>
              <Select
              placeholder="全部类型"
              style={{ width: 150 }}
              value={type}
              onChange={setType}
              allowClear
            >
              <Select.Option value="courseware">课件</Select.Option>
              <Select.Option value="lesson_plan">教案</Select.Option>
              <Select.Option value="video">视频</Select.Option>
              <Select.Option value="unknown">未知</Select.Option>
            </Select>
            </div>
            <Button 
              onClick={() => {
                setSubject('')
                setType('')
                setSearchText('')
              }}
              style={{ height: 32 }}
            >
              重置
            </Button>
          </div>
        </Card>

        {/* 资源列表 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" tip="加载中..." />
          </div>
        ) : filteredResources.length === 0 ? (
          <Card style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
            <Empty description="暂无学习资源" />
          </Card>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: screens.xs ? '1fr' : screens.sm ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: 16,
          }}>
            {filteredResources.map((resource) => (
              <Card
                key={resource.id}
                hoverable
                style={{ borderRadius: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                cover={
                  <div style={{ 
                    height: 120, 
                    background: `linear-gradient(135deg, ${typeColors[resource.type] || '#4CAF50'} 0%, ${typeColors[resource.type] ? typeColors[resource.type] + '80' : '#81C784'} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 48,
                    color: 'white'
                  }}>
                    {typeIcons[resource.type] || <FileTextOutlined />}
                  </div>
                }
                actions={[
                  <Button 
                    key="download" 
                    type="primary" 
                    onClick={() => handleDownload(resource)}
                    style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
                  >
                    下载
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ flex: 1 }}>{resource.title}</span>
                      <Tag style={{ backgroundColor: '#4CAF50', border: 'none', color: '#fff' }}>{resource.category || resource.subject}</Tag>
                      <Tag style={{ backgroundColor: typeColors[resource.type] || '#4CAF50', border: 'none', color: '#fff' }}>{typeMap[resource.type] || resource.type}</Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                        {resource.fileName || '未知文件'} · {resource.fileSize ? `${(resource.fileSize / 1024).toFixed(1)} KB` : '未知大小'}
                      </div>
                      <div style={{ marginBottom: 8 }}>{resource.description || '暂无描述'}</div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Resources

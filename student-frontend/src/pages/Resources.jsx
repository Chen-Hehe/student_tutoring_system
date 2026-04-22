import { useState, useEffect } from 'react'
import { Card, Input, Button, Select, Grid, Tag, message, Spin, Empty } from 'antd'
import { SearchOutlined, FileTextOutlined, VideoCameraOutlined, AudioOutlined, DesktopOutlined } from '@ant-design/icons'
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
  'document': '文档',
  'video': '视频',
  'audio': '音频',
  'presentation': '演示文稿'
}

// 资源类型图标
const typeIcons = {
  'document': <FileTextOutlined />,
  'video': <VideoCameraOutlined />,
  'audio': <AudioOutlined />,
  'presentation': <DesktopOutlined />
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
      // 构建查询参数（category 使用英文值，与教师端保持一致）
      const params = {}
      if (subject) {
        params.category = subject  // 直接使用英文值：math, chinese, english, etc.
      }
      if (type) {
        params.type = type
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
      
      // 打开下载链接（前端代理会自动处理相对路径）
      window.open(resource.url, '_blank')
      
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
    <div>
      <h1 style={{ marginBottom: 24, color: '#4CAF50' }}>📚 学习资源</h1>

      {/* 搜索筛选 */}
      <Card style={{ marginBottom: 24 }}>
        <Input
          placeholder="搜索学习资源"
          prefix={<SearchOutlined />}
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={loadResources}
          style={{ marginBottom: 16 }}
          addonAfter={
            <Button type="primary" onClick={loadResources}>搜索</Button>
          }
        />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Select
            placeholder="科目"
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
          <Select
            placeholder="资源类型"
            style={{ width: 150 }}
            value={type}
            onChange={setType}
            allowClear
          >
            <Select.Option value="document">文档</Select.Option>
            <Select.Option value="video">视频</Select.Option>
            <Select.Option value="audio">音频</Select.Option>
            <Select.Option value="presentation">演示文稿</Select.Option>
          </Select>

        </div>
      </Card>

      {/* 资源列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="加载中..." />
        </div>
      ) : filteredResources.length === 0 ? (
        <Empty description="暂无学习资源" />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: screens.xs ? '1fr' : screens.sm ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              hoverable
              style={{ borderRadius: 12 }}
              cover={
                <div style={{ 
                  height: 120, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                >
                  下载
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{resource.title}</span>
                    <Tag color="blue">{resource.category || resource.subject}</Tag>
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
  )
}

export default Resources

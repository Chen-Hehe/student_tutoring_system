import { useState } from 'react'
import { Card, Input, Button, Select, Grid, Tag, message } from 'antd'
import { SearchOutlined, FileTextOutlined, VideoCameraOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid

const Resources = () => {
  const screens = useBreakpoint()
  const [subject, setSubject] = useState('')
  const [type, setType] = useState('')
  const [grade, setGrade] = useState('')
  const [searchText, setSearchText] = useState('')

  // 模拟资源数据
  const resources = [
    {
      key: '1',
      title: '分数加减法练习',
      subject: '数学',
      grade: '小学',
      type: 'document',
      description: '包含分数加减法的详细讲解和练习题，适合小学三年级学生使用。',
      tags: ['分数', '加减法', '小学'],
      icon: '📄',
    },
    {
      key: '2',
      title: '作文写作技巧',
      subject: '语文',
      grade: '初中',
      type: 'video',
      description: '详细讲解初中作文的写作技巧和方法，包括审题、立意、结构等方面。',
      tags: ['作文', '写作技巧', '初中'],
      icon: '🎥',
    },
    {
      key: '3',
      title: '英语单词记忆方法',
      subject: '英语',
      grade: '小学',
      type: 'document',
      description: '介绍几种有效的英语单词记忆方法，帮助小学生快速掌握英语单词。',
      tags: ['英语', '单词记忆', '小学'],
      icon: '📄',
    },
    {
      key: '4',
      title: '数学应用题解题思路',
      subject: '数学',
      grade: '初中',
      type: 'video',
      description: '详细讲解初中数学应用题的解题思路和方法，帮助学生提高解题能力。',
      tags: ['数学', '应用题', '初中'],
      icon: '🎥',
    },
  ]

  const handleDownload = (resourceId) => {
    message.loading('资源下载中，请稍候...', 1)
    setTimeout(() => {
      message.success('资源下载成功！')
    }, 1000)
  }

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
          style={{ marginBottom: 16 }}
          addonAfter={
            <Button type="primary">搜索</Button>
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
          <Select
            placeholder="年级"
            style={{ width: 150 }}
            value={grade}
            onChange={setGrade}
            allowClear
          >
            <Select.Option value="primary">小学</Select.Option>
            <Select.Option value="middle">初中</Select.Option>
            <Select.Option value="high">高中</Select.Option>
          </Select>
        </div>
      </Card>

      {/* 资源列表 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screens.xs ? '1fr' : screens.sm ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 24,
      }}>
        {resources.map((resource) => (
          <Card
            key={resource.key}
            hoverable
            style={{ borderRadius: 12 }}
            cover={
              <div style={{ 
                height: 120, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48
              }}>
                {resource.icon}
              </div>
            }
            actions={[
              <Button 
                key="download" 
                type="primary" 
                onClick={() => handleDownload(resource.key)}
              >
                下载
              </Button>,
            ]}
          >
            <Card.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{resource.title}</span>
                  <Tag color="blue">{resource.subject}</Tag>
                </div>
              }
              description={
                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    {resource.grade} · {resource.type === 'document' ? '文档' : '视频'}
                  </div>
                  <div style={{ marginBottom: 8 }}>{resource.description}</div>
                  <div>
                    {resource.tags.map((tag) => (
                      <Tag key={tag} color="green" style={{ marginBottom: 4 }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Resources

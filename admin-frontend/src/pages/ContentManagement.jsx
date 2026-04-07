import { Card, Tabs, Input, Select, Button, Table, Tag, Space, Row, Col } from 'antd'

const { TabPane } = Tabs
const { Option } = Select

const ContentManagement = () => {
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
    { title: '上传教师', dataIndex: 'teacher', key: 'teacher' },
    { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime' },
    { title: '下载次数', dataIndex: 'downloadCount', key: 'downloadCount' },
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

  const data = [
    { id: 1, title: '三年级数学上册课件', type: 'courseware', teacher: '李老师', uploadTime: '2026-03-01', downloadCount: 25 },
    { id: 2, title: '五年级语文阅读技巧', type: 'lesson_plan', teacher: '王老师', uploadTime: '2026-03-02', downloadCount: 18 },
    { id: 3, title: '四年级数学练习题', type: 'exercise', teacher: '李老师', uploadTime: '2026-03-03', downloadCount: 32 },
    { id: 4, title: '六年级作文指导视频', type: 'video', teacher: '王老师', uploadTime: '2026-03-04', downloadCount: 45 },
    { id: 5, title: '小学生心理辅导指南', type: 'other', teacher: '李老师', uploadTime: '2026-03-05', downloadCount: 20 },
  ]

  return (
    <div>
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 20, borderRadius: 12, padding: 20 }}>
        <Tabs defaultActiveKey="1" style={{ marginBottom: 20, fontSize: '16px' }} size="large">
          <TabPane tab="教学资源" key="1" />
          <TabPane tab="学习资料" key="2" />
          <TabPane tab="公告管理" key="3" />
          <TabPane tab="轮播图" key="4" />
        </Tabs>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 20, padding: 20, borderRadius: 12 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <span style={{ fontWeight: 'bold', color: '#555', marginRight: 12, fontSize: '16px' }}>搜索：</span>
            <Input placeholder="输入资源标题" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <span style={{ fontWeight: 'bold', color: '#555', marginRight: 12, fontSize: '16px' }}>资源类型：</span>
            <Select style={{ width: '100%', fontSize: '16px' }} defaultValue="">
              <Option value="" style={{ fontSize: '16px' }}>全部</Option>
              <Option value="courseware" style={{ fontSize: '16px' }}>课件</Option>
              <Option value="lesson_plan" style={{ fontSize: '16px' }}>教案</Option>
              <Option value="exercise" style={{ fontSize: '16px' }}>习题</Option>
              <Option value="video" style={{ fontSize: '16px' }}>视频</Option>
              <Option value="other" style={{ fontSize: '16px' }}>其他</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <span style={{ fontWeight: 'bold', color: '#555', marginRight: 12, fontSize: '16px' }}>教师：</span>
            <Select style={{ width: '100%', fontSize: '16px' }} defaultValue="">
              <Option value="" style={{ fontSize: '16px' }}>全部</Option>
              <Option value="1" style={{ fontSize: '16px' }}>李老师</Option>
              <Option value="2" style={{ fontSize: '16px' }}>王老师</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={10} style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: 'white', fontSize: '16px', padding: '8px 16px' }}>搜索</Button>
            <Button style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: 'white', fontSize: '16px', padding: '8px 16px' }}>重置</Button>
            <Button style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: 'white', fontSize: '16px', padding: '8px 16px' }}>上传资源</Button>
          </Col>
        </Row>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '1.6em', fontWeight: 'bold' }}>教学资源列表</h3>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          size="middle"
          style={{ fontSize: '16px', marginBottom: '20px' }}
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
    </div>
  )
}

export default ContentManagement

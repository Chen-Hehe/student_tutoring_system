import React, { useState } from 'react'
import { Card, Tabs, Input, Select, Button, Row, Col, Slider } from 'antd'

const { TabPane } = Tabs
const { Option } = Select

const AIConfiguration = () => {
  const [subjectWeight, setSubjectWeight] = useState(80)
  const [gradeWeight, setGradeWeight] = useState(70)
  const [experienceWeight, setExperienceWeight] = useState(60)
  const [ratingWeight, setRatingWeight] = useState(50)

  return (
    <div>
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, borderRadius: 12, padding: 20 }}>
        <Tabs defaultActiveKey="1" style={{ marginBottom: 20 }} size="large">
          <TabPane tab="匹配规则" key="1" />
          <TabPane tab="推荐算法" key="2" />
          <TabPane tab="模型配置" key="3" />
          <TabPane tab="日志分析" key="4" />
        </Tabs>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 30, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 30, fontSize: '1.8em' }}>匹配规则配置</h3>
        <Row gutter={[30, 30]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>科目匹配权重</div>
            <Slider 
              min={0} 
              max={100} 
              value={subjectWeight} 
              onChange={setSubjectWeight} 
              style={{ marginBottom: 10 }}
              tipFormatter={(value) => <span style={{ fontSize: '16px' }}>{value}%</span>}
            />
            <div style={{ fontSize: '16px', color: '#666' }}>当前值: {subjectWeight}%</div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>年级匹配权重</div>
            <Slider 
              min={0} 
              max={100} 
              value={gradeWeight} 
              onChange={setGradeWeight} 
              style={{ marginBottom: 10 }}
              tipFormatter={(value) => <span style={{ fontSize: '16px' }}>{value}%</span>}
            />
            <div style={{ fontSize: '16px', color: '#666' }}>当前值: {gradeWeight}%</div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>教师经验权重</div>
            <Slider 
              min={0} 
              max={100} 
              value={experienceWeight} 
              onChange={setExperienceWeight} 
              style={{ marginBottom: 10 }}
              tipFormatter={(value) => <span style={{ fontSize: '16px' }}>{value}%</span>}
            />
            <div style={{ fontSize: '16px', color: '#666' }}>当前值: {experienceWeight}%</div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>教师评分权重</div>
            <Slider 
              min={0} 
              max={100} 
              value={ratingWeight} 
              onChange={setRatingWeight} 
              style={{ marginBottom: 10 }}
              tipFormatter={(value) => <span style={{ fontSize: '16px' }}>{value}%</span>}
            />
            <div style={{ fontSize: '16px', color: '#666' }}>当前值: {ratingWeight}%</div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>最大推荐数量</div>
            <Input type="number" defaultValue={5} min={1} max={10} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>最低匹配分数</div>
            <Input type="number" defaultValue={60} min={0} max={100} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>推荐更新间隔 (小时)</div>
            <Input type="number" defaultValue={24} min={1} max={168} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>匹配有效期 (天)</div>
            <Input type="number" defaultValue={30} min={1} max={90} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
        </Row>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 30, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 30, fontSize: '1.8em' }}>推荐算法配置</h3>
        <div style={{ marginBottom: 30 }}>
          <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>算法类型</div>
          <Select style={{ width: '100%', fontSize: '16px' }} defaultValue="hybrid">
            <Option value="collaborative">协同过滤</Option>
            <Option value="content-based">基于内容</Option>
            <Option value="hybrid">混合推荐</Option>
          </Select>
        </div>
        <div style={{ marginBottom: 30 }}>
          <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>算法参数</div>
          <Input.TextArea 
            defaultValue='{
  "similarity_threshold": 0.7,
  "top_k": 10,
  "alpha": 0.6,
  "beta": 0.4
}' 
            style={{ width: '100%', minHeight: 120, fontFamily: 'monospace', fontSize: '16px', padding: '12px' }}
          />
        </div>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 30, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 30, fontSize: '1.8em' }}>模型配置</h3>
        <Row gutter={[30, 30]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>模型名称</div>
            <Input defaultValue="ai-recommender-v1.0" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>模型API端点</div>
            <Input defaultValue="http://localhost:8000/api/v1/recommend" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>API密钥</div>
            <Input.Password defaultValue="your-api-key-here" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>请求超时 (秒)</div>
            <Input type="number" defaultValue={30} min={5} max={60} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
        </Row>
      </Card>
      
      <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
        <Button style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: 'white', fontSize: '16px', padding: '8px 16px' }}>保存配置</Button>
        <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}>测试配置</Button>
        <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}>恢复默认</Button>
      </div>
    </div>
  )
}

export default AIConfiguration

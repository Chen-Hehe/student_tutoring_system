import React, { useState } from 'react'
import { Card, Input, Select, Button, Row, Col, Slider } from 'antd'
const { Option } = Select

const AIConfiguration = () => {
  const [subjectWeight, setSubjectWeight] = useState(80)
  const [gradeWeight, setGradeWeight] = useState(70)
  const [experienceWeight, setExperienceWeight] = useState(60)
  const [ratingWeight, setRatingWeight] = useState(50)
  const [activeTab, setActiveTab] = useState('1')

  return (
    <div>
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, borderRadius: 12, padding: 20 }}>
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
            匹配规则
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
            推荐算法
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
            模型配置
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
            日志分析
          </div>
        </div>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>匹配规则配置</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>科目匹配权重</div>
            <div style={{ position: 'relative', height: 16, marginBottom: 8 }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 16, 
                backgroundColor: '#f0f0f0', 
                borderRadius: 8 
              }} 
                onClick={(e) => {
                  const rect = e.currentTarget.parentElement.getBoundingClientRect();
                  const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
                  const clampedPosition = Math.max(0, Math.min(100, newPosition));
                  setSubjectWeight(clampedPosition);
                }}
              />
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: `${subjectWeight}%`, 
                  transform: 'translateX(-50%)', 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#9C27B0', 
                  borderRadius: '50%', 
                  cursor: 'pointer' 
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget.parentElement;
                  
                  const handleMouseMove = (moveEvent) => {
                    const rect = container.getBoundingClientRect();
                    const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                    const clampedPosition = Math.max(0, Math.min(100, newPosition));
                    setSubjectWeight(clampedPosition);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>
            <div style={{ fontSize: '16px', color: '#999' }}>当前值: {Math.round(subjectWeight)}%</div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>年级匹配权重</div>
            <div style={{ position: 'relative', height: 16, marginBottom: 8 }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 16, 
                backgroundColor: '#f0f0f0', 
                borderRadius: 8 
              }} 
                onClick={(e) => {
                  const rect = e.currentTarget.parentElement.getBoundingClientRect();
                  const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
                  const clampedPosition = Math.max(0, Math.min(100, newPosition));
                  setGradeWeight(clampedPosition);
                }}
              />
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: `${gradeWeight}%`, 
                  transform: 'translateX(-50%)', 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#9C27B0', 
                  borderRadius: '50%', 
                  cursor: 'pointer' 
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget.parentElement;
                  
                  const handleMouseMove = (moveEvent) => {
                    const rect = container.getBoundingClientRect();
                    const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                    const clampedPosition = Math.max(0, Math.min(100, newPosition));
                    setGradeWeight(clampedPosition);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>
            <div style={{ fontSize: '16px', color: '#999' }}>当前值: {Math.round(gradeWeight)}%</div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>教师经验权重</div>
            <div style={{ position: 'relative', height: 16, marginBottom: 8 }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 16, 
                backgroundColor: '#f0f0f0', 
                borderRadius: 8 
              }} 
                onClick={(e) => {
                  const rect = e.currentTarget.parentElement.getBoundingClientRect();
                  const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
                  const clampedPosition = Math.max(0, Math.min(100, newPosition));
                  setExperienceWeight(clampedPosition);
                }}
              />
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: `${experienceWeight}%`, 
                  transform: 'translateX(-50%)', 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#9C27B0', 
                  borderRadius: '50%', 
                  cursor: 'pointer' 
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget.parentElement;
                  
                  const handleMouseMove = (moveEvent) => {
                    const rect = container.getBoundingClientRect();
                    const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                    const clampedPosition = Math.max(0, Math.min(100, newPosition));
                    setExperienceWeight(clampedPosition);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>
            <div style={{ fontSize: '16px', color: '#999' }}>当前值: {Math.round(experienceWeight)}%</div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>教师评分权重</div>
            <div style={{ position: 'relative', height: 16, marginBottom: 8 }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 16, 
                backgroundColor: '#f0f0f0', 
                borderRadius: 8 
              }} 
                onClick={(e) => {
                  const rect = e.currentTarget.parentElement.getBoundingClientRect();
                  const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
                  const clampedPosition = Math.max(0, Math.min(100, newPosition));
                  setRatingWeight(clampedPosition);
                }}
              />
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: `${ratingWeight}%`, 
                  transform: 'translateX(-50%)', 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#9C27B0', 
                  borderRadius: '50%', 
                  cursor: 'pointer' 
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget.parentElement;
                  
                  const handleMouseMove = (moveEvent) => {
                    const rect = container.getBoundingClientRect();
                    const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                    const clampedPosition = Math.max(0, Math.min(100, newPosition));
                    setRatingWeight(clampedPosition);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>
            <div style={{ fontSize: '16px', color: '#999' }}>当前值: {Math.round(ratingWeight)}%</div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>最大推荐数量</div>
            <Input type="number" defaultValue={5} min={1} max={10} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>最低匹配分数</div>
            <Input type="number" defaultValue={60} min={0} max={100} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>推荐更新间隔 (小时)</div>
            <Input type="number" defaultValue={24} min={1} max={168} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>匹配有效期 (天)</div>
            <Input type="number" defaultValue={30} min={1} max={90} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
        </Row>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>推荐算法配置</h3>
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>算法类型</div>
          <Select style={{ width: '100%', fontSize: '16px' }} defaultValue="hybrid">
            <Option value="collaborative">协同过滤</Option>
            <Option value="content-based">基于内容</Option>
            <Option value="hybrid">混合推荐</Option>
          </Select>
        </div>
        <div style={{ marginBottom: 20 }}>
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
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>模型配置</h3>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>模型名称</div>
          <Input defaultValue="ai-recommender-v1.0" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>模型API端点</div>
          <Input defaultValue="http://localhost:8000/api/v1/recommend" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>API密钥</div>
          <Input.Password defaultValue="your-api-key-here" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>请求超时 (秒)</div>
          <Input type="number" defaultValue={30} min={5} max={60} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
        </div>
      </Card>
      
      <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
        <Button style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: 'white', fontSize: '16px', padding: '10px 28px' }}>保存配置</Button>
        <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}>测试配置</Button>
        <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}>恢复默认</Button>
      </div>
    </div>
  )
}

export default AIConfiguration

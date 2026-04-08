import React, { useState } from 'react'
import { Card, Input, Select, Button, Row, Col, Checkbox } from 'antd'

const { Option } = Select

const SystemSettings = () => {
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
            基本设置
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
            邮件配置
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
            短信配置
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
            安全设置
          </div>
          <div 
            onClick={() => setActiveTab('5')}
            style={{
              backgroundColor: activeTab === '5' ? '#9C27B0' : 'white',
              color: activeTab === '5' ? 'white' : '#333',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              minWidth: '100px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: activeTab === '5' ? '2px solid #9C27B0' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== '5') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.color = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== '5') {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#333';
              }
            }}
          >
            存储设置
          </div>
        </div>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, background: '#f9f9f9', borderLeft: '4px solid #9C27B0', borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>系统信息</h3>
        <p style={{ marginBottom: 12, fontSize: '16px', color: '#333' }}><span style={{ fontWeight: 'bold', color: '#555' }}>系统版本：</span> v1.0.0</p>
        <p style={{ marginBottom: 12, fontSize: '16px', color: '#333' }}><span style={{ fontWeight: 'bold', color: '#555' }}>最后更新：</span> 2026-03-31 10:00:00</p>
        <p style={{ marginBottom: 12, fontSize: '16px', color: '#333' }}><span style={{ fontWeight: 'bold', color: '#555' }}>服务器状态：</span> 运行中</p>
        <p style={{ marginBottom: 12, fontSize: '16px', color: '#333' }}><span style={{ fontWeight: 'bold', color: '#555' }}>数据库状态：</span> 正常</p>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>基本设置</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>网站名称</div>
            <Input defaultValue="乡村助学平台" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>网站描述</div>
            <Input defaultValue="为乡村孩子提供优质教育资源和心理支持" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>网站URL</div>
            <Input defaultValue="http://localhost:3000" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>时区</div>
            <Select style={{ width: '100%', fontSize: '16px' }} defaultValue="Asia/Shanghai">
              <Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
              <Option value="America/New_York">America/New_York (UTC-5)</Option>
              <Option value="Europe/London">Europe/London (UTC+0)</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>默认语言</div>
            <Select style={{ width: '100%', fontSize: '16px' }} defaultValue="zh-CN">
              <Option value="zh-CN">简体中文</Option>
              <Option value="en-US">English</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>管理员邮箱</div>
            <Input type="email" defaultValue="admin@example.com" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
        </Row>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>邮件配置</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>SMTP服务器</div>
            <Input defaultValue="smtp.example.com" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>SMTP端口</div>
            <Input type="number" defaultValue={587} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>SMTP用户名</div>
            <Input defaultValue="noreply@example.com" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>SMTP密码</div>
            <Input.Password defaultValue="your-smtp-password" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>使用SSL/TLS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox defaultChecked style={{ transform: 'scale(1.1)' }} />
              <span style={{ fontSize: '16px' }}>启用</span>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>发件人邮箱</div>
            <Input type="email" defaultValue="noreply@example.com" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
        </Row>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>安全设置</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>会话超时 (分钟)</div>
            <Input type="number" defaultValue={30} min={5} max={120} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>最小密码长度</div>
            <Input type="number" defaultValue={8} min={6} max={20} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>登录尝试次数限制</div>
            <Input type="number" defaultValue={5} min={1} max={10} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>账户锁定时间 (分钟)</div>
            <Input type="number" defaultValue={30} min={5} max={120} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>启用双因素认证</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox style={{ transform: 'scale(1.1)' }} />
              <span style={{ fontSize: '16px' }}>启用</span>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8, fontSize: '16px', color: '#333' }}>启用HTTPS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox style={{ transform: 'scale(1.1)' }} />
              <span style={{ fontSize: '16px' }}>启用</span>
            </div>
          </Col>
        </Row>
      </Card>
      
      <div style={{ display: 'flex', gap: 15, marginTop: 20 }}>
        <Button style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: 'white', fontSize: '14px', padding: '6px 14px' }}>保存设置</Button>
        <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '14px', padding: '6px 14px' }}>测试配置</Button>
        <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '14px', padding: '6px 14px' }}>恢复默认</Button>
      </div>
    </div>
  )
}

export default SystemSettings

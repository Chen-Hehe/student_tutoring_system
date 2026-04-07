import React from 'react'
import { Card, Tabs, Input, Select, Button, Row, Col, Checkbox } from 'antd'

const { TabPane } = Tabs
const { Option } = Select

const SystemSettings = () => {
  return (
    <div>
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, borderRadius: 12, padding: 20 }}>
        <Tabs defaultActiveKey="1" style={{ marginBottom: 20 }} size="large">
          <TabPane tab="基本设置" key="1" />
          <TabPane tab="邮件配置" key="2" />
          <TabPane tab="短信配置" key="3" />
          <TabPane tab="安全设置" key="4" />
          <TabPane tab="存储设置" key="5" />
        </Tabs>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 30, background: '#f9f9f9', borderLeft: '4px solid #9C27B0', borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 30, fontSize: '1.8em' }}>系统信息</h3>
        <p style={{ marginBottom: 15, fontSize: '16px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>系统版本：</span> v1.0.0</p>
        <p style={{ marginBottom: 15, fontSize: '16px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>最后更新：</span> 2026-03-31 10:00:00</p>
        <p style={{ marginBottom: 15, fontSize: '16px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>服务器状态：</span> 运行中</p>
        <p style={{ marginBottom: 15, fontSize: '16px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>数据库状态：</span> 正常</p>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 30, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 30, fontSize: '1.8em' }}>基本设置</h3>
        <Row gutter={[30, 30]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>网站名称</div>
            <Input defaultValue="乡村助学平台" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>网站描述</div>
            <Input defaultValue="为乡村孩子提供优质教育资源和心理支持" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>网站URL</div>
            <Input defaultValue="http://localhost:3000" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>时区</div>
            <Select style={{ width: '100%', fontSize: '16px' }} defaultValue="Asia/Shanghai">
              <Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
              <Option value="America/New_York">America/New_York (UTC-5)</Option>
              <Option value="Europe/London">Europe/London (UTC+0)</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>默认语言</div>
            <Select style={{ width: '100%', fontSize: '16px' }} defaultValue="zh-CN">
              <Option value="zh-CN">简体中文</Option>
              <Option value="en-US">English</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>管理员邮箱</div>
            <Input type="email" defaultValue="admin@example.com" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
        </Row>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 30, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 30, fontSize: '1.8em' }}>邮件配置</h3>
        <Row gutter={[30, 30]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>SMTP服务器</div>
            <Input defaultValue="smtp.example.com" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>SMTP端口</div>
            <Input type="number" defaultValue={587} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>SMTP用户名</div>
            <Input defaultValue="noreply@example.com" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>SMTP密码</div>
            <Input.Password defaultValue="your-smtp-password" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>使用SSL/TLS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox defaultChecked style={{ transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '16px' }}>启用</span>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>发件人邮箱</div>
            <Input type="email" defaultValue="noreply@example.com" style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
        </Row>
      </Card>
      
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 30, borderRadius: 12 }}>
        <h3 style={{ color: '#9C27B0', marginBottom: 30, fontSize: '1.8em' }}>安全设置</h3>
        <Row gutter={[30, 30]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>会话超时 (分钟)</div>
            <Input type="number" defaultValue={30} min={5} max={120} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>最小密码长度</div>
            <Input type="number" defaultValue={8} min={6} max={20} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>登录尝试次数限制</div>
            <Input type="number" defaultValue={5} min={1} max={10} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>账户锁定时间 (分钟)</div>
            <Input type="number" defaultValue={30} min={5} max={120} style={{ width: '100%', fontSize: '16px', padding: '8px 12px' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>启用双因素认证</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox style={{ transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '16px' }}>启用</span>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#555', fontSize: '16px' }}>启用HTTPS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox style={{ transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '16px' }}>启用</span>
            </div>
          </Col>
        </Row>
      </Card>
      
      <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
        <Button style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: 'white', fontSize: '16px', padding: '8px 16px' }}>保存设置</Button>
        <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}>测试配置</Button>
        <Button style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}>恢复默认</Button>
      </div>
    </div>
  )
}

export default SystemSettings

import React, { useState, useEffect } from 'react'
import { Card, Input, Select, Button, Row, Col, Slider, message, Table, Tag, Statistic } from 'antd'
import { getAiConfig, updateAiConfig, testAiConnection, getAiStats } from '../services/aiConfig'
const { Option } = Select

const AIConfiguration = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [loading, setLoading] = useState(false)
  
  // 配置状态
  const [config, setConfig] = useState({
    apiKey: '',
    model: 'qwen-plus',
    timeout: 30,
    maxRetries: 3,
    enabled: true,
    aiWeight: 0.6,
    minScore: 60.0,
    dailyLimit: 1000
  })
  
  // 统计数据
  const [stats, setStats] = useState({
    todayCalls: 0,
    totalCalls: 0,
    successRate: 0,
    avgResponseTime: 0,
    remainingCalls: 0
  })
  
  // 加载配置
  useEffect(() => {
    loadConfig()
    loadStats()
  }, [])
  
  const loadConfig = async () => {
    try {
      const res = await getAiConfig()
      if (res) {
        setConfig(prev => ({
          ...prev,
          ...res
        }))
      }
    } catch (error) {
      console.error('加载配置失败', error)
    }
  }
  
  const loadStats = async () => {
    try {
      const res = await getAiStats()
      if (res) {
        setStats(res)
      }
    } catch (error) {
      console.error('加载统计失败', error)
    }
  }
  
  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await updateAiConfig(config)
      if (res.success) {
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    } catch (error) {
      message.error('保存失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleTest = async () => {
    setLoading(true)
    try {
      const res = await testAiConnection()
      if (res.success) {
        message.success('AI 连接测试成功！响应：' + res.response)
      } else {
        message.error('AI 连接测试失败：' + res.message)
      }
    } catch (error) {
      message.error('测试失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setConfig({
      apiKey: '',
      model: 'qwen-plus',
      timeout: 30,
      maxRetries: 3,
      enabled: true,
      aiWeight: 0.6,
      minScore: 60.0,
      dailyLimit: 1000
    })
    message.info('已恢复默认配置')
  }
  
  // 渲染匹配规则配置
  const renderMatchRules = () => (
    <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
      <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>匹配规则配置</h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333' }}>科目匹配权重</div>
          <Slider 
            value={config.subjectWeight || 30} 
            onChange={(val) => setConfig(prev => ({ ...prev, subjectWeight: val }))}
            min={0} 
            max={100} 
          />
          <div style={{ fontSize: '14px', color: '#999' }}>当前值：{config.subjectWeight || 30}%</div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333' }}>年级匹配权重</div>
          <Slider 
            value={config.gradeWeight || 25} 
            onChange={(val) => setConfig(prev => ({ ...prev, gradeWeight: val }))}
            min={0} 
            max={100} 
          />
          <div style={{ fontSize: '14px', color: '#999' }}>当前值：{config.gradeWeight || 25}%</div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333' }}>经验匹配权重</div>
          <Slider 
            value={config.experienceWeight || 20} 
            onChange={(val) => setConfig(prev => ({ ...prev, experienceWeight: val }))}
            min={0} 
            max={100} 
          />
          <div style={{ fontSize: '14px', color: '#999' }}>当前值：{config.experienceWeight || 20}%</div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333' }}>AI 匹配权重</div>
          <Slider 
            value={config.aiWeight * 100} 
            onChange={(val) => setConfig(prev => ({ ...prev, aiWeight: val / 100 }))}
            min={0} 
            max={100} 
          />
          <div style={{ fontSize: '14px', color: '#999' }}>当前值：{Math.round(config.aiWeight * 100)}% (AI)</div>
        </Col>
      </Row>
    </Card>
  )
  
  // 渲染模型配置
  const renderModelConfig = () => (
    <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
      <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>通义千问配置</h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333', fontWeight: 'bold' }}>API Key</div>
          <Input.Password 
            value={config.apiKey} 
            onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
            placeholder="请输入通义千问 API Key"
            style={{ fontSize: '14px' }}
          />
          <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
            当前配置：{config.apiKey ? config.apiKey.substring(0, 8) + '****' : '未配置'}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333', fontWeight: 'bold' }}>模型选择</div>
          <Select 
            value={config.model}
            onChange={(val) => setConfig(prev => ({ ...prev, model: val }))}
            style={{ width: '100%' }}
          >
            <Option value="qwen-turbo">Qwen-Turbo（快速）</Option>
            <Option value="qwen-plus">Qwen-Plus（平衡）</Option>
            <Option value="qwen-max">Qwen-Max（高精度）</Option>
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333', fontWeight: 'bold' }}>超时时间 (秒)</div>
          <Input 
            type="number"
            value={config.timeout}
            onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) || 30 }))}
            min={5}
            max={120}
          />
        </Col>
        <Col xs={24} md={6}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333', fontWeight: 'bold' }}>最大重试</div>
          <Input 
            type="number"
            value={config.maxRetries}
            onChange={(e) => setConfig(prev => ({ ...prev, maxRetries: parseInt(e.target.value) || 3 }))}
            min={0}
            max={5}
          />
        </Col>
        <Col xs={24} md={6}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333', fontWeight: 'bold' }}>每日限额</div>
          <Input 
            type="number"
            value={config.dailyLimit}
            onChange={(e) => setConfig(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) || 1000 }))}
            min={100}
            max={10000}
          />
        </Col>
        <Col xs={24} md={6}>
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#333', fontWeight: 'bold' }}>最低分数</div>
          <Input 
            type="number"
            value={config.minScore}
            onChange={(e) => setConfig(prev => ({ ...prev, minScore: parseFloat(e.target.value) || 60 }))}
            min={0}
            max={100}
            step={5}
          />
        </Col>
      </Row>
    </Card>
  )
  
  // 渲染统计数据
  const renderStats = () => (
    <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
      <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>AI 调用统计</h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title="今日调用" 
            value={stats.todayCalls} 
            suffix="次"
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title="总调用" 
            value={stats.totalCalls} 
            suffix="次"
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title="成功率" 
            value={stats.successRate} 
            suffix="%"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title="剩余配额" 
            value={stats.remainingCalls} 
            suffix={`/${config.dailyLimit}`}
            valueStyle={{ color: stats.remainingCalls < 100 ? '#cf1322' : '#722ed1' }}
          />
        </Col>
      </Row>
    </Card>
  )
  
  return (
    <div>
      {/* 顶部标签页 */}
      <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['1', '2', '3', '4'].map((tab) => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: activeTab === tab ? '#9C27B0' : 'white',
                color: activeTab === tab ? 'white' : '#333',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                minWidth: '100px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: activeTab === tab ? '2px solid #9C27B0' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {tab === '1' && '匹配规则'}
              {tab === '2' && '模型配置'}
              {tab === '3' && '调用统计'}
              {tab === '4' && '帮助文档'}
            </div>
          ))}
        </div>
      </Card>
      
      {/* 标签页内容 */}
      {activeTab === '1' && renderMatchRules()}
      {activeTab === '2' && renderModelConfig()}
      {activeTab === '3' && renderStats()}
      {activeTab === '4' && (
        <Card style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30, padding: 20, borderRadius: 12 }}>
          <h3 style={{ color: '#9C27B0', marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>帮助文档</h3>
          <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
            <h4>AI 匹配配置说明</h4>
            <p>1. <strong>API Key 配置：</strong> 在阿里云 DashScope 控制台获取通义千问 API Key</p>
            <p>2. <strong>模型选择：</strong></p>
            <ul>
              <li>Qwen-Turbo：响应速度快，适合实时性要求高的场景</li>
              <li>Qwen-Plus：性能和速度平衡，推荐使用</li>
              <li>Qwen-Max：精度最高，适合复杂分析</li>
            </ul>
            <p>3. <strong>权重配置：</strong> AI 权重越高，大模型分析结果影响越大</p>
            <p>4. <strong>降级策略：</strong> AI 服务不可用时自动切换到规则匹配</p>
          </div>
        </Card>
      )}
      
      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
        <Button 
          type="primary" 
          onClick={handleSave}
          loading={loading}
          style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', fontSize: '16px', padding: '10px 28px' }}
        >
          保存配置
        </Button>
        <Button 
          onClick={handleTest}
          loading={loading}
          style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}
        >
          测试配置
        </Button>
        <Button 
          onClick={handleReset}
          style={{ backgroundColor: '#e0e0e0', color: '#333', fontSize: '16px', padding: '8px 16px' }}
        >
          恢复默认
        </Button>
      </div>
    </div>
  )
}

export default AIConfiguration

import { useState } from 'react'
import { Layout as AntLayout, Menu, Button, Space } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  RobotOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

const { Header, Sider, Content } = AntLayout

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/users', icon: <UserOutlined />, label: '用户管理' },
    { key: '/content', icon: <FileTextOutlined />, label: '内容管理' },
    { key: '/ai-config', icon: <RobotOutlined />, label: 'AI配置' },
    { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
  ]

  const handleLogout = () => {
    dispatch(logout())
    // 重定向到统一入口的登录页
    window.location.href = 'http://localhost:3000/login'
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        width={250}
        collapsedWidth={80}
        trigger={null}
        style={{
          background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
          }}
        >
          {collapsed ? '>' : '<'}
        </div>
        <div style={{ 
          marginBottom: 30, 
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5em'
        }}>
          {collapsed ? '管理' : '管理员中心'}
        </div>
        <div style={{ marginBottom: 20 }}>
          {menuItems.map(item => (
            <div
              key={item.key}
              onClick={() => navigate(item.key)}
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: location.pathname === item.key ? 'bold' : 'normal',
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: location.pathname === item.key ? 'rgba(255,255,255,0.3)' : 'transparent',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = location.pathname === item.key ? 'rgba(255,255,255,0.3)' : 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div
            onClick={handleLogout}
            style={{
              color: 'white',
              fontSize: '16px',
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <LogoutOutlined />
            <span>退出登录</span>
          </div>
        </div>
      </Sider>
      <AntLayout style={{ padding: '20px', background: '#f0f7ff', minHeight: '100vh' }}>
        <div style={{ 
          padding: '24px', 
          background: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          borderRadius: 12
        }}>
          <h1 style={{ 
            color: '#9C27B0', 
            fontSize: '2em',
            margin: 0,
            fontWeight: 'bold'
          }}>
            {location.pathname === '/dashboard' && '管理员仪表盘'}
            {location.pathname === '/users' && '用户管理'}
            {location.pathname === '/content' && '内容管理'}
            {location.pathname === '/ai-config' && 'AI配置'}
            {location.pathname === '/settings' && '系统设置'}
          </h1>
          <Space style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '16px' }}>
            <span>欢迎，管理员</span>
            <div style={{
              width: 45,
              height: 45,
              borderRadius: '50%',
              background: '#9C27B0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              管
            </div>
          </Space>
        </div>
        <Content style={{ padding: 0, minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout

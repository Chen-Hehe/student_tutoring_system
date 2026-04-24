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
        width={260}
        collapsedWidth={80}
        trigger={null}
        style={{
          background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
          boxShadow: '2px 0 10px rgba(0,0,0,0.15)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ 
          marginBottom: 40, 
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5em',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {collapsed ? '管理' : '管理员中心'}
        </div>
        <div style={{ marginBottom: 30 }}>
          {menuItems.map(item => (
            <div
              key={item.key}
              onClick={() => navigate(item.key)}
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: location.pathname === item.key ? '600' : '400',
                padding: '14px 16px',
                marginBottom: 8,
                borderRadius: 10,
                backgroundColor: location.pathname === item.key ? 'rgba(255,255,255,0.3)' : 'transparent',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: location.pathname === item.key ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateX(8px)';
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
              padding: '14px 16px',
              marginBottom: 16,
              borderRadius: 10,
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateX(8px)';
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
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          }}
        >
          {collapsed ? '>' : '<'}
        </div>
      </Sider>
      <AntLayout style={{ padding: '24px', background: 'var(--background-color)', minHeight: '100vh' }}>
        <div style={{ 
          padding: '28px 32px', 
          background: 'var(--card-bg)',
          boxShadow: 'var(--box-shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          borderRadius: 'var(--border-radius)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ 
            color: 'var(--primary-color)', 
            fontSize: '2em',
            margin: 0,
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            {location.pathname === '/dashboard' && '管理员仪表盘'}
            {location.pathname === '/users' && '用户管理'}
            {location.pathname === '/content' && '内容管理'}
            {location.pathname === '/ai-config' && 'AI配置'}
            {location.pathname === '/settings' && '系统设置'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '16px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>欢迎，管理员</span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: 2 }}>系统管理员</span>
            </div>
            <div style={{
              width: 50, 
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
            }}>
              管
            </div>
          </div>
        </div>
        <Content style={{ padding: 0, minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout

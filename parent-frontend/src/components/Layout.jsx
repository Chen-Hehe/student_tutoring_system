import { useState } from 'react'
import { Layout as AntLayout, Menu, Button, Avatar } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { DashboardOutlined, UserOutlined, MessageOutlined, FileTextOutlined, HeartOutlined, CheckCircleOutlined, LogoutOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
const { Header, Sider, Content } = AntLayout
const Layout = () => {
  const navigate = useNavigate(), location = useLocation(), dispatch = useDispatch(), [collapsed, setCollapsed] = useState(false)
  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/children', icon: <UserOutlined />, label: '孩子管理' },
    { key: '/teacher-chat', icon: <MessageOutlined />, label: '教师沟通' },
    { key: '/learning-report', icon: <FileTextOutlined />, label: '学习报告' },
    { key: '/psychological', icon: <HeartOutlined />, label: '心理状态' },
    { key: '/match-confirm', icon: <CheckCircleOutlined />, label: '匹配确认' }
  ]
  const handleLogout = () => { dispatch(logout()); navigate('/login') }
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
          background: '#FF9800',
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
            bottom: 80,
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
            transition: 'all 0.3s ease',
            zIndex: 10
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
          {collapsed ? '家长' : '家长中心'}
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
      <AntLayout>
        <Content style={{ margin: 0, padding: 20, background: '#F0F8FF' }}><Outlet /></Content>
      </AntLayout>
    </AntLayout>
  )
}
export default Layout

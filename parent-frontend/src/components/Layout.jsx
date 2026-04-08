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
        style={{
          background: 'linear-gradient(135deg, #FF9800, #F57C00)',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ height: 40, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5em' }}>{collapsed ? '家长' : '家长中心'}</div>
        <Menu 
          theme="light" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            borderRight: 'none'
          }}
          itemStyle={{
            marginBottom: 10,
            borderRadius: 8
          }}
          selectedItemStyle={{
            backgroundColor: 'rgba(255,255,255,0.3)',
            fontWeight: 'bold'
          }}
          itemHoverStyle={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            transform: 'translateX(5px)'
          }}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '10px', margin: '16px', height: 64 }}>
          <h1 style={{ color: '#FF9800', fontSize: '1.8em', margin: 0 }}>家长{location.pathname === '/dashboard' ? '仪表盘' : location.pathname === '/children' ? '孩子管理' : location.pathname === '/teacher-chat' ? '教师沟通' : location.pathname === '/learning-report' ? '学习报告' : location.pathname === '/psychological' ? '心理状态' : location.pathname === '/match-confirm' ? '匹配确认' : '中心'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>欢迎，王家长</span>
            <Avatar style={{ backgroundColor: '#FF9800', color: 'white', fontWeight: 'bold' }}>王</Avatar>
            <Button icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginLeft: 10 }}>退出登录</Button>
          </div>
        </Header>
        <Content style={{ margin: '0 16px 16px', padding: 24, background: '#f0f8ff', minHeight: 280 }}><Outlet /></Content>
      </AntLayout>
    </AntLayout>
  )
}
export default Layout

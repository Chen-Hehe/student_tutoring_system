import { useState } from 'react'
import { Layout as AntLayout, Menu, Button } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { DashboardOutlined, ChildOutlined, MessageOutlined, FileTextOutlined, HeartOutlined, CheckCircleOutlined, LogoutOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
const { Header, Sider, Content } = AntLayout
const Layout = () => {
  const navigate = useNavigate(), location = useLocation(), dispatch = useDispatch(), [collapsed, setCollapsed] = useState(false)
  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/children', icon: <ChildOutlined />, label: '孩子管理' },
    { key: '/teacher-chat', icon: <MessageOutlined />, label: '教师沟通' },
    { key: '/learning-report', icon: <FileTextOutlined />, label: '学习报告' },
    { key: '/psychological', icon: <HeartOutlined />, label: '心理状态' },
    { key: '/match-confirm', icon: <CheckCircleOutlined />, label: '匹配确认' }
  ]
  const handleLogout = () => { dispatch(logout()); navigate('/login') }
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{collapsed ? '助学' : '乡村助学平台'}</div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} onClick={({ key }) => navigate(key)} />
      </Sider>
      <AntLayout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span>家长端</span><Button icon={<LogoutOutlined />} onClick={handleLogout}>退出登录</Button></Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}><Outlet /></Content>
      </AntLayout>
    </AntLayout>
  )
}
export default Layout

import { useState } from 'react'
import { Layout as AntLayout, Menu, Button } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  BookOutlined,
  HeartOutlined,
  RobotOutlined,
  SwapOutlined,
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
    { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: 'students', icon: <UsergroupAddOutlined />, label: '学生管理' },
    { key: 'chat', icon: <MessageOutlined />, label: '聊天沟通' },
    { key: 'resources', icon: <BookOutlined />, label: '教学资源' },
    { key: 'psychological', icon: <HeartOutlined />, label: '心理辅导' },
    { key: 'ai-match', icon: <RobotOutlined />, label: 'AI 匹配' },
    { key: 'matches', icon: <SwapOutlined />, label: '匹配管理' },
  ]

  const handleLogout = () => {
    dispatch(logout())
    // 重定向到统一入口的登录页
    window.location.href = 'http://localhost:3000/login'
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {collapsed ? '助学' : '乡村助学平台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.replace('/', '')]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>教师端</span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout

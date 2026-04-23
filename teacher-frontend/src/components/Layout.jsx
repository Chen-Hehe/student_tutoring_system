import { useState } from 'react'
import { Layout as AntLayout } from 'antd'
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
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'

const { Sider, Content } = AntLayout

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/students', icon: <UsergroupAddOutlined />, label: '学生管理' },
    { key: '/chat', icon: <MessageOutlined />, label: '聊天沟通' },
    { key: '/resources', icon: <BookOutlined />, label: '教学资源' },
    { key: '/psychological', icon: <HeartOutlined />, label: '心理辅导' },
    { key: '/ai-match', icon: <RobotOutlined />, label: 'AI 匹配' },
    { key: '/matches', icon: <SwapOutlined />, label: '匹配管理' },
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
          background: '#2196F3',
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
          {collapsed ? '教师' : '教师中心'}
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
        <Content style={{ margin: 0, padding: 20, background: '#F0F8FF' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout

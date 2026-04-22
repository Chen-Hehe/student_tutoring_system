import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import ContentManagement from './pages/ContentManagement'
import AIConfiguration from './pages/AIConfiguration'
import SystemSettings from './pages/SystemSettings'

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  // 检查URL参数中是否有token和user信息
  const checkUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('token') && params.get('user')
  }
  
  // 如果有URL参数，等待处理完成，不立即重定向
  if (!isAuthenticated && !checkUrlParams()) {
    // 重定向到统一入口的登录页
    window.location.href = 'http://localhost:3001/login'
    return null
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* 受保护的路由 */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="ai-config" element={<AIConfiguration />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  )
}

export default App

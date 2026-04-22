import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import StudentManagement from './pages/StudentManagement'
import Chat from './pages/Chat'
import Resources from './pages/Resources'
import Psychological from './pages/Psychological'
import AIMatch from './pages/AIMatch'
import MatchManagement from './pages/MatchManagement'

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
    // 重定向到统一入口的登录页 (3000 端口)
    window.location.href = 'http://localhost:3000/login'
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
        <Route path="students" element={<StudentManagement />} />
        <Route path="chat" element={<Chat />} />
        <Route path="resources" element={<Resources />} />
        <Route path="psychological" element={<Psychological />} />
        <Route path="ai-match" element={<AIMatch />} />
        <Route path="matches" element={<MatchManagement />} />
      </Route>
    </Routes>
  )
}

export default App

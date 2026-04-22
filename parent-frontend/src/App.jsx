import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ChildManagement from './pages/ChildManagement'
import TeacherCommunication from './pages/TeacherCommunication'
import LearningReport from './pages/LearningReport'
import PsychologicalStatus from './pages/PsychologicalStatus'
import MatchConfirmation from './pages/MatchConfirmation'
import Login from './pages/Login'

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  // 检查 URL 参数中是否有 token 和 user 信息
  const checkUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('token') && params.get('user')
  }
  
  // 如果有 URL 参数，等待处理完成，不立即重定向
  if (!isAuthenticated && !checkUrlParams()) {
    // 重定向到家长端的登录页（本地路由）
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/login" element={<Login />} />
      
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
        <Route path="children" element={<ChildManagement />} />
        <Route path="teacher-chat" element={<TeacherCommunication />} />
        <Route path="learning-report" element={<LearningReport />} />
        <Route path="psychological" element={<PsychologicalStatus />} />
        <Route path="match-confirm" element={<MatchConfirmation />} />
      </Route>
    </Routes>
  )
}

export default App

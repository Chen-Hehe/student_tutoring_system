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
import Login from './pages/Login'
import Register from './pages/Register'

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
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

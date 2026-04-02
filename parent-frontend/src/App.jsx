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

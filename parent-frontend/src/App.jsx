import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ChildManagement from './pages/ChildManagement'
import TeacherCommunication from './pages/TeacherCommunication'
import LearningReport from './pages/LearningReport'
import PsychologicalStatus from './pages/PsychologicalStatus'
import MatchConfirmation from './pages/MatchConfirmation'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
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

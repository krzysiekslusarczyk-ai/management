import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Schedules from './pages/Schedules'
import ScheduleDetail from './pages/ScheduleDetail'
import Users from './pages/Users'
import Pharmacies from './pages/Pharmacies'
import Absences from './pages/Absences'
import Preferences from './pages/Preferences'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="schedules/:id" element={<ScheduleDetail />} />
            <Route path="users" element={<Users />} />
            <Route path="pharmacies" element={<Pharmacies />} />
            <Route path="absences" element={<Absences />} />
            <Route path="preferences" element={<Preferences />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

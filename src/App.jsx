import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './components/layout/ProtectedRoute'
import LoadingScreen  from './components/layout/LoadingScreen'
import AppShell       from './components/layout/HomePage'
import LoginPage      from './pages/Login'
import RegisterPage   from './pages/Register'
import { useAuth }    from './context/AuthContext'

export default function App() {
  const { loading } = useAuth()
  if (loading) return <LoadingScreen />

  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/"            element={<ProtectedRoute><AppShell page="dashboard" /></ProtectedRoute>} />
      <Route path="/my-queries"  element={<ProtectedRoute><AppShell page="my-queries" /></ProtectedRoute>} />
      <Route path="/add-query"   element={<ProtectedRoute><AppShell page="add" /></ProtectedRoute>} />
      <Route path="/queries/:id" element={<ProtectedRoute><AppShell page="query" /></ProtectedRoute>} />
      <Route path="/admin"       element={<ProtectedRoute><AppShell page="admin" /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

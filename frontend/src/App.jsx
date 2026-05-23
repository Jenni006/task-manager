import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function GuestRoute({ children }) {
  const { token } = useAuth()
  if (token) return <Navigate to="/tasks" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={<GuestRoute><Login /></GuestRoute>}
      />
      <Route
        path="/register"
        element={<GuestRoute><Register /></GuestRoute>}
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center">
              <p className="text-gray-500 text-sm">Tasks page coming next step</p>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
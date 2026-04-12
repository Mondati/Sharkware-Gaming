import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role }) => {
  const stored = localStorage.getItem('sw_role')
  if (stored !== role) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute

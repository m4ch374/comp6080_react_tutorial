import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

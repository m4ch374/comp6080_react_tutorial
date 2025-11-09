import { Route, Routes } from 'react-router'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DashboardOnboard from './pages/DashboardOnboard'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardOnboard />} />
          <Route path="/dashboard/:channelId" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App

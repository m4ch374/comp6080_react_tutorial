import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { UserProvider } from '../contexts/UserContext'

const Layout = () => {
  return (
    <UserProvider>
      <Navbar />
      <Outlet />
    </UserProvider>
  )
}

export default Layout

import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { ChannelProvider } from '../contexts/ChannelContext'

const DashboardLayout = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/" />
  }

  return (
    <ChannelProvider>
      <div className="h-screen w-full bg-zinc-50 dark:bg-black flex flex-col pt-16">
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Channel List */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <Outlet />
          </div>
        </div>
      </div>
    </ChannelProvider>
  )
}

export default DashboardLayout

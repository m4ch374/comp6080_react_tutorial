import React from 'react'

const DashboardOnboard = () => {
  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-black flex flex-col pt-16">
      {/* Main Content Area - Empty State */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Welcome to your Dashboard
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Select a channel from the sidebar to start chatting, or create a
              new channel to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOnboard

import { LogOut } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-black px-4 pt-16">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-4">
          Dashboard
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
          This is a placeholder dashboard page.
        </p>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-200">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Dashboard

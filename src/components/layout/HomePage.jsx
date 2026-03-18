import { Outlet, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import Dashboard from '../../pages/Dashboard'
import MyQueries from '../../pages/MyQueries'
import AddQuery from '../../pages/AddQuery'
import QueryDetail from '../../pages/QueryDetail'
import AdminPanel from '../../pages/AdminPanel'

// Map URL path to page prop
function getContent(page, id) {
  switch (page) {
    case 'add':       return <AddQuery />
    case 'my-queries': return <MyQueries />
    case 'query':     return <QueryDetail />
    case 'admin':     return <AdminPanel />
    default:          return <Dashboard />
  }
}

export default function AppShell({ page }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {getContent(page)}
      </main>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Users, FileText, MessageSquare, Star } from 'lucide-react'
import Card from '../components/common/Card'
import Loader from '../components/common/Loader'
import api from '../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data.users || usersRes.data || [])
      } catch {
        // admin data may not be available
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  if (loading) return <Loader text="Loading admin data..." />

  const statCards = [
    { label: 'Total Users', value: stats?.total_users ?? '—', icon: Users, color: 'blue' },
    { label: 'Total Plans', value: stats?.total_plans ?? '—', icon: FileText, color: 'emerald' },
    { label: 'Total Feedback', value: stats?.total_feedback ?? '—', icon: MessageSquare, color: 'purple' },
    { label: 'Avg Rating', value: stats?.avg_rating ? stats.avg_rating.toFixed(1) : '—', icon: Star, color: 'amber' },
  ]

  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Users table */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((u, i) => (
                <tr key={u.id || u._id || i}>
                  <td className="py-3 text-sm text-gray-900 dark:text-gray-100">
                    {u.full_name || '—'}
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {u.email}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'admin'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

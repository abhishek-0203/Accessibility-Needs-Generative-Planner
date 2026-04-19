import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, History, UserCircle, Sparkles } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import useProfile from '../hooks/useProfile'
import usePlans from '../hooks/usePlans'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import PlanCard from '../components/plans/PlanCard'
import Loader from '../components/common/Loader'

export default function Dashboard() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { plans, loading: plansLoading, fetchPlans, deletePlan } = usePlans()

  useEffect(() => {
    fetchPlans(1)
  }, [fetchPlans])

  if (profileLoading) return <Loader text="Loading dashboard..." />

  const recentPlans = plans.slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.full_name || user?.email || 'User'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s an overview of your accessibility planner.
        </p>
      </div>

      {/* Profile prompt */}
      {!profile && (
        <Card className="mb-8 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <UserCircle className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Complete Your Profile</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set up your accessibility profile to get personalized plans.
                </p>
              </div>
            </div>
            <Link to="/profile-setup">
              <Button>Set Up Profile</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link to="/generate-plan">
          <Card hoverable className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <PlusCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Generate New Plan</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a personalized plan</p>
            </div>
          </Card>
        </Link>
        <Link to="/plan-history">
          <Card hoverable className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <History className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">View History</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Browse your past plans</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Profile summary */}
      {profile && (
        <Card className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Your Profile
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.disabilities?.map((d, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm capitalize"
              >
                {d.type} — {d.severity}
              </span>
            ))}
          </div>
          {profile.preferences && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-4">
              {profile.preferences.preferred_transport && (
                <span>Transport: {profile.preferences.preferred_transport}</span>
              )}
              {profile.preferences.plan_format && (
                <span>Format: {profile.preferences.plan_format}</span>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Recent plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Plans</h2>
          {plans.length > 0 && (
            <Link to="/plan-history" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          )}
        </div>
        {plansLoading ? (
          <Loader text="Loading plans..." />
        ) : recentPlans.length > 0 ? (
          <div className="grid gap-4">
            {recentPlans.map(plan => (
              <PlanCard key={plan.id || plan._id} plan={plan} onDelete={deletePlan} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Sparkles className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No plans yet. Create your first one!</p>
            <Link to="/generate-plan">
              <Button>Generate Your First Plan</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}

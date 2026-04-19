import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import PlanCard from '../components/plans/PlanCard'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import usePlans from '../hooks/usePlans'

const activityTypes = [
  { value: '', label: 'All Types' },
  { value: 'commute', label: 'Commute' },
  { value: 'event', label: 'Event' },
  { value: 'daily_routine', label: 'Daily Routine' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'medical', label: 'Medical' },
  { value: 'custom', label: 'Custom' },
]

export default function PlanHistory() {
  const { plans, loading, pagination, fetchPlans, deletePlan } = usePlans()
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchPlans(1)
  }, [fetchPlans])

  const filteredPlans = filter
    ? plans.filter(p => p.activity_type === filter)
    : plans

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plan History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Browse your previously generated plans.</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter by activity type"
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {activityTypes.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader text="Loading plans..." />
      ) : filteredPlans.length > 0 ? (
        <>
          <div className="grid gap-4">
            {filteredPlans.map(plan => (
              <PlanCard key={plan.id || plan._id} plan={plan} onDelete={deletePlan} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchPlans(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No plans yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {filter ? 'No plans match this filter.' : 'Start by generating your first accessibility plan.'}
          </p>
          {!filter && (
            <Button onClick={() => window.location.href = '/generate-plan'}>
              Generate Your First Plan
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

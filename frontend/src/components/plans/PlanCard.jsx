import { useNavigate } from 'react-router-dom'
import { Calendar, Trash2 } from 'lucide-react'
import Card from '../common/Card'
import { formatDate, truncateText, capitalizeFirst } from '../../utils/formatters'

const typeBadgeColors = {
  commute: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  event: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  daily_routine: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  shopping: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  medical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  custom: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

export default function PlanCard({ plan, onDelete }) {
  const navigate = useNavigate()
  const planId = plan.id || plan._id

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this plan?')) {
      onDelete(planId)
    }
  }

  return (
    <Card hoverable onClick={() => navigate(`/plans/${planId}`)} className="relative group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {plan.title || 'Untitled Plan'}
            </h3>
            {plan.activity_type && (
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${typeBadgeColors[plan.activity_type] || typeBadgeColors.custom}`}>
                {capitalizeFirst(plan.activity_type.replace('_', ' '))}
              </span>
            )}
          </div>
          {plan.summary && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {truncateText(plan.summary, 120)}
            </p>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(plan.created_at || plan.date)}
          </div>
        </div>
        <button
          onClick={handleDelete}
          aria-label="Delete plan"
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}

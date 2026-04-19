import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PlanViewer from '../components/plans/PlanViewer'
import Loader from '../components/common/Loader'
import usePlans from '../hooks/usePlans'

export default function PlanView() {
  const { id } = useParams()
  const { currentPlan, loading, error, fetchPlan } = usePlans()

  useEffect(() => {
    if (id) fetchPlan(id)
  }, [id, fetchPlan])

  if (loading) return <Loader text="Loading plan..." />

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PlanViewer plan={currentPlan} />
    </div>
  )
}

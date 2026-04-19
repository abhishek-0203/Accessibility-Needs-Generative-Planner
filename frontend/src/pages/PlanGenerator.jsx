import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import PlanForm from '../components/plans/PlanForm'
import PlanViewer from '../components/plans/PlanViewer'
import Card from '../components/common/Card'
import usePlans from '../hooks/usePlans'

export default function PlanGenerator() {
  const { currentPlan, loading, error, generatePlan } = usePlans()
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async (input) => {
    try {
      await generatePlan(input)
      setGenerated(true)
    } catch {
      // error handled in hook
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!generated ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Generate a Plan
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Describe your activity and we&apos;ll create a personalized accessibility plan.
            </p>
          </div>
          <Card>
            <PlanForm onSubmit={handleGenerate} loading={loading} />
          </Card>
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm" role="alert">
              {error}
            </div>
          )}
        </>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <Sparkles className="h-12 w-12 text-blue-600 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
            Generating your personalized plan...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This may take a moment as we consider your accessibility needs.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Plan</h1>
            <button
              onClick={() => setGenerated(false)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Generate Another
            </button>
          </div>
          <PlanViewer plan={currentPlan} />
        </>
      )}
    </div>
  )
}

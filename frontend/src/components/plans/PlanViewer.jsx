import { Printer, Clock, AlertTriangle, Wrench, ArrowRight, CloudSun } from 'lucide-react'
import Card from '../common/Card'
import FeedbackForm from '../feedback/FeedbackForm'

export default function PlanViewer({ plan }) {
  if (!plan) return null

  const handlePrint = () => window.print()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {plan.title || 'Your Plan'}
          </h1>
          {plan.summary && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">{plan.summary}</p>
          )}
        </div>
        <button
          onClick={handlePrint}
          aria-label="Print plan"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors print:hidden"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      {/* Steps */}
      {plan.steps?.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Step-by-Step Plan
          </h2>
          <ol className="space-y-4">
            {plan.steps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {step.title || `Step ${idx + 1}`}
                  </h3>
                  {step.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {step.time_estimate && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        {step.time_estimate}
                      </span>
                    )}
                    {step.tools_needed?.map((tool, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs"
                      >
                        <Wrench className="h-3 w-3" />
                        {tool}
                      </span>
                    ))}
                  </div>
                  {step.accessibility_notes && (
                    <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        {step.accessibility_notes}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Alternatives */}
      {plan.alternatives?.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Alternative Options
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {plan.alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{alt.title}</h3>
                {alt.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alt.description}</p>
                )}
                {alt.trade_offs && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    {alt.trade_offs}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommended Tools */}
      {plan.recommended_tools?.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Recommended Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {plan.recommended_tools.map((tool, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
              >
                <Wrench className="h-3.5 w-3.5" />
                {tool}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Weather advisory */}
      {plan.weather_advisory && (
        <Card className="border-l-4 border-l-sky-500">
          <div className="flex items-start gap-3">
            <CloudSun className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Weather Advisory</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plan.weather_advisory}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Feedback */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Rate This Plan
        </h2>
        <FeedbackForm planId={plan.id || plan._id} />
      </Card>
    </div>
  )
}

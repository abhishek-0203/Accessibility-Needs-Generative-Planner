import { useState } from 'react'
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react'
import RatingStars from './RatingStars'
import Button from '../common/Button'
import * as feedbackService from '../../services/feedbackService'

export default function FeedbackForm({ planId }) {
  const [rating, setRating] = useState(0)
  const [helpful, setHelpful] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return
    setLoading(true)
    setError('')
    try {
      await feedbackService.submitFeedback({
        plan_id: planId,
        rating,
        helpful,
        comment,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">Thank you for your feedback!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm" role="alert">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          How would you rate this plan?
        </label>
        <RatingStars rating={rating} onRate={setRating} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Was this plan helpful?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setHelpful(true)}
            aria-pressed={helpful === true}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              helpful === true
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            Yes
          </button>
          <button
            type="button"
            onClick={() => setHelpful(false)}
            aria-pressed={helpful === false}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              helpful === false
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            No
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Comments (optional)
        </label>
        <textarea
          id="feedback-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this plan..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button type="submit" loading={loading} disabled={rating === 0}>
        Submit Feedback
      </Button>
    </form>
  )
}

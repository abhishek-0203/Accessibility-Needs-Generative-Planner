import { useState } from 'react'
import { Mic, Sparkles } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'

const activityTypes = [
  { value: 'commute', label: 'Commute' },
  { value: 'event', label: 'Event' },
  { value: 'daily_routine', label: 'Daily Routine' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'medical', label: 'Medical' },
  { value: 'custom', label: 'Custom' },
]

export default function PlanForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    description: '',
    activity_type: 'commute',
    date: '',
    start_time: '',
    end_time: '',
    destination: '',
    special_requirements: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleVoiceInput = () => {
    alert('Voice input coming soon')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          What do you want to plan? <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe the activity you want to plan..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
          />
          <button
            type="button"
            onClick={handleVoiceInput}
            aria-label="Voice input"
            className="absolute right-3 top-3 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Activity Type
        </label>
        <select
          id="activity_type"
          name="activity_type"
          value={formData.activity_type}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {activityTypes.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
        <Input
          label="Start Time"
          name="start_time"
          type="time"
          value={formData.start_time}
          onChange={handleChange}
        />
        <Input
          label="End Time"
          name="end_time"
          type="time"
          value={formData.end_time}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Destination"
        name="destination"
        value={formData.destination}
        onChange={handleChange}
        placeholder="Where are you going? (optional)"
      />

      <div>
        <label htmlFor="special_requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Special Requirements
        </label>
        <textarea
          id="special_requirements"
          name="special_requirements"
          rows={2}
          value={formData.special_requirements}
          onChange={handleChange}
          placeholder="Any additional requirements... (optional)"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button type="submit" fullWidth loading={loading} size="lg">
        <Sparkles className="h-5 w-5" />
        Generate Plan
      </Button>
    </form>
  )
}

import { useState } from 'react'
import { Accessibility, Eye, Ear, Brain, ChevronLeft, ChevronRight } from 'lucide-react'
import DisabilityCard from './DisabilityCard'
import Button from '../common/Button'
import Input from '../common/Input'
import * as profileService from '../../services/profileService'

const disabilityTypes = [
  { type: 'mobility', icon: Accessibility },
  { type: 'visual', icon: Eye },
  { type: 'hearing', icon: Ear },
  { type: 'cognitive', icon: Brain },
]

const severityOptions = ['mild', 'moderate', 'severe']

export default function ProfileWizard({ onComplete }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedDisabilities, setSelectedDisabilities] = useState([])
  const [disabilityDetails, setDisabilityDetails] = useState({})
  const [preferences, setPreferences] = useState({
    preferred_transport: 'public',
    max_walking_distance: '',
    companion_needed: false,
    plan_format: 'detailed',
    voice_input: false,
    high_contrast: false,
    font_size: 'normal',
  })
  const [location, setLocation] = useState({ city: '', default_address: '' })

  const totalSteps = 4

  const toggleDisability = (type) => {
    setSelectedDisabilities(prev =>
      prev.includes(type)
        ? prev.filter(d => d !== type)
        : [...prev, type]
    )
  }

  const handleDetailChange = (type, field, value) => {
    setDisabilityDetails(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }))
  }

  const handlePrefChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (e) => {
    const { name, value } = e.target
    setLocation(prev => ({ ...prev, [name]: value }))
  }

  const canProceed = () => {
    if (step === 1) return selectedDisabilities.length > 0
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const profileData = {
        disabilities: selectedDisabilities.map(type => ({
          type,
          severity: disabilityDetails[type]?.severity || 'moderate',
          specific_needs: disabilityDetails[type]?.specific_needs || '',
        })),
        preferences,
        location,
      }
      await profileService.createProfile(profileData)
      onComplete?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                i + 1 <= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-12 h-0.5 mx-1 ${i + 1 < step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Step 1: Select disability types */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Select Your Disability Types
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Choose all that apply. This helps us personalize your accessibility plans.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {disabilityTypes.map(({ type, icon }) => (
              <DisabilityCard
                key={type}
                type={type}
                icon={icon}
                selected={selectedDisabilities.includes(type)}
                onToggle={toggleDisability}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Severity and specific needs */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Tell Us More
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            For each selected disability, set severity and describe specific needs.
          </p>
          <div className="space-y-6">
            {selectedDisabilities.map(type => (
              <div key={type} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="font-semibold capitalize text-gray-800 dark:text-gray-200">{type}</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Severity
                  </label>
                  <div className="flex gap-3">
                    {severityOptions.map(sev => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => handleDetailChange(type, 'severity', sev)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          (disabilityDetails[type]?.severity || 'moderate') === sev
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor={`needs-${type}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specific Needs
                  </label>
                  <textarea
                    id={`needs-${type}`}
                    rows={2}
                    value={disabilityDetails[type]?.specific_needs || ''}
                    onChange={(e) => handleDetailChange(type, 'specific_needs', e.target.value)}
                    placeholder="Describe any specific needs or considerations..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Preferences */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your Preferences
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Customize how plans are generated for you.
          </p>
          <div className="space-y-5">
            <div>
              <label htmlFor="transport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Transport
              </label>
              <select
                id="transport"
                value={preferences.preferred_transport}
                onChange={(e) => handlePrefChange('preferred_transport', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public Transit</option>
                <option value="private">Private Vehicle</option>
                <option value="ride_share">Ride Share</option>
                <option value="walking">Walking</option>
                <option value="wheelchair">Wheelchair Accessible</option>
              </select>
            </div>

            <Input
              label="Max Walking Distance (meters)"
              name="max_walking_distance"
              type="number"
              value={preferences.max_walking_distance}
              onChange={(e) => handlePrefChange('max_walking_distance', e.target.value)}
              placeholder="e.g., 500"
            />

            <div className="flex items-center justify-between">
              <label htmlFor="companion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Companion Needed
              </label>
              <button
                id="companion"
                type="button"
                role="switch"
                aria-checked={preferences.companion_needed}
                onClick={() => handlePrefChange('companion_needed', !preferences.companion_needed)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  preferences.companion_needed ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.companion_needed ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>

            <div>
              <label htmlFor="plan_format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Plan Format
              </label>
              <select
                id="plan_format"
                value={preferences.plan_format}
                onChange={(e) => handlePrefChange('plan_format', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="simple">Simple</option>
                <option value="detailed">Detailed</option>
                <option value="step_by_step">Step by Step</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="voice" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Voice Input
              </label>
              <button
                id="voice"
                type="button"
                role="switch"
                aria-checked={preferences.voice_input}
                onClick={() => handlePrefChange('voice_input', !preferences.voice_input)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  preferences.voice_input ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.voice_input ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="contrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                High Contrast
              </label>
              <button
                id="contrast"
                type="button"
                role="switch"
                aria-checked={preferences.high_contrast}
                onClick={() => handlePrefChange('high_contrast', !preferences.high_contrast)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  preferences.high_contrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.high_contrast ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>

            <div>
              <label htmlFor="font_size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Size
              </label>
              <select
                id="font_size"
                value={preferences.font_size}
                onChange={(e) => handlePrefChange('font_size', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Location */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your Location
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Help us provide location-relevant accessibility information.
          </p>
          <div className="space-y-5">
            <Input
              label="City"
              name="city"
              value={location.city}
              onChange={handleLocationChange}
              placeholder="e.g., San Francisco"
            />
            <Input
              label="Default Address"
              name="default_address"
              value={location.default_address}
              onChange={handleLocationChange}
              placeholder="Your home or primary address"
            />
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setStep(prev => prev - 1)}
          disabled={step === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        {step < totalSteps ? (
          <Button onClick={() => setStep(prev => prev + 1)} disabled={!canProceed()}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading}>
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  )
}

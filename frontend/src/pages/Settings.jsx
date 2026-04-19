import { useContext, useState } from 'react'
import { Sun, Moon, Type, Eye } from 'lucide-react'
import { ThemeContext } from '../context/ThemeContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function Settings() {
  const { darkMode, toggleDarkMode, fontSize, changeFontSize, highContrast, toggleHighContrast } = useContext(ThemeContext)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [deleteMsg, setDeleteMsg] = useState('')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Accessibility */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accessibility</h2>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5 text-gray-500" /> : <Sun className="h-5 w-5 text-gray-500" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={darkMode}
              onClick={toggleDarkMode}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                darkMode ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Font Size</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adjust text size</p>
              </div>
            </div>
            <select
              value={fontSize}
              onChange={(e) => changeFontSize(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">High Contrast</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Increase color contrast</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              onClick={toggleHighContrast}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                highContrast ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>
        </div>
      </Card>

      {/* Profile */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Update your disability profile and preferences.
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/profile-setup'}>
          Edit Profile
        </Button>
      </Card>

      {/* Account */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <Button
              variant="outline"
              onClick={() => setPasswordMsg('Password change feature coming soon.')}
            >
              Change Password
            </Button>
            {passwordMsg && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{passwordMsg}</p>
            )}
          </div>
          <div>
            <Button
              variant="danger"
              onClick={() => setDeleteMsg('Account deletion feature coming soon.')}
            >
              Delete Account
            </Button>
            {deleteMsg && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{deleteMsg}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

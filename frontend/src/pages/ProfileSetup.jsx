import { useNavigate } from 'react-router-dom'
import ProfileWizard from '../components/profile/ProfileWizard'
import Card from '../components/common/Card'

export default function ProfileSetup() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Set Up Your Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Tell us about your needs so we can create personalized plans for you.
        </p>
      </div>
      <Card>
        <ProfileWizard onComplete={() => navigate('/dashboard')} />
      </Card>
    </div>
  )
}

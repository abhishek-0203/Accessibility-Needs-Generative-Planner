import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Accessibility } from 'lucide-react'
import RegisterForm from '../components/auth/RegisterForm'
import useAuth from '../hooks/useAuth'
import Card from '../components/common/Card'

export default function Register() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 mb-3">
            <Accessibility className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Get started with AccessPlanner
          </p>
        </div>
        <RegisterForm />
      </Card>
    </div>
  )
}

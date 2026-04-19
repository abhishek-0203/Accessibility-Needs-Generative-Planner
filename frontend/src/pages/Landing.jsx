import { Link } from 'react-router-dom'
import { Sparkles, Users, Brain, Accessibility, ArrowRight } from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

const features = [
  {
    icon: Sparkles,
    title: 'Personalized Plans',
    description: 'Get plans tailored to your specific accessibility needs, preferences, and abilities.',
  },
  {
    icon: Users,
    title: 'Multi-Disability Support',
    description: 'Support for mobility, visual, hearing, and cognitive disabilities — individually or combined.',
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description: 'Advanced AI generates comprehensive, context-aware accessibility plans in seconds.',
  },
  {
    icon: Accessibility,
    title: 'Accessible by Design',
    description: 'Built with WCAG guidelines from the ground up. Fully keyboard navigable and screen-reader friendly.',
  },
]

const steps = [
  { num: 1, title: 'Create Profile', description: 'Tell us about your accessibility needs and preferences.' },
  { num: 2, title: 'Describe Activity', description: 'Describe what you want to plan — a commute, event, or daily routine.' },
  { num: 3, title: 'Get Your Plan', description: 'Receive a detailed, personalized accessibility plan instantly.' },
]

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Plan Your Day,{' '}
            <span className="text-emerald-300">Your Way</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-blue-100 mb-10">
            An AI-powered accessibility planner that creates personalized, step-by-step plans
            for your daily activities — designed for your unique needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="!border-white !text-white hover:!bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Everything You Need
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Powerful features designed to make accessibility planning effortless and effective.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Three simple steps to get your personalized accessibility plan.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of users who plan their day with confidence using AccessPlanner.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Create Your Free Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

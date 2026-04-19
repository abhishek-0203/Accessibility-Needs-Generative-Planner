import { Check } from 'lucide-react'

const descriptions = {
  mobility: 'Wheelchair use, limited walking, motor impairments',
  visual: 'Low vision, blindness, color blindness',
  hearing: 'Deafness, hard of hearing, auditory processing',
  cognitive: 'Learning disabilities, memory, attention, autism',
}

export default function DisabilityCard({ type, selected, onToggle, icon: Icon }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={() => onToggle(type)}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(type) } }}
      className={`
        relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${selected
          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
    >
      {selected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5">
          <Check className="h-3.5 w-3.5" />
        </div>
      )}
      {Icon && <Icon className={`h-10 w-10 ${selected ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`} />}
      <div className="text-center">
        <h3 className={`font-semibold capitalize ${selected ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
          {type}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {descriptions[type]}
        </p>
      </div>
    </button>
  )
}

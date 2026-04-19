import { Loader2 } from 'lucide-react'

export default function Loader({ fullPage = false, text = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      {text && <p className="text-gray-600 dark:text-gray-400 text-sm">{text}</p>}
      <span className="sr-only">{text}</span>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        {content}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-12">{content}</div>
}

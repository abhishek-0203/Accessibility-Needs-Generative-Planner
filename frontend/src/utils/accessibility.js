export function announceToScreenReader(message) {
  const el = document.createElement('div')
  el.setAttribute('role', 'status')
  el.setAttribute('aria-live', 'polite')
  el.setAttribute('aria-atomic', 'true')
  el.className = 'sr-only'
  el.textContent = message
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1000)
}

export function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (focusable.length === 0) return () => {}

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  const handler = (e) => {
    if (e.key !== 'Tab') return
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  element.addEventListener('keydown', handler)
  first.focus()

  return () => element.removeEventListener('keydown', handler)
}

export function getFontSizeClass(preference) {
  switch (preference) {
    case 'large':
      return 'text-lg'
    case 'extra-large':
      return 'text-xl'
    default:
      return 'text-base'
  }
}

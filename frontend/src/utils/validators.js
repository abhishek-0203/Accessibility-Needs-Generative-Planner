export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
}

export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0
}

export function passwordsMatch(p1, p2) {
  return p1 === p2
}

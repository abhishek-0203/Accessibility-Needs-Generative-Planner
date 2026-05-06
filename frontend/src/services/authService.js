import { getStore, setStore, generateId, delay, KEYS } from './mockData'

export const login = async (email, password) => {
  await delay(300)
  const users = getStore(KEYS.USERS) || []
  const user = users.find((u) => u.email === email.toLowerCase().trim())

  if (!user) throw { response: { status: 401, data: { error: 'Invalid email or password' } } }
  if (user.password !== password) throw { response: { status: 401, data: { error: 'Invalid email or password' } } }
  if (user.is_active === false) throw { response: { status: 403, data: { error: 'Account is deactivated' } } }

  const token = 'mock-jwt-' + generateId()
  const safeUser = { _id: user._id, email: user.email, full_name: user.full_name, role: user.role }

  setStore(KEYS.CURRENT_USER, safeUser)

  return { data: { access_token: token, refresh_token: 'mock-refresh-' + generateId(), user: safeUser, message: 'Login successful' } }
}

export const register = async (email, password, fullName) => {
  await delay(300)
  const users = getStore(KEYS.USERS) || []

  if (users.find((u) => u.email === email.toLowerCase().trim())) {
    throw { response: { status: 409, data: { error: 'Email already registered' } } }
  }

  const newUser = {
    _id: generateId(),
    email: email.toLowerCase().trim(),
    password,
    full_name: fullName,
    role: 'user',
    is_active: true,
    created_at: new Date().toISOString(),
  }

  users.push(newUser)
  setStore(KEYS.USERS, users)

  const token = 'mock-jwt-' + generateId()
  const safeUser = { _id: newUser._id, email: newUser.email, full_name: newUser.full_name, role: newUser.role }

  setStore(KEYS.CURRENT_USER, safeUser)

  return { data: { access_token: token, refresh_token: 'mock-refresh-' + generateId(), user: safeUser, message: 'User registered successfully' } }
}

export const logout = async () => {
  await delay(100)
  localStorage.removeItem(KEYS.CURRENT_USER)
  return { data: { message: 'Successfully logged out' } }
}

export const refreshToken = async () => {
  await delay(100)
  return { data: { access_token: 'mock-jwt-' + generateId(), message: 'Token refreshed' } }
}

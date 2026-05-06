import { getStore, setStore, generateId, delay, getCurrentUserId, KEYS } from './mockData'

export const createProfile = async (data) => {
  await delay(300)
  const userId = getCurrentUserId()
  if (!userId) throw { response: { status: 401, data: { error: 'Not authenticated' } } }

  const profiles = getStore(KEYS.PROFILES) || []
  const existing = profiles.find((p) => p.user_id === userId)
  if (existing) throw { response: { status: 409, data: { error: 'Profile already exists. Use PUT to update.' } } }

  const profile = {
    _id: generateId(),
    user_id: userId,
    disabilities: data.disabilities || [],
    preferences: data.preferences || {},
    location: data.location || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  profiles.push(profile)
  setStore(KEYS.PROFILES, profiles)

  return { data: { profile, message: 'Profile created successfully' } }
}

export const getProfile = async () => {
  await delay(200)
  const userId = getCurrentUserId()
  if (!userId) throw { response: { status: 401, data: { error: 'Not authenticated' } } }

  const profiles = getStore(KEYS.PROFILES) || []
  const profile = profiles.find((p) => p.user_id === userId)
  if (!profile) throw { response: { status: 404, data: { error: 'Profile not found' } } }

  return { data: { profile } }
}

export const updateProfile = async (data) => {
  await delay(300)
  const userId = getCurrentUserId()
  if (!userId) throw { response: { status: 401, data: { error: 'Not authenticated' } } }

  const profiles = getStore(KEYS.PROFILES) || []
  const idx = profiles.findIndex((p) => p.user_id === userId)
  if (idx === -1) throw { response: { status: 404, data: { error: 'Profile not found' } } }

  profiles[idx] = {
    ...profiles[idx],
    disabilities: data.disabilities ?? profiles[idx].disabilities,
    preferences: data.preferences ?? profiles[idx].preferences,
    location: data.location ?? profiles[idx].location,
    updated_at: new Date().toISOString(),
  }
  setStore(KEYS.PROFILES, profiles)

  return { data: { profile: profiles[idx], message: 'Profile updated successfully' } }
}

export const updatePreferences = async (preferences) => {
  await delay(200)
  const userId = getCurrentUserId()
  if (!userId) throw { response: { status: 401, data: { error: 'Not authenticated' } } }

  const profiles = getStore(KEYS.PROFILES) || []
  const idx = profiles.findIndex((p) => p.user_id === userId)
  if (idx === -1) throw { response: { status: 404, data: { error: 'Profile not found' } } }

  profiles[idx].preferences = { ...profiles[idx].preferences, ...preferences }
  profiles[idx].updated_at = new Date().toISOString()
  setStore(KEYS.PROFILES, profiles)

  return { data: { profile: profiles[idx], message: 'Preferences updated successfully' } }
}

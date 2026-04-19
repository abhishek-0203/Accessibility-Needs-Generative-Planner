import api from './api'

export const createProfile = (data) =>
  api.post('/profile', data)

export const getProfile = () =>
  api.get('/profile')

export const updateProfile = (data) =>
  api.put('/profile', data)

export const updatePreferences = (preferences) =>
  api.patch('/profile/preferences', preferences)

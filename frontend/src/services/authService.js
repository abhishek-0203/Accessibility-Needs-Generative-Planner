import api from './api'

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

export const register = (email, password, fullName) =>
  api.post('/auth/register', { email, password, full_name: fullName })

export const logout = () =>
  api.post('/auth/logout')

export const refreshToken = () =>
  api.post('/auth/refresh')

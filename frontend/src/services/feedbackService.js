import api from './api'

export const submitFeedback = (data) =>
  api.post('/feedback', data)

export const getPlanFeedback = (planId) =>
  api.get(`/feedback/plan/${planId}`)

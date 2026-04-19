import api from './api'

export const generatePlan = (activityInput) =>
  api.post('/plans/generate', activityInput)

export const getPlan = (planId) =>
  api.get(`/plans/${planId}`)

export const getPlanHistory = (page = 1, perPage = 10) =>
  api.get('/plans/history', { params: { page, per_page: perPage } })

export const deletePlan = (planId) =>
  api.delete(`/plans/${planId}`)

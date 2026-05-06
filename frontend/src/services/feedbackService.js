import { getStore, setStore, generateId, delay, getCurrentUserId, KEYS } from './mockData'

export const submitFeedback = async (data) => {
  await delay(300)
  const userId = getCurrentUserId()

  const feedback = {
    _id: generateId(),
    plan_id: data.plan_id,
    user_id: userId,
    rating: data.rating,
    thumbs: data.helpful === true ? 'up' : data.helpful === false ? 'down' : null,
    comment: data.comment || '',
    created_at: new Date().toISOString(),
  }

  const feedbacks = getStore(KEYS.FEEDBACKS) || []
  feedbacks.push(feedback)
  setStore(KEYS.FEEDBACKS, feedbacks)

  return { data: { feedback_id: feedback._id, message: 'Feedback submitted successfully' } }
}

export const getPlanFeedback = async (planId) => {
  await delay(200)
  const feedbacks = (getStore(KEYS.FEEDBACKS) || []).filter((f) => f.plan_id === planId)
  const ratings = feedbacks.filter((f) => f.rating != null)
  const avg = ratings.length > 0 ? ratings.reduce((sum, f) => sum + f.rating, 0) / ratings.length : 0

  return {
    data: {
      feedbacks,
      stats: { avg_rating: avg, count: feedbacks.length },
    },
  }
}

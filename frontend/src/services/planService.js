import { getStore, setStore, generateId, delay, getCurrentUserId, buildPlanForType, KEYS } from './mockData'
import { isOpenAIAvailable, generateWithOpenAI } from './openaiService'

function flattenPlan(plan) {
  if (!plan) return plan
  const { generated_plan, ...rest } = plan
  return { ...rest, ...generated_plan }
}

function getUserProfile() {
  const userId = getCurrentUserId()
  if (!userId) return null
  const profiles = getStore(KEYS.PROFILES) || []
  return profiles.find((p) => p.user_id === userId) || null
}

export const generatePlan = async (activityInput) => {
  const userId = getCurrentUserId()
  if (!userId) throw { response: { status: 401, data: { error: 'Not authenticated' } } }

  const startTime = Date.now()
  let generatedPlan
  let modelUsed

  if (isOpenAIAvailable()) {
    try {
      const profile = getUserProfile()
      generatedPlan = await generateWithOpenAI(activityInput, profile)
      modelUsed = 'gpt-4o-mini'
    } catch (err) {
      console.warn('OpenAI call failed, falling back to mock templates:', err.message)
      generatedPlan = buildPlanForType(activityInput.activity_type || 'custom', activityInput)
      modelUsed = 'mock-local (fallback)'
    }
  } else {
    await delay(800)
    generatedPlan = buildPlanForType(activityInput.activity_type || 'custom', activityInput)
    modelUsed = 'mock-local'
  }

  const plan = {
    _id: generateId(),
    user_id: userId,
    activity_input: activityInput,
    generated_plan: generatedPlan,
    ai_model_used: modelUsed,
    generation_time_ms: Date.now() - startTime,
    created_at: new Date().toISOString(),
  }

  const plans = getStore(KEYS.PLANS) || []
  plans.unshift(plan)
  setStore(KEYS.PLANS, plans)

  return { data: { plan: flattenPlan(plan), message: 'Plan generated successfully' } }
}

export const getPlan = async (planId) => {
  await delay(200)
  const plans = getStore(KEYS.PLANS) || []
  const plan = plans.find((p) => p._id === planId)
  if (!plan) throw { response: { status: 404, data: { error: 'Plan not found' } } }

  return { data: { plan: flattenPlan(plan) } }
}

export const getPlanHistory = async (page = 1, perPage = 10) => {
  await delay(200)
  const userId = getCurrentUserId()
  if (!userId) throw { response: { status: 401, data: { error: 'Not authenticated' } } }

  const allPlans = (getStore(KEYS.PLANS) || []).filter((p) => p.user_id === userId)
  allPlans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const total = allPlans.length
  const start = (page - 1) * perPage
  const paged = allPlans.slice(start, start + perPage)

  const plans = paged.map((p) => ({
    _id: p._id,
    title: p.generated_plan?.title || 'Untitled Plan',
    summary: p.generated_plan?.summary || '',
    activity_type: p.activity_input?.activity_type || p.generated_plan?.activity_type || 'custom',
    created_at: p.created_at,
    date: p.activity_input?.date,
  }))

  return {
    data: {
      plans,
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage) || 1,
    },
  }
}

export const deletePlan = async (planId) => {
  await delay(200)
  const plans = getStore(KEYS.PLANS) || []
  const idx = plans.findIndex((p) => p._id === planId)
  if (idx === -1) throw { response: { status: 404, data: { error: 'Plan not found' } } }

  plans.splice(idx, 1)
  setStore(KEYS.PLANS, plans)

  return { data: { message: 'Plan deleted successfully' } }
}

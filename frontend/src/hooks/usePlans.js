import { useState, useCallback } from 'react'
import * as planService from '../services/planService'

export default function usePlans() {
  const [plans, setPlans] = useState([])
  const [currentPlan, setCurrentPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })

  const fetchPlans = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await planService.getPlanHistory(page)
      setPlans(data.plans || data.items || [])
      setPagination({
        page: data.page || page,
        totalPages: data.total_pages || data.totalPages || 1,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPlan = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await planService.getPlan(id)
      setCurrentPlan(data.plan || data)
      return data.plan || data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load plan')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const generatePlan = useCallback(async (input) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await planService.generatePlan(input)
      const plan = data.plan || data
      setCurrentPlan(plan)
      return plan
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePlan = useCallback(async (id) => {
    try {
      await planService.deletePlan(id)
      setPlans(prev => prev.filter(p => (p.id || p._id) !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete plan')
      throw err
    }
  }, [])

  return {
    plans,
    currentPlan,
    loading,
    error,
    pagination,
    fetchPlans,
    fetchPlan,
    generatePlan,
    deletePlan,
  }
}

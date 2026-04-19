import { useState, useEffect, useCallback } from 'react'
import * as profileService from '../services/profileService'

export default function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await profileService.getProfile()
      setProfile(data.profile || data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const { data: updated } = await profileService.updateProfile(data)
      setProfile(updated.profile || updated)
      return updated
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createProfile = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const { data: created } = await profileService.createProfile(data)
      setProfile(created.profile || created)
      return created
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, error, fetchProfile, updateProfile, createProfile }
}

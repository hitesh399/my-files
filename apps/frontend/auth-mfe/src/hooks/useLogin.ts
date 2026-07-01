import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAsync } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector((state) => state.auth.status)
  const error = useAppSelector((state) => state.auth.error)

  const isLoading = useMemo(() => status === 'loading', [status])

  async function submitLogin(email: string, password: string) {
    const result = await dispatch(loginAsync({ email, password }))

    console.log("result>>>>", result);

    if (loginAsync.fulfilled.match(result)) {
      navigate('/profile')
    }
  }

  return {
    submitLogin,
    isLoading,
    error,
  }
}

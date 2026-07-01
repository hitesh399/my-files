import { Provider } from 'react-redux'
import { useEffect, type PropsWithChildren } from 'react'
import { useDispatch } from 'react-redux'
import { authStore, type AppDispatch } from '@/store/authStore'
import { checkSessionAsync } from '@/store/slices/authSlice'

function SessionBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    void dispatch(checkSessionAsync())
  }, [dispatch])

  return <>{children}</>
}

export function StoreProvider({ children }: PropsWithChildren) {
  return (
    <Provider store={authStore}>
      <SessionBootstrap>{children}</SessionBootstrap>
    </Provider>
  )
}

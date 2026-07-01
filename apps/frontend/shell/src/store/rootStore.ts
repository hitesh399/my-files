import { configureStore, type Reducer } from '@reduxjs/toolkit'

type RemoteAuthSliceModule = {
  default: Reducer
}

export async function createRootStore() {
  const authSliceModule = (await import('auth_mfe/authSlice')) as RemoteAuthSliceModule

  return configureStore({
    reducer: {
      auth: authSliceModule.default,
    },
  })
}

export type RootStore = Awaited<ReturnType<typeof createRootStore>>
export type RootState = ReturnType<RootStore['getState']>
export type AppDispatch = RootStore['dispatch']

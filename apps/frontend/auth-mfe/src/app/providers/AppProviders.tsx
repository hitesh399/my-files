import '@/index.css'
import type { PropsWithChildren } from 'react'
import { StoreProvider } from '@/app/providers/StoreProvider'
import { LoginUiProvider } from '@/context/LoginUiContext'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <StoreProvider>
      <LoginUiProvider>{children}</LoginUiProvider>
    </StoreProvider>
  )
}

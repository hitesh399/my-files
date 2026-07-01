import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

interface LoginUiContextValue {
  rememberMe: boolean
  setRememberMe: (next: boolean) => void
}

const LoginUiContext = createContext<LoginUiContextValue | undefined>(undefined)

export function LoginUiProvider({ children }: PropsWithChildren) {
  const [rememberMe, setRememberMe] = useState(false)

  const value = useMemo(
    () => ({
      rememberMe,
      setRememberMe,
    }),
    [rememberMe],
  )

  return (
    <LoginUiContext.Provider value={value}>{children}</LoginUiContext.Provider>
  )
}

export function useLoginUiContext() {
  const context = useContext(LoginUiContext)

  if (!context) {
    throw new Error('useLoginUiContext must be used within LoginUiProvider')
  }

  return context
}

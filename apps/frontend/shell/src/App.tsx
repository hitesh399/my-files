import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { resolveRemoteComponent } from './units/resolveRemoteComponent'

const LoginUiProvider = lazy(() =>
  import('auth_mfe/LoginUiProvider').then((module) => ({
    default: resolveRemoteComponent(module, 'LoginUiProvider'),
  })),
)
const LoginPage = lazy(() =>
  import('auth_mfe/LoginPage').then((module) => ({
    default: resolveRemoteComponent(module, 'LoginPage'),
  })),
)
const ProfilePage = lazy(() =>
  import('auth_mfe/ProfilePage').then((module) => ({
    default: resolveRemoteComponent(module, 'ProfilePage'),
  })),
)

type AuthState = {
  user: { id?: string } | null
  sessionChecked: boolean
}

type RootState = {
  auth: AuthState
}

function AuthGate() {
  const sessionChecked = useSelector((state: RootState) => state.auth.sessionChecked)

  if (!sessionChecked) {
    return <div style={{ padding: '1rem' }}>Checking session...</div>
  }

  return <RoutesView />
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, sessionChecked } = useSelector((state: RootState) => state.auth)

  if (!sessionChecked) {
    return <div style={{ padding: '1rem' }}>Checking session...</div>
  }

  if (user) {
    return <Navigate to="/profile" replace />
  }

  return <>{children}</>
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, sessionChecked } = useSelector((state: RootState) => state.auth)

  if (!sessionChecked) {
    return <div style={{ padding: '1rem' }}>Checking session...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function RoutesView() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginUiProvider>
              <LoginPage />
            </LoginUiProvider>
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/profile" replace />} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  )
}

function App() {
  console.log('Hello....')
  return (
    <Suspense fallback={<div style={{ padding: '1rem' }}>Loading auth module...</div>}>
      <AuthGate />
    </Suspense>
  )
}

export default App

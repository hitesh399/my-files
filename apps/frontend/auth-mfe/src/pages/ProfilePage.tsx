import '@/index.css'
import { Navigate } from 'react-router-dom'
import { ProfileCard } from '@/components/ProfileCard'
import { useAppSelector } from '@/store/hooks'

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user)
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked)

  if (!sessionChecked) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Profile
        </h1>
      </header>

      <section className="max-w-md">
        <ProfileCard />
      </section>
    </main>
  )
}

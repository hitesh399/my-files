import '@/index.css'
import { LoginForm } from '@/components/LoginForm'

export function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Sign in
        </h1>
      </div>

      <p className="mb-8 max-w-xl text-slate-600">
        Enter your account credentials to access your profile.
      </p>

      <div className="max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}

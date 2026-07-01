import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logoutAsync } from '@/store/slices/authSlice'

export function ProfileCard() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Account details
      </h2>
      <p className="mt-2 text-slate-600">
        {user?.firstName} {user?.lastName}
      </p>
      <p className="text-sm text-slate-500">{user?.email}</p>

      <button
        type="button"
        onClick={() => {
          void dispatch(logoutAsync())
        }}
        className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Logout
      </button>
    </article>
  )
}

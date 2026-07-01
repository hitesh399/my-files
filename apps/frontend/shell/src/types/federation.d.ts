declare module 'auth_mfe/LoginPage' {
  import type { ReactElement } from 'react'

  export function LoginPage(): ReactElement
}

declare module 'auth_mfe/ProfilePage' {
  import type { ReactElement } from 'react'

  export function ProfilePage(): ReactElement
}

declare module 'auth_mfe/LoginUiProvider' {
  import type { PropsWithChildren, ReactElement } from 'react'

  export function LoginUiProvider(props: PropsWithChildren): ReactElement
}

declare module 'auth_mfe/authSlice' {
  import type { Reducer } from '@reduxjs/toolkit'

  const authReducer: Reducer
  export default authReducer

  export function checkSessionAsync(): unknown
}

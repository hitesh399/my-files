import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getSessionUser,
  login,
  logoutSession,
  type LoginRequest,
  type User,
} from '@/services/authService'

interface AuthState {
  user: User | null
  sessionChecked: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  sessionChecked: false,
  status: 'idle',
  error: null,
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      return await login(payload)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unable to login',
      )
    }
  },
)

export const checkSessionAsync = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      return await getSessionUser()
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unable to validate session',
      )
    }
  },
)

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutSession()
      return null
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unable to logout',
      )
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.sessionChecked = true
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.sessionChecked = true
        state.error = (action.payload as string) ?? 'Unable to login'
      })
      .addCase(checkSessionAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(checkSessionAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.user = action.payload
        state.sessionChecked = true
        state.error = null
      })
      .addCase(checkSessionAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.user = null
        state.sessionChecked = true
        state.error = (action.payload as string) ?? 'Unable to validate session'
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null
        state.status = 'idle'
        state.error = null
        state.sessionChecked = true
      })
  },
})

export default authSlice.reducer

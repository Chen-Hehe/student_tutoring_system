import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    registerStart: (state) => {
      state.loading = true
      state.error = null
    },
    registerSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload
      state.error = null
    },
    registerFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
    state.token = null
    state.user = null
    state.isAuthenticated = false
    state.loading = false
    state.error = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  clearError: (state) => {
    state.error = null
  },
  // 从 storage 恢复状态（用于页面刷新）
  restoreAuth: (state, action) => {
    const { user, token } = action.payload
    state.isAuthenticated = !!token
    state.user = user
    state.token = token
    state.loading = false
    state.error = null
  }
  }
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  restoreAuth
} = authSlice.actions

export default authSlice.reducer

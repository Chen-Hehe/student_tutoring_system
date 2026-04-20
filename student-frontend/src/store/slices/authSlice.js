import { createSlice } from '@reduxjs/toolkit'

// 从 localStorage 恢复用户信息
const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')

const initialState = {
  isAuthenticated: !!storedToken && !!storedUser,
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      // 持久化到 localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      // 清除 localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      // 同步到 localStorage
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    // 从 storage 恢复状态（用于页面刷新）
    restoreAuth: (state, action) => {
      const { user, token } = action.payload
      state.isAuthenticated = !!token
      state.user = user
      state.token = token
    },
  },
})

export const { login, logout, updateUser, restoreAuth } = authSlice.actions
export default authSlice.reducer

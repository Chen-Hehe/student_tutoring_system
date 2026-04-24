import axios from 'axios'

// API 基础 URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// 创建 axios 实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 Token 和用户 ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加用户 ID 到请求头（后端需要 X-User-Id）
    if (user && user.id) {
      config.headers['X-User-Id'] = Number(user.id)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    // 对于 TaskController 返回的 List<Task>，直接返回 response.data
    // 对于其他 API 返回的带有 code 字段的响应，检查 code 是否等于 200
    if (response.data && typeof response.data === 'object' && 'code' in response.data) {
      if (response.data.code !== 200) {
        return Promise.reject(new Error(response.data.message || '请求失败'))
      }
    }
    return response.data
  },
  (error) => {
    // 处理 401 未授权
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证相关 API
export const authAPI = {
  // 登录
  login: (data) => {
    return api.post('/auth/login', data)
  },
  
  // 注册
  register: (data) => {
    return api.post('/auth/register', data)
  },
  
  // 获取用户信息
  getUserInfo: () => {
    return api.get('/auth/info')
  }
}

export default api

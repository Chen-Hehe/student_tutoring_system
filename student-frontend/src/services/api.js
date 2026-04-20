import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 token 和用户 ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加用户 ID 请求头（聊天接口需要）
    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData?.id) {
          config.headers['X-User-Id'] = userData.id
        }
      } catch (e) {
        console.warn('解析用户信息失败:', e)
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

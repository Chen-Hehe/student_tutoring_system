import axios from 'axios';

// API 基础 URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加用户 ID 到请求头（后端需要 X-User-Id）
    if (user && user.id) {
      config.headers['X-User-Id'] = user.id;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 处理后端返回的数据格式
    if (response.data) {
      // 检查是否是标准的Result格式
      if (response.data.code !== undefined) {
        // 返回格式：{ code: 200, message: "success", data: [...] }
        return {
          success: response.data.code === 200,
          data: response.data.data
        };
      }
    }
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authApi = {
  // 登录
  login: (username, password, role) => {
    return api.post('/auth/login', { username, password, role });
  },
  // 注册
  register: (data) => {
    return api.post('/auth/register', data);
  },
  // 忘记密码
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  }
};

// 内容相关API
export const contentApi = {
  // 获取公告
  getAnnouncements: () => {
    return api.get('/admin/content/announcements');
  }
};

export default api;
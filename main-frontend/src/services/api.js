import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    return api.get('/content/announcements');
  }
};

export default api;
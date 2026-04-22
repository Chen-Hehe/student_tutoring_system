import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch } from 'react-redux'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App.jsx'
import store from './store/index.js'
import { loginSuccess, restoreAuth } from './store/slices/authSlice'
import './index.css'

// 处理 URL 参数中的 token 和 user 信息
const UrlParamsHandler = ({ children }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  
  useEffect(() => {
    // 从 URL 参数中获取 token 和 user 信息
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userStr = params.get('user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr))
        // 存储到 localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', userStr)
        // 更新 Redux store
        dispatch(loginSuccess({ token, user }))
        // 移除 URL 参数
        window.history.replaceState({}, document.title, location.pathname)
      } catch (error) {
        console.error('解析 URL 参数失败:', error)
      }
    } else {
      // 从 localStorage 恢复认证状态
      const storedToken = localStorage.getItem('token')
      const storedUserStr = localStorage.getItem('user')
      
      if (storedToken && storedUserStr) {
        try {
          const user = JSON.parse(storedUserStr)
          dispatch(restoreAuth({ token: storedToken, user }))
          console.log('已从 localStorage 恢复登录状态:', user.username)
        } catch (error) {
          console.error('恢复登录状态失败:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    }
  }, [location.search, dispatch])
  
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <UrlParamsHandler>
            <App />
          </UrlParamsHandler>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)

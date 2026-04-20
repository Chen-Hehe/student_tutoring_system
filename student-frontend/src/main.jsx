import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import store from './store'
import { restoreAuth } from './store/slices/authSlice'
import './index.css'

// 初始化认证状态的组件
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    // 从 localStorage 恢复认证状态
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        dispatch(restoreAuth({ token, user }))
        console.log('已恢复登录状态:', user.username)
      } catch (error) {
        console.error('恢复登录状态失败:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [dispatch])
  
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#4CAF50' } }}>
          <AuthInitializer>
            <App />
          </AuthInitializer>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice'
import { authAPI } from '../services/api'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  const [selectedRole, setSelectedRole] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const roleOptions = [
    { value: 1, label: '教育教师', icon: '👩‍🏫' },
    { value: 2, label: '儿童/学生', icon: '👨‍🎓' },
    { value: 3, label: '家长/监护人', icon: '👨‍👩‍👧‍👦' },
    { value: 4, label: '管理员', icon: '🔧' }
  ]

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const login = async () => {
    if (!username || !password) {
      alert('请输入用户名和密码')
      return
    }
    
    if (!selectedRole) {
      alert('请选择角色')
      return
    }

    dispatch(clearError())
    dispatch(loginStart())

    try {
      // 直接模拟登录成功，绕过后端请求
      const mockResponse = {
        code: 200,
        data: {
          token: 'mock-token-' + Date.now(),
          user: {
            id: 1,
            username: username,
            role: selectedRole,
            name: '管理员'
          }
        }
      }
      
      dispatch(loginSuccess(mockResponse.data))
      alert('登录成功')
      navigate('/dashboard')
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || '登录失败'
      dispatch(loginFailure(errorMsg))
      alert(errorMsg)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f0f8ff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <style>
        {
          `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          .container {
            max-width: 500px;
            width: 100%;
            padding: 20px;
          }
          
          .login-card {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            text-align: center;
          }
          
          h1 {
            color: #4CAF50;
            margin-bottom: 30px;
            font-size: 2em;
          }
          
          .logo {
            font-size: 4em;
            margin-bottom: 20px;
            color: #4CAF50;
          }
          
          .form-group {
            margin-bottom: 20px;
            text-align: left;
          }
          
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
          }
          
          input[type="text"],
          input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1em;
            transition: all 0.3s ease;
          }
          
          input[type="text"]:focus,
          input[type="password"]:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
          }
          
          .role-selection {
            margin: 20px 0;
            text-align: left;
          }
          
          .role-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 10px;
          }
          
          .role-option {
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
          }
          
          .role-option:hover {
            border-color: #4CAF50;
            background-color: #f9fff9;
          }
          
          .role-option.selected {
            border-color: #4CAF50;
            background-color: #e8f5e8;
          }
          
          .role-option i {
            font-size: 2em;
            margin-bottom: 10px;
            display: block;
          }
          
          .btn-login {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 20px;
          }
          
          .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
          }
          
          .links {
            margin-top: 20px;
            font-size: 0.9em;
          }
          
          .links a {
            color: #4CAF50;
            text-decoration: none;
            margin: 0 10px;
          }
          
          .links a:hover {
            text-decoration: underline;
          }
          
          @media (max-width: 768px) {
            .container {
              padding: 10px;
            }
            
            .login-card {
              padding: 20px;
            }
            
            .role-options {
              grid-template-columns: 1fr;
            }
          }
        `
        }
      </style>
      
      <div className="container">
        <div className="login-card">
          <div className="logo">🎓</div>
          <h1>登录乡村助学平台</h1>
          
          <form>
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input 
                type="text" 
                id="username" 
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input 
                type="password" 
                id="password" 
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="role-selection">
              <label>选择角色</label>
              <div className="role-options">
                {roleOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`role-option ${selectedRole === option.value ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect(option.value)}
                  >
                    <i>{option.icon}</i>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              type="button" 
              className="btn-login" 
              onClick={login}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
            
            <div className="links">
              <Link to="/register">注册新账号</Link>
              <Link to="/forgot-password">忘记密码</Link>
              <Link to="/">返回首页</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

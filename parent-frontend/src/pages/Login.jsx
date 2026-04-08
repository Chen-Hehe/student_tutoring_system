import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice'
import { authAPI } from '../services/api'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  const [selectedRole, setSelectedRole] = useState(null)
  const [form] = Form.useForm()

  // 角色选项
  const roleOptions = [
    { value: 1, label: '教育教师', icon: '👩‍🏫' },
    { value: 2, label: '儿童/学生', icon: '👨‍🎓' },
    { value: 3, label: '家长/监护人', icon: '👨‍👩‍👧‍👦' },
    { value: 4, label: '管理员', icon: '🔧' }
  ]

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    form.setFieldsValue({ role })
  }

  const onFinish = async (values) => {
    dispatch(clearError())
    dispatch(loginStart())

    try {
      // 模拟登录功能，方便查看家长端页面效果
      if (values.role === 3 && (values.username === 'admin' || values.username === 'parent') && values.password === 'admin') {
        const mockResponse = {
          code: 200,
          data: {
            token: 'mock-token',
            user: {
              id: 1,
              username: values.username,
              role: 3,
              name: '王家长'
            }
          }
        }
        dispatch(loginSuccess(mockResponse.data))
        message.success('登录成功')
        navigate('/dashboard')
        return
      }

      const response = await authAPI.login({
        username: values.username,
        password: values.password,
        role: values.role
      })

      if (response.code === 200) {
        dispatch(loginSuccess(response.data))
        message.success('登录成功')
        navigate('/dashboard')
      } else {
        dispatch(loginFailure(response.message || '登录失败'))
        message.error(response.message || '登录失败')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || '登录失败'
      dispatch(loginFailure(errorMsg))
      message.error(errorMsg)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f0f8ff' 
    }}>
      <div style={{ 
        maxWidth: 500, 
        width: '100%', 
        padding: 20 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: 40,
          borderRadius: 15,
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4em', marginBottom: 20, color: '#4CAF50' }}>🎓</div>
          <h1 style={{ color: '#4CAF50', marginBottom: 30, fontSize: '2em' }}>登录乡村助学平台</h1>
          
          <Form 
            form={form}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item 
              name="username" 
              label="用户名" 
              rules={[{ required: true, message: '请输入用户名' }]}
              style={{ textAlign: 'left', marginBottom: 20 }}
            >
              <Input 
                placeholder="请输入用户名"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: '1em',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4CAF50'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              label="密码" 
              rules={[{ required: true, message: '请输入密码' }]}
              style={{ textAlign: 'left', marginBottom: 20 }}
            >
              <Input.Password 
                placeholder="请输入密码"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: '1em',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4CAF50'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </Form.Item>

            <Form.Item 
              name="role" 
              label="选择角色" 
              rules={[{ required: true, message: '请选择角色' }]}
              style={{ textAlign: 'left', marginBottom: 20 }}
            >
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 10, 
                marginTop: 10 
              }}>
                {roleOptions.map((option) => (
                  <div 
                    key={option.value}
                    style={{
                      padding: 15,
                      border: `2px solid ${selectedRole === option.value ? '#4CAF50' : '#e0e0e0'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      backgroundColor: selectedRole === option.value ? '#e8f5e8' : 'transparent'
                    }}
                    onClick={() => handleRoleSelect(option.value)}
                    onMouseEnter={(e) => {
                      if (selectedRole !== option.value) {
                        e.currentTarget.style.borderColor = '#4CAF50'
                        e.currentTarget.style.backgroundColor = '#f9fff9'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRole !== option.value) {
                        e.currentTarget.style.borderColor = '#e0e0e0'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <div style={{ fontSize: '2em', marginBottom: 10, display: 'block' }}>{option.icon}</div>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{
                  width: '100%',
                  padding: 15,
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: 20
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(76, 175, 80, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                登录
              </Button>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9em' }}>
              <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'none', margin: '0 10px' }}>注册新账号</Link>
              <Link to="/forgot-password" style={{ color: '#4CAF50', textDecoration: 'none', margin: '0 10px' }}>忘记密码</Link>
              <Link to="/" style={{ color: '#4CAF50', textDecoration: 'none', margin: '0 10px' }}>返回首页</Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login

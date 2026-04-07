import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { login } from '../store/slices/authSlice'
import api from '../services/api'

const { Title } = Typography

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const response = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
        role: 'STUDENT',
      })
      
      if (response.code === 200) {
        dispatch(login({ user: response.data.user, token: response.data.token }))
        message.success('登录成功！')
        navigate('/dashboard')
      } else {
        message.error(response.message || '登录失败')
      }
    } catch (error) {
      message.error(error.response?.data?.message || '登录失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card style={{ width: 400, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2} style={{ color: '#4CAF50' }}>🦞 乡村助学平台</Title>
          <Title level={4} style={{ color: '#666' }}>学生端登录</Title>
        </div>
        
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register">还没有账号？立即注册</Link>
            <br />
            <Link to="/forgot-password" style={{ float: 'right' }}>忘记密码？</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login

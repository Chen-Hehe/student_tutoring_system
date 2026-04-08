import { useState } from 'react'
import { Form, Input, Button, Card, Select, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice'
import { authAPI } from '../services/api'

const { Option } = Select

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  // 角色选项
  const roleOptions = [
    { value: 1, label: '教师' },
    { value: 2, label: '学生' },
    { value: 3, label: '家长' },
    { value: 4, label: '管理员' }
  ]

  const onFinish = async (values) => {
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
            username: values.username,
            role: values.role,
            name: '管理员'
          }
        }
      }
      
      dispatch(loginSuccess(mockResponse.data))
      message.success('登录成功')
      navigate('/dashboard')
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <Card 
        style={{ width: 400 }} 
        title="用户登录"
        headStyle={{ textAlign: 'center', fontSize: '20px' }}
      >
        <Form onFinish={onFinish} size="large">
          <Form.Item 
            name="role" 
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select 
              prefix={<UserOutlined />} 
              placeholder="请选择角色" 
              size="large"
            >
              {roleOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="username" 
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>

          <Form.Item 
            name="password" 
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
            >
              登录
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <span>还没有账号？</span>
            <Link to="/register">立即注册</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login

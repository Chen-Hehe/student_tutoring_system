import { useState } from 'react'
import { Form, Input, Button, Card, Select, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerStart, registerSuccess, registerFailure, clearError } from '../store/slices/authSlice'
import { authAPI } from '../services/api'

const { Option } = Select

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  const [form] = Form.useForm()

  // 角色选项
  const roleOptions = [
    { value: 1, label: '教师' },
    { value: 2, label: '学生' },
    { value: 3, label: '家长' },
    { value: 4, label: '管理员' }
  ]

  const onFinish = async (values) => {
    dispatch(clearError())
    dispatch(registerStart())

    try {
      const response = await authAPI.register({
        username: values.username,
        password: values.password,
        role: values.role,
        name: values.name,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        qq: values.qq,
        wechat: values.wechat
      })

      if (response.code === 200) {
        dispatch(registerSuccess(response.data))
        message.success('注册成功，请登录')
        navigate('/login')
      } else {
        dispatch(registerFailure(response.message || '注册失败'))
        message.error(response.message || '注册失败')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || '注册失败'
      dispatch(registerFailure(errorMsg))
      message.error(errorMsg)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ width: 450, maxWidth: '100%' }} 
        title="用户注册"
        headStyle={{ textAlign: 'center', fontSize: '20px' }}
      >
        <Form 
          form={form}
          onFinish={onFinish} 
          size="large"
          layout="vertical"
        >
          <Form.Item 
            name="role" 
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色" size="large">
              {roleOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="username" 
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少 3 个字符' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 个字符' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>

          <Form.Item 
            name="confirmPassword" 
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item 
            name="name" 
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item 
            name="email" 
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item 
            name="phone" 
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item 
            name="gender" 
            label="性别"
          >
            <Select placeholder="请选择性别">
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
            </Select>
          </Form.Item>

          <Form.Item name="qq" label="QQ 号">
            <Input placeholder="请输入 QQ 号（选填）" />
          </Form.Item>

          <Form.Item name="wechat" label="微信">
            <Input placeholder="请输入微信号（选填）" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
              style={{ marginTop: '10px' }}
            >
              注册
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <span>已有账号？</span>
            <Link to="/login">立即登录</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Register

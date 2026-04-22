import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { contentApi } from './services/api';

// 主页组件
const Home = () => {
  const [announcements, setAnnouncements] = useState([]);

  // 获取公告
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await contentApi.getAnnouncements();
        // 使用响应拦截器处理后的数据格式
        setAnnouncements(response.data || []);
      } catch (error) {
        console.error('获取公告失败:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div>
      {/* 头部 */}
      <header className="header">
        <h1>乡村助学平台</h1>
        <p>连接城市教师与乡村孩子的桥梁</p>
        <div className="header-buttons">
          <Link to="/login"><button>登录</button></Link>
          <Link to="/register"><button>注册</button></Link>
          <Link to="/about"><button>关于我们</button></Link>
        </div>
      </header>

      <div className="container">
        {/* 系统介绍 */}
        <section className="section">
          <h2>让每个孩子都能接受优质教育</h2>
          <p>乡村助学平台致力于解决教育公平问题，为乡村孩子提供优质的教育资源和心理支持。通过连接城市教师和乡村学生，我们希望能够缩小城乡教育差距，让每个孩子都能拥有平等的学习机会。</p>
        </section>

        {/* 功能特点 */}
        <section className="section">
          <h2>平台功能</h2>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>教学辅导</h3>
              <p>城市教师为乡村学生提供一对一的教学辅导，帮助他们解决学习问题，提高学习成绩。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>心理教育</h3>
              <p>为留守儿童提供及时的心理干预和支持，帮助他们健康成长，建立积极的心态。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI智能匹配</h3>
              <p>利用AI技术为学生匹配合适的教师，为教师筛选目标学生，提高教学效率和质量。</p>
            </div>
          </div>
        </section>

        {/* 系统角色 */}
        <section className="section">
          <h2>系统角色</h2>
          <div className="roles">
            <Link to="/login?role=teacher" className="role-card">
              <h3>教育教师</h3>
              <p>提供教学辅导和心理教育</p>
            </Link>
            <Link to="/login?role=student" className="role-card">
              <h3>儿童/学生</h3>
              <p>接受教育辅导和心理支持</p>
            </Link>
            <Link to="/login?role=parent" className="role-card">
              <h3>家长/监护人</h3>
              <p>了解孩子的学习情况和心理状态</p>
            </Link>
            <Link to="/login?role=admin" className="role-card">
              <h3>管理员</h3>
              <p>管理系统用户和内容</p>
            </Link>
          </div>
        </section>

        {/* 公告展示 */}
        <section className="section">
          <h2>最新公告</h2>
          <div className="announcements">
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <div key={index} className="announcement-item">
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                  <p className="announcement-date">{announcement.publishDate}</p>
                </div>
              ))
            ) : (
              <p>暂无公告</p>
            )}
          </div>
        </section>
      </div>

      {/* 底部 */}
      <footer className="footer">
        <p>© 2026 乡村助学平台. 保留所有权利.</p>
      </footer>
    </div>
  );
};

// 登录组件
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('teacher');
  const [error, setError] = useState('');

  // 角色映射
  const roleMap = {
    teacher: 1,
    student: 2,
    parent: 3,
    admin: 4
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const roleId = roleMap[selectedRole];
      console.log('登录请求参数:', { username, password, role: roleId });
      
      // 直接使用axios调用登录接口
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
        role: roleId
      });
      console.log('登录响应:', response);
      
      const { token, user } = response.data.data;
      console.log('登录成功，获取到token:', token);
      console.log('登录成功，获取到user:', user);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 根据角色重定向到相应的前端
      const roleRedirects = {
        teacher: 'http://localhost:3005/',
        student: 'http://localhost:3003/',
        parent: 'http://localhost:3004/',
        admin: 'http://localhost:3008/'
      };
      
      // 构建重定向 URL，包含 token 和 user 信息作为查询参数
      const redirectUrl = roleRedirects[selectedRole];
      const redirectWithParams = `${redirectUrl}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(user))}`;
      
      console.log('准备重定向到:', redirectWithParams);
      // 使用 setTimeout 延迟跳转，确保所有操作都完成
      setTimeout(() => {
        window.location.href = redirectWithParams;
      }, 500);
    } catch (error) {
      setError('登录失败，请检查用户名、密码和角色是否正确');
      console.error('登录失败:', error);
      if (error.response) {
        console.error('错误响应:', error.response.data);
      } else if (error.request) {
        console.error('请求已发送但没有收到响应:', error.request);
      } else {
        console.error('请求配置出错:', error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>登录乡村助学平台</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>用户名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>选择角色</label>
          <div className="role-selector">
            <div
              className={`role-option ${selectedRole === 'teacher' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('teacher')}
            >
              <h3>教育教师</h3>
              <p>提供教学辅导</p>
            </div>
            <div
              className={`role-option ${selectedRole === 'student' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('student')}
            >
              <h3>儿童/学生</h3>
              <p>接受教育辅导</p>
            </div>
            <div
              className={`role-option ${selectedRole === 'parent' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('parent')}
            >
              <h3>家长/监护人</h3>
              <p>了解孩子情况</p>
            </div>
            <div
              className={`role-option ${selectedRole === 'admin' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              <h3>管理员</h3>
              <p>管理系统</p>
            </div>
          </div>
        </div>
        <button type="submit" className="btn-primary">登录</button>
        <div className="form-links">
          <Link to="/register">注册新账号</Link>
          <Link to="/forgot-password">忘记密码</Link>
          <Link to="/">返回首页</Link>
        </div>
      </form>
    </div>
  );
};

// 注册组件
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: '',
    role: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      });
      
      setSuccess('注册成功，请登录');
      // 清空表单
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        phone: '',
        role: 1
      });
    } catch (error) {
      setError('注册失败，请检查输入信息');
      console.error('注册失败:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>注册乡村助学平台</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>用户名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>密码</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>确认密码</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>姓名</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>邮箱</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>手机号</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>选择角色</label>
          <div className="role-selector">
            <div
              className={`role-option ${formData.role === 1 ? 'selected' : ''}`}
              onClick={() => handleRoleChange(1)}
            >
              <h3>教育教师</h3>
            </div>
            <div
              className={`role-option ${formData.role === 2 ? 'selected' : ''}`}
              onClick={() => handleRoleChange(2)}
            >
              <h3>儿童/学生</h3>
            </div>
            <div
              className={`role-option ${formData.role === 3 ? 'selected' : ''}`}
              onClick={() => handleRoleChange(3)}
            >
              <h3>家长/监护人</h3>
            </div>
            <div
              className={`role-option ${formData.role === 4 ? 'selected' : ''}`}
              onClick={() => handleRoleChange(4)}
            >
              <h3>管理员</h3>
            </div>
          </div>
        </div>
        <button type="submit" className="btn-primary">注册</button>
        <div className="form-links">
          <Link to="/login">已有账号，去登录</Link>
          <Link to="/">返回首页</Link>
        </div>
      </form>
    </div>
  );
};

// 忘记密码组件
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // 这里应该调用后端的忘记密码API
      // 暂时模拟成功
      setMessage('重置密码链接已发送到您的邮箱');
      setEmail('');
    } catch (error) {
      setError('发送失败，请检查邮箱是否正确');
      console.error('忘记密码失败:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>忘记密码</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      {message && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <p style={{ marginBottom: '1rem', textAlign: 'center' }}>请输入您的邮箱，我们将发送重置密码的链接</p>
        <div className="form-group">
          <label>邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">发送重置链接</button>
        <div className="form-links">
          <Link to="/login">返回登录</Link>
          <Link to="/">返回首页</Link>
        </div>
      </form>
    </div>
  );
};

// 关于我们组件
const About = () => {
  return (
    <div className="container">
      <section className="section">
        <h2>关于我们</h2>
        <p>乡村助学平台是一个致力于解决教育公平问题的非营利性组织，通过连接城市教师和乡村学生，为乡村孩子提供优质的教育资源和心理支持。</p>
        <p>我们的使命是缩小城乡教育差距，让每个孩子都能拥有平等的学习机会，无论他们出生在哪里。</p>
        <p>我们相信，通过技术的力量和社会的关爱，每个孩子都能实现自己的梦想。</p>
      </section>
    </div>
  );
};

// 404组件
const NotFound = () => {
  return (
    <div className="container">
      <section className="section">
        <h2>404 - 页面不存在</h2>
        <p>您访问的页面不存在，请返回首页。</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', marginTop: '1rem' }}>返回首页</Link>
      </section>
    </div>
  );
};

// 主应用组件
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
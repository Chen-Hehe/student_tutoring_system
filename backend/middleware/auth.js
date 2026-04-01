const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由的中间件
const protect = async (req, res, next) => {
  let token;

  // 检查请求头中的 token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 获取 token
      token = req.headers.authorization.split(' ')[1];

      // 验证 token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息（排除密码）
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: '用户不存在' });
      }

      next();
    } catch (error) {
      console.error('认证错误:', error);
      return res.status(401).json({ message: '认证失败，请重新登录' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: '未授权，请先登录' });
  }
};

// 角色授权中间件
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `用户角色 ${req.user?.role} 无权访问此资源` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

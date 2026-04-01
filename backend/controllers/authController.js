const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');

// 生成 JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    用户注册
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, password, name, email, role, phone, gender, birthDate, qq, wechat, address } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: '用户名或邮箱已被使用' });
    }

    // 创建用户
    const user = await User.create({
      username,
      password,
      name,
      email,
      role,
      phone,
      gender,
      birthDate,
      qq,
      wechat,
      address
    });

    // 根据角色创建对应的详细信息
    if (role === 'student') {
      await Student.create({
        user: user._id,
        age: req.body.age || 0,
        grade: req.body.grade || '',
        school: req.body.school || '',
        address: req.body.address
      });
    } else if (role === 'teacher') {
      await Teacher.create({
        user: user._id,
        subject: req.body.subject || '',
        education: req.body.education || '',
        experience: req.body.experience || '',
        specialties: req.body.specialties || []
      });
    } else if (role === 'parent') {
      await Parent.create({
        user: user._id,
        children: [],
        relationship: req.body.relationship
      });
    }

    // 生成 token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ message: '请提供用户名和密码' });
    }

    // 查找用户（包含密码字段）
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取当前用户信息
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // 根据角色获取详细信息
    let detail = null;
    if (user.role === 'student') {
      detail = await Student.findOne({ user: user._id }).populate('guardian');
    } else if (user.role === 'teacher') {
      detail = await Teacher.findOne({ user: user._id });
    } else if (user.role === 'parent') {
      detail = await Parent.findOne({ user: user._id }).populate('children');
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        birthDate: user.birthDate,
        qq: user.qq,
        wechat: user.wechat,
        address: user.address,
        avatar: user.avatar
      },
      detail
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新用户信息
// @route   PUT /api/auth/update
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, birthDate, qq, wechat, address, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, gender, birthDate, qq, wechat, address, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    修改密码
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '请提供当前密码和新密码' });
    }

    const user = await User.findById(req.user.id).select('+password');
    
    // 验证当前密码
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: '当前密码错误' });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');

// @desc    获取所有用户（管理员）
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    const query = role ? { role } : {};
    
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取单个用户
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('获取用户错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新用户（管理员）
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { username, name, email, role, phone, gender, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, name, email, role, phone, gender, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    删除用户（管理员）
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 删除关联的详细信息
    await Student.deleteOne({ user: req.params.id });
    await Teacher.deleteOne({ user: req.params.id });
    await Parent.deleteOne({ user: req.params.id });

    await user.deleteOne();

    res.json({
      success: true,
      message: '用户已删除'
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取所有教师
// @route   GET /api/users/teachers
// @access  Public
exports.getTeachers = async (req, res) => {
  try {
    const { subject, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (subject) {
      query.subject = subject;
    }

    const teachers = await Teacher.find(query)
      .populate('user', 'name username email avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Teacher.countDocuments(query);

    res.json({
      success: true,
      teachers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取教师列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取所有学生
// @route   GET /api/users/students
// @access  Private
exports.getStudents = async (req, res) => {
  try {
    const { grade, school, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (grade) query.grade = grade;
    if (school) query.school = school;

    const students = await Student.find(query)
      .populate('user', 'name username email avatar')
      .populate('guardian')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Student.countDocuments(query);

    res.json({
      success: true,
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取学生列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

const express = require('express');
const router = express.Router();
const TeacherStudentMatch = require('../models/TeacherStudentMatch');
const AIMatch = require('../models/AIMatch');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');

// 所有路由都需要认证
router.use(protect);

// ==================== 师生匹配 ====================

// @desc    创建匹配请求
// @route   POST /api/matches/request
// @access  Private
router.post('/request', protect, async (req, res) => {
  try {
    const { studentId, teacherId, requesterType, requestMessage } = req.body;

    // 验证用户权限
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      if (!student || student._id.toString() !== studentId) {
        return res.status(403).json({ message: '无权代表该学生发送请求' });
      }
    } else if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: req.user.id });
      if (!teacher || teacher._id.toString() !== teacherId) {
        return res.status(403).json({ message: '无权代表该教师发送邀请' });
      }
    }

    const match = await TeacherStudentMatch.create({
      student: studentId,
      teacher: teacherId,
      requesterType,
      requestMessage,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      match
    });
  } catch (error) {
    console.error('创建匹配请求错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// @desc    获取我的匹配列表
// @route   GET /api/matches
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = {};

    // 根据角色过滤
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      query.student = student._id;
    } else if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: req.user.id });
      query.teacher = teacher._id;
    } else if (req.user.role === 'parent') {
      // 家长的匹配
      // 需要查询孩子的匹配
    }

    if (status) {
      query.status = status;
    }

    const matches = await TeacherStudentMatch.find(query)
      .populate('student', 'user grade school')
      .populate('teacher', 'user subject education')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await TeacherStudentMatch.countDocuments(query);

    res.json({
      success: true,
      matches,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取匹配列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// @desc    确认匹配
// @route   PUT /api/matches/:id/confirm
// @access  Private
router.put('/:id/confirm', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'student', 'parent', 'teacher'

    const match = await TeacherStudentMatch.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: '匹配记录不存在' });
    }

    // 根据类型更新确认状态
    if (type === 'student') {
      match.studentConfirm = true;
    } else if (type === 'parent') {
      match.parentConfirm = true;
      if (match.status === 'awaiting_parent_confirm') {
        match.status = 'matched';
      }
    } else if (type === 'teacher') {
      match.teacherConfirm = true;
    }

    // 检查是否所有方都已确认
    if (match.studentConfirm && match.parentConfirm && match.teacherConfirm) {
      match.status = 'matched';
      match.startDate = new Date();
    }

    await match.save();

    res.json({
      success: true,
      match
    });
  } catch (error) {
    console.error('确认匹配错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// @desc    拒绝匹配
// @route   PUT /api/matches/:id/reject
// @access  Private
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const match = await TeacherStudentMatch.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: '匹配记录不存在' });
    }

    match.status = 'rejected';
    match.notes = reason;
    await match.save();

    res.json({
      success: true,
      match
    });
  } catch (error) {
    console.error('拒绝匹配错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// ==================== AI 匹配推荐 ====================

// @desc    获取 AI 推荐（给学生推荐老师）
// @route   GET /api/matches/ai/recommend-teachers
// @access  Private (Student)
router.get('/ai/recommend-teachers', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: '只有学生可以查看教师推荐' });
    }

    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ message: '学生信息不存在' });
    }

    // 获取 AI 匹配记录
    const aiMatches = await AIMatch.find({ student: student._id })
      .populate('teacher', 'user subject education experience specialties')
      .sort({ matchScore: -1 })
      .limit(10);

    res.json({
      success: true,
      recommendations: aiMatches
    });
  } catch (error) {
    console.error('获取 AI 推荐错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// @desc    获取 AI 推荐（给老师推荐学生）
// @route   GET /api/matches/ai/recommend-students
// @access  Private (Teacher)
router.get('/ai/recommend-students', protect, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: '只有教师可以查看学生推荐' });
    }

    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) {
      return res.status(404).json({ message: '教师信息不存在' });
    }

    // 获取 AI 匹配记录
    const aiMatches = await AIMatch.find({ teacher: teacher._id })
      .populate('student', 'user grade school learningNeeds')
      .sort({ matchScore: -1 })
      .limit(10);

    res.json({
      success: true,
      recommendations: aiMatches
    });
  } catch (error) {
    console.error('获取 AI 推荐错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

module.exports = router;

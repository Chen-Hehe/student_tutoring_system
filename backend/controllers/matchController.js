const TeacherStudentMatch = require('../models/TeacherStudentMatch');
const AIMatch = require('../models/AIMatch');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');

// @desc    创建匹配请求
// @route   POST /api/matches/request
// @access  Private
exports.createMatchRequest = async (req, res) => {
  try {
    const { studentId, teacherId, requesterType, requestMessage } = req.body;

    // 验证必填字段
    if (!studentId || !teacherId || !requesterType) {
      return res.status(400).json({ message: '请提供学生 ID、教师 ID 和请求类型' });
    }

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

    // 检查是否已存在匹配
    const existingMatch = await TeacherStudentMatch.findOne({
      student: studentId,
      teacher: teacherId,
      status: { $in: ['pending', 'awaiting_parent_confirm', 'matched'] }
    });

    if (existingMatch) {
      return res.status(400).json({ message: '已存在进行中的匹配请求' });
    }

    const match = await TeacherStudentMatch.create({
      student: studentId,
      teacher: teacherId,
      requesterType,
      requestMessage,
      status: 'pending',
      [`${requesterType}Confirm`]: true // 发起方自动确认
    });

    res.status(201).json({
      success: true,
      match
    });
  } catch (error) {
    console.error('创建匹配请求错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取我的匹配列表
// @route   GET /api/matches
// @access  Private
exports.getMyMatches = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = {};

    // 根据角色过滤
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      if (student) {
        query.student = student._id;
      } else {
        return res.json({ success: true, matches: [], total: 0 });
      }
    } else if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: req.user.id });
      if (teacher) {
        query.teacher = teacher._id;
      } else {
        return res.json({ success: true, matches: [], total: 0 });
      }
    } else if (req.user.role === 'parent') {
      const parent = await Parent.findOne({ user: req.user.id });
      if (parent && parent.children && parent.children.length > 0) {
        query.student = { $in: parent.children };
      } else {
        return res.json({ success: true, matches: [], total: 0 });
      }
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
};

// @desc    确认匹配
// @route   PUT /api/matches/:id/confirm
// @access  Private
exports.confirmMatch = async (req, res) => {
  try {
    const { type } = req.body;

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
};

// @desc    拒绝匹配
// @route   PUT /api/matches/:id/reject
// @access  Private
exports.rejectMatch = async (req, res) => {
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
};

// @desc    获取 AI 推荐教师（给学生）
// @route   GET /api/matches/ai/recommend-teachers
// @access  Private (Student)
exports.recommendTeachers = async (req, res) => {
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
};

// @desc    获取 AI 推荐学生（给老师）
// @route   GET /api/matches/ai/recommend-students
// @access  Private (Teacher)
exports.recommendStudents = async (req, res) => {
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
};

// @desc    执行 AI 匹配（管理员）
// @route   POST /api/matches/ai/run
// @access  Private/Admin
exports.runAIMatching = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有管理员可以运行 AI 匹配' });
    }

    const students = await Student.find().populate('user');
    const teachers = await Teacher.find().populate('user');

    let matchCount = 0;

    // 简单的匹配算法（实际项目中应该使用更复杂的 AI 算法）
    for (const student of students) {
      for (const teacher of teachers) {
        // 计算匹配分数
        let score = 0;
        let factors = {
          subject: false,
          grade: false,
          learningStyle: false,
          availability: false
        };

        // 根据学习需求和教师科目匹配
        if (student.learningNeeds && teacher.subject) {
          if (student.learningNeeds.includes(teacher.subject)) {
            score += 40;
            factors.subject = true;
          }
        }

        // 根据年级和教师经验匹配
        if (student.grade && teacher.education) {
          score += 30;
          factors.grade = true;
        }

        // 基础分
        score += 30;

        // 如果分数达到阈值，创建匹配记录
        if (score >= 60) {
          await AIMatch.create({
            student: student._id,
            teacher: teacher._id,
            matchScore: score,
            matchReason: `基于科目、年级等因素的匹配`,
            matchFactors: factors
          });
          matchCount++;
        }
      }
    }

    res.json({
      success: true,
      message: `AI 匹配完成，生成了 ${matchCount} 条匹配记录`
    });
  } catch (error) {
    console.error('AI 匹配错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

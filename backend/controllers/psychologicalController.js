const PsychologicalAssessment = require('../models/PsychologicalAssessment');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// @desc    创建心理评估
// @route   POST /api/psychological
// @access  Private (Teacher/Admin)
exports.createAssessment = async (req, res) => {
  try {
    const { studentId, assessmentDate, score, comments, recommendations } = req.body;

    // 验证必填字段
    if (!studentId || !assessmentDate) {
      return res.status(400).json({ message: '请提供学生 ID 和评估日期' });
    }

    // 验证学生是否存在
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: '学生不存在' });
    }

    const assessment = await PsychologicalAssessment.create({
      student: studentId,
      assessor: req.user.id,
      assessmentDate,
      score,
      comments,
      recommendations: recommendations || [],
      status: 'completed'
    });

    // 更新学生心理状态
    if (score) {
      let status = 'good';
      if (score < 60) {
        status = 'needs_intervention';
      } else if (score < 75) {
        status = 'needs_attention';
      } else if (score < 85) {
        status = 'fair';
      }
      
      await Student.findByIdAndUpdate(studentId, {
        psychologicalStatus: status
      });
    }

    res.status(201).json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('创建心理评估错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取学生的心理评估历史
// @route   GET /api/psychological/student/:studentId
// @access  Private
exports.getStudentAssessments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // 验证权限
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      if (!student || student._id.toString() !== studentId) {
        return res.status(403).json({ message: '无权查看该学生的评估记录' });
      }
    } else if (req.user.role === 'parent') {
      const Parent = require('../models/Parent');
      const parent = await Parent.findOne({ user: req.user.id });
      if (!parent || !parent.children.includes(studentId)) {
        return res.status(403).json({ message: '无权查看该学生的评估记录' });
      }
    } else if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权查看心理评估记录' });
    }

    const assessments = await PsychologicalAssessment.find({ student: studentId })
      .populate('assessor', 'name username role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ assessmentDate: -1 });

    const count = await PsychologicalAssessment.countDocuments({ student: studentId });

    res.json({
      success: true,
      assessments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取心理评估错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新心理评估
// @route   PUT /api/psychological/:id
// @access  Private (Teacher/Admin)
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await PsychologicalAssessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: '评估记录不存在' });
    }

    // 只有评估者或管理员可以更新
    if (assessment.assessor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权更新此评估记录' });
    }

    const { score, comments, recommendations, status } = req.body;

    const updatedAssessment = await PsychologicalAssessment.findByIdAndUpdate(
      req.params.id,
      { score, comments, recommendations, status },
      { new: true, runValidators: true }
    ).populate('assessor', 'name username role');

    res.json({
      success: true,
      assessment: updatedAssessment
    });
  } catch (error) {
    console.error('更新心理评估错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取所有需要心理关注的学生
// @route   GET /api/psychological/attention-needed
// @access  Private (Teacher/Admin)
exports.getAttentionNeededStudents = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权查看此信息' });
    }

    const students = await Student.find({
      psychologicalStatus: { $in: ['needs_attention', 'needs_intervention'] }
    })
    .populate('user', 'name username email phone')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('获取学生列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

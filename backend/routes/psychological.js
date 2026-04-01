const express = require('express');
const router = express.Router();
const {
  createAssessment,
  getStudentAssessments,
  updateAssessment,
  getAttentionNeededStudents
} = require('../controllers/psychologicalController');
const { protect, authorize } = require('../middleware/auth');

// 所有路由都需要认证
router.use(protect);

// 创建心理评估（教师/管理员）
router.post('/', authorize('teacher', 'admin'), createAssessment);

// 获取学生的心理评估历史
router.get('/student/:studentId', getStudentAssessments);

// 更新心理评估
router.put('/:id', authorize('teacher', 'admin'), updateAssessment);

// 获取需要心理关注的学生列表
router.get('/attention/needed', authorize('teacher', 'admin'), getAttentionNeededStudents);

module.exports = router;

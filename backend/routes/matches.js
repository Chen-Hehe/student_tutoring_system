const express = require('express');
const router = express.Router();
const {
  createMatchRequest,
  getMyMatches,
  confirmMatch,
  rejectMatch,
  recommendTeachers,
  recommendStudents,
  runAIMatching
} = require('../controllers/matchController');
const { protect, authorize } = require('../middleware/auth');

// 所有路由都需要认证
router.use(protect);

// ==================== 师生匹配 ====================

// 创建匹配请求
router.post('/request', createMatchRequest);

// 获取我的匹配列表
router.get('/', getMyMatches);

// 确认匹配
router.put('/:id/confirm', confirmMatch);

// 拒绝匹配
router.put('/:id/reject', rejectMatch);

// ==================== AI 匹配推荐 ====================

// 获取 AI 推荐（给学生推荐老师）
router.get('/ai/recommend-teachers', recommendTeachers);

// 获取 AI 推荐（给老师推荐学生）
router.get('/ai/recommend-students', recommendStudents);

// 执行 AI 匹配（管理员）
router.post('/ai/run', authorize('admin'), runAIMatching);

module.exports = router;

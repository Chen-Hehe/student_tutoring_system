const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getTeachers,
  getStudents
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// 所有路由都需要认证
router.use(protect);

// 获取所有用户（管理员）
router.get('/', authorize('admin'), getUsers);
router.get('/teachers', getTeachers);
router.get('/students', authorize('teacher', 'admin'), getStudents);

// 单个用户操作
router.get('/:id', getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;

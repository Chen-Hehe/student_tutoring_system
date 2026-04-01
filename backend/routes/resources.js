const express = require('express');
const router = express.Router();
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  incrementDownload,
  getPopularResources,
  getMyResources
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

// 公开路由
router.get('/', getResources);
router.get('/popular', getPopularResources);
router.get('/:id', getResource);

// 保护的路由
router.post('/', protect, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);
router.put('/:id/download', incrementDownload);
router.get('/my', protect, getMyResources);

module.exports = router;

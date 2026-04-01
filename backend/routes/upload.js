const express = require('express');
const router = express.Router();
const path = require('path');
const { protect } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// @desc    上传文件
// @route   POST /api/upload/:type
// @access  Private
// @param   type - 文件类型：image, document, video, audio
router.post('/:type', protect, upload.single('file'), handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传文件'
      });
    }

    // 构建文件 URL
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

// @desc    批量上传文件
// @route   POST /api/upload/batch/:type
// @access  Private
router.post('/batch/:type', protect, upload.array('files', 10), handleUploadError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请上传文件'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      files,
      count: files.length
    });
  } catch (error) {
    console.error('批量上传错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

module.exports = router;

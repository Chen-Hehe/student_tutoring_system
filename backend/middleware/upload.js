const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名：时间戳 + 随机数 + 原扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'video': ['video/mp4', 'video/webm'],
    'audio': ['audio/mpeg', 'audio/wav', 'audio/ogg']
  };

  // 根据上传类型检查
  const uploadType = req.params.type || 'document';
  
  if (allowedTypes[uploadType] && allowedTypes[uploadType].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件类型：${file.mimetype}`), false);
  }
};

// 创建 multer 实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 默认 10MB
  },
  fileFilter: fileFilter
});

// 错误处理中间件
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `文件大小超过限制 (${process.env.MAX_FILE_SIZE || '10MB'})`
      });
    }
    return res.status(400).json({
      success: false,
      message: `上传错误：${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = { upload, handleUploadError };

const LearningResource = require('../models/LearningResource');
const path = require('path');
const fs = require('fs');

// @desc    获取所有资源
// @route   GET /api/resources
// @access  Public
exports.getResources = async (req, res) => {
  try {
    const { category, subject, grade, type, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (type) query.type = type;

    const resources = await LearningResource.find(query)
      .populate('uploader', 'name username role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await LearningResource.countDocuments(query);

    res.json({
      success: true,
      resources,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取资源列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取单个资源
// @route   GET /api/resources/:id
// @access  Public
exports.getResource = async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id)
      .populate('uploader', 'name username role');

    if (!resource) {
      return res.status(404).json({ message: '资源不存在' });
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('获取资源错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    创建资源
// @route   POST /api/resources
// @access  Private
exports.createResource = async (req, res) => {
  try {
    const { title, description, type, url, category, subject, grade } = req.body;

    const resource = await LearningResource.create({
      title,
      description,
      type,
      url,
      category,
      subject,
      grade,
      uploader: req.user.id
    });

    res.status(201).json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('创建资源错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新资源
// @route   PUT /api/resources/:id
// @access  Private
exports.updateResource = async (req, res) => {
  try {
    let resource = await LearningResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: '资源不存在' });
    }

    // 只有上传者或管理员可以更新
    if (resource.uploader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权更新此资源' });
    }

    resource = await LearningResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('更新资源错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    删除资源
// @route   DELETE /api/resources/:id
// @access  Private
exports.deleteResource = async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: '资源不存在' });
    }

    // 只有上传者或管理员可以删除
    if (resource.uploader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权删除此资源' });
    }

    // 如果是本地文件，删除文件
    if (resource.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', resource.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await resource.deleteOne();

    res.json({
      success: true,
      message: '资源已删除'
    });
  } catch (error) {
    console.error('删除资源错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    增加资源下载次数
// @route   PUT /api/resources/:id/download
// @access  Public
exports.incrementDownload = async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: '资源不存在' });
    }

    resource.downloadCount += 1;
    await resource.save();

    res.json({
      success: true,
      downloadCount: resource.downloadCount
    });
  } catch (error) {
    console.error('更新下载次数错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取热门资源
// @route   GET /api/resources/popular
// @access  Public
exports.getPopularResources = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const resources = await LearningResource.find()
      .populate('uploader', 'name username role')
      .sort({ downloadCount: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      resources
    });
  } catch (error) {
    console.error('获取热门资源错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取我的资源
// @route   GET /api/resources/my
// @access  Private
exports.getMyResources = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const resources = await LearningResource.find({ uploader: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await LearningResource.countDocuments({ uploader: req.user.id });

    res.json({
      success: true,
      resources,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取我的资源错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * 数据库种子脚本
 * 用于创建测试数据
 * 
 * 使用方法：node scripts/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const LearningResource = require('../models/LearningResource');
const PsychologicalAssessment = require('../models/PsychologicalAssessment');
const AIMatch = require('../models/AIMatch');

const connectDatabase = require('../config/database');

const seedData = async () => {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ 数据库连接成功');

    // 清空现有数据
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Parent.deleteMany({});
    await LearningResource.deleteMany({});
    await PsychologicalAssessment.deleteMany({});
    await AIMatch.deleteMany({});
    console.log('✓ 已清空现有数据');

    // 创建管理员
    const admin = await User.create({
      username: 'admin',
      password: await bcrypt.hash('123456', 10),
      name: '管理员',
      email: 'admin@example.com',
      role: 'admin',
      phone: '13800000000'
    });
    console.log('✓ 创建管理员账号：admin / 123456');

    // 创建教师
    const teacher1 = await User.create({
      username: 'teacher_zhang',
      password: await bcrypt.hash('123456', 10),
      name: '张老师',
      email: 'zhang@example.com',
      role: 'teacher',
      phone: '13800000001',
      gender: 'female'
    });

    await Teacher.create({
      user: teacher1._id,
      subject: '数学',
      education: '北京师范大学 数学系 硕士',
      experience: '5 年初中数学教学经验',
      specialties: ['代数', '几何', '奥数'],
      availability: '周末、工作日晚上'
    });
    console.log('✓ 创建教师账号：teacher_zhang / 123456');

    const teacher2 = await User.create({
      username: 'teacher_li',
      password: await bcrypt.hash('123456', 10),
      name: '李老师',
      email: 'li@example.com',
      role: 'teacher',
      phone: '13800000002',
      gender: 'male'
    });

    await Teacher.create({
      user: teacher2._id,
      subject: '英语',
      education: '上海外国语大学 英语专业 本科',
      experience: '3 年英语教学经验',
      specialties: ['口语', '语法', '阅读理解'],
      availability: '周末全天'
    });
    console.log('✓ 创建教师账号：teacher_li / 123456');

    // 创建家长
    const parent1 = await User.create({
      username: 'parent_wang',
      password: await bcrypt.hash('123456', 10),
      name: '王先生',
      email: 'wang@example.com',
      role: 'parent',
      phone: '13800000003',
      gender: 'male'
    });

    const parent2 = await User.create({
      username: 'parent_chen',
      password: await bcrypt.hash('123456', 10),
      name: '陈女士',
      email: 'chen@example.com',
      role: 'parent',
      phone: '13800000004',
      gender: 'female'
    });
    console.log('✓ 创建家长账号：parent_wang / 123456, parent_chen / 123456');

    // 创建学生
    const student1 = await User.create({
      username: 'student_xiaoming',
      password: await bcrypt.hash('123456', 10),
      name: '小明',
      email: 'xiaoming@example.com',
      role: 'student',
      gender: 'male',
      birthDate: new Date('2012-05-15')
    });

    const studentDoc1 = await Student.create({
      user: student1._id,
      age: 13,
      grade: '初一',
      school: 'XX 县第一中学',
      address: 'XX 省 XX 县 XX 村',
      learningNeeds: '数学、英语',
      psychologicalStatus: 'good'
    });

    await Parent.findByIdAndUpdate(parent1._id, {
      children: [studentDoc1._id],
      relationship: 'father'
    });
    console.log('✓ 创建学生账号：student_xiaoming / 123456');

    const student2 = await User.create({
      username: 'student_xiaohong',
      password: await bcrypt.hash('123456', 10),
      name: '小红',
      email: 'xiaohong@example.com',
      role: 'student',
      gender: 'female',
      birthDate: new Date('2011-08-20')
    });

    const studentDoc2 = await Student.create({
      user: student2._id,
      age: 14,
      grade: '初二',
      school: 'XX 县第二中学',
      address: 'XX 省 XX 县 XX 镇',
      learningNeeds: '英语、物理',
      psychologicalStatus: 'fair'
    });

    await Parent.findByIdAndUpdate(parent2._id, {
      children: [studentDoc2._id],
      relationship: 'mother'
    });
    console.log('✓ 创建学生账号：student_xiaohong / 123456');

    // 创建学习资源
    await LearningResource.insertMany([
      {
        title: '初中数学知识点总结',
        description: '涵盖初一至初三所有数学知识点',
        type: 'document',
        url: 'https://example.com/math-summary.pdf',
        uploader: teacher1._id,
        category: '知识点总结',
        subject: '数学',
        grade: '初中'
      },
      {
        title: '英语语法入门视频',
        description: '适合初学者的英语语法讲解',
        type: 'video',
        url: 'https://example.com/english-grammar.mp4',
        uploader: teacher2._id,
        category: '视频教程',
        subject: '英语',
        grade: '初中'
      },
      {
        title: '几何题解题技巧',
        description: '常见几何题型的解题思路',
        type: 'document',
        url: 'https://example.com/geometry-tips.pdf',
        uploader: teacher1._id,
        category: '解题技巧',
        subject: '数学',
        grade: '初一'
      }
    ]);
    console.log('✓ 创建 3 条学习资源');

    // 创建心理评估
    await PsychologicalAssessment.create({
      student: studentDoc1._id,
      assessor: teacher1._id,
      assessmentDate: new Date('2026-03-15'),
      score: 88,
      comments: '学生性格开朗，学习态度积极，与同学关系融洽',
      recommendations: ['继续保持积极心态', '可以适当增加课外活动'],
      status: 'completed'
    });

    await PsychologicalAssessment.create({
      student: studentDoc2._id,
      assessor: teacher1._id,
      assessmentDate: new Date('2026-03-20'),
      score: 72,
      comments: '学生较为内向，学习压力较大，需要关注',
      recommendations: ['建议定期心理辅导', '与家长沟通减轻压力', '鼓励参加集体活动'],
      status: 'completed'
    });
    console.log('✓ 创建 2 条心理评估记录');

    // 创建 AI 匹配
    await AIMatch.insertMany([
      {
        student: studentDoc1._id,
        teacher: teacher1._id,
        matchScore: 92,
        matchReason: '学生需要数学辅导，教师专长为数学教学',
        matchFactors: { subject: true, grade: true, learningStyle: false, availability: true }
      },
      {
        student: studentDoc1._id,
        teacher: teacher2._id,
        matchScore: 85,
        matchReason: '学生需要英语辅导，教师专长为英语教学',
        matchFactors: { subject: true, grade: true, learningStyle: false, availability: false }
      },
      {
        student: studentDoc2._id,
        teacher: teacher2._id,
        matchScore: 90,
        matchReason: '学生需要英语辅导，教师专长为英语教学',
        matchFactors: { subject: true, grade: true, learningStyle: true, availability: true }
      }
    ]);
    console.log('✓ 创建 3 条 AI 匹配记录');

    console.log('\n========================================');
    console.log('✓ 种子数据创建完成！');
    console.log('========================================');
    console.log('\n测试账号汇总:');
    console.log('管理员：admin / 123456');
    console.log('教师：teacher_zhang / 123456, teacher_li / 123456');
    console.log('家长：parent_wang / 123456, parent_chen / 123456');
    console.log('学生：student_xiaoming / 123456, student_xiaohong / 123456');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ 种子数据创建失败:', error);
    process.exit(1);
  }
};

seedData();

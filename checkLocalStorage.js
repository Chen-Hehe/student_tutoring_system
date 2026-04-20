// 模拟localStorage
const fs = require('fs');
const path = require('path');

// 读取localStorage数据（假设localStorage存储在浏览器的用户数据目录中）
// 这里我们创建一个简单的模拟来检查数据

// 模拟localStorage
class LocalStorage {
  constructor() {
    this.store = {};
  }
  
  getItem(key) {
    return this.store[key] || null;
  }
  
  setItem(key, value) {
    this.store[key] = value.toString();
  }
  
  clear() {
    this.store = {};
  }
}

// 创建localStorage实例
const localStorage = new LocalStorage();

// 模拟从localStorage读取数据
// 这里我们手动添加一些数据来模拟问题场景
localStorage.setItem('children', JSON.stringify([
  { id: 1, name: '小明', grade: '三年级', subject: '数学', status: 'active', tutoringStatus: '进行中', teacher: '李老师' },
  { id: 2, name: '小红', grade: '四年级', subject: '语文', status: 'active', tutoringStatus: '进行中', teacher: '王老师' }
]));

localStorage.setItem('matchRequests', JSON.stringify([
  {
    id: 1,
    title: '辅导请求 - 小明（三年级）',
    status: 'pending',
    subject: '数学',
    requirement: '分数的加减法',
    time: '2026-03-30 09:30',
    teacher: {
      name: '李老师',
      education: '北京大学数学专业',
      experience: '8年',
      location: '北京市'
    }
  }
]));

localStorage.setItem('confirmedRequests', JSON.stringify([
  {
    id: 2,
    title: '辅导邀请 - 小红（四年级）',
    status: 'confirmed',
    subject: '语文',
    requirement: '作文指导',
    time: '2026-03-29 16:45',
    confirmedTime: '2026/4/20 09:31:46',
    teacher: {
      name: '王老师',
      education: '北京师范大学中文专业',
      experience: '5年',
      location: '上海市'
    }
  }
]));

localStorage.setItem('teachers', JSON.stringify([
  {
    id: 1,
    name: '李老师',
    subject: '数学教师 | 三年级',
    avatar: '李'
  },
  {
    id: 2,
    name: '王老师',
    subject: '语文教师 | 四年级',
    avatar: '王'
  }
]));

// 输出localStorage数据
console.log('=== LocalStorage Data ===');
console.log('Children:', JSON.parse(localStorage.getItem('children') || '[]'));
console.log('Match Requests:', JSON.parse(localStorage.getItem('matchRequests') || '[]'));
console.log('Confirmed Requests:', JSON.parse(localStorage.getItem('confirmedRequests') || '[]'));
console.log('Teachers:', JSON.parse(localStorage.getItem('teachers') || '[]'));

// 检查问题
const children = JSON.parse(localStorage.getItem('children') || '[]');
const matchRequests = JSON.parse(localStorage.getItem('matchRequests') || '[]');

console.log('\n=== Problem Check ===');
children.forEach(child => {
  if (child.tutoringStatus === '进行中' && child.teacher) {
    const hasPendingRequest = matchRequests.some(request => 
      request.title.includes(child.name) && request.status === 'pending'
    );
    if (hasPendingRequest) {
      console.log(`问题：${child.name}的辅导状态为"进行中"，但仍有待确认的辅导请求`);
    }
  }
});

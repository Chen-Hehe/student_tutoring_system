// 重置localStorage数据，确保数据一致性
const fs = require('fs');
const path = require('path');

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

// 重置数据
localStorage.clear();

// 设置初始数据
localStorage.setItem('children', JSON.stringify([
  { id: 1, name: '小明', grade: '三年级', subject: '数学', status: 'active', tutoringStatus: '未进行', teacher: null },
  { id: 2, name: '小红', grade: '四年级', subject: '语文', status: 'active', tutoringStatus: '未进行', teacher: null }
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
  },
  {
    id: 2,
    title: '辅导邀请 - 小红（四年级）',
    status: 'pending',
    subject: '语文',
    requirement: '作文指导',
    time: '2026-03-29 16:45',
    teacher: {
      name: '王老师',
      education: '北京师范大学中文专业',
      experience: '5年',
      location: '上海市'
    }
  }
]));

localStorage.setItem('confirmedRequests', JSON.stringify([]));

localStorage.setItem('teachers', JSON.stringify([]));

// 输出重置后的数据
console.log('=== Reset LocalStorage Data ===');
console.log('Children:', JSON.parse(localStorage.getItem('children') || '[]'));
console.log('Match Requests:', JSON.parse(localStorage.getItem('matchRequests') || '[]'));
console.log('Confirmed Requests:', JSON.parse(localStorage.getItem('confirmedRequests') || '[]'));
console.log('Teachers:', JSON.parse(localStorage.getItem('teachers') || '[]'));

console.log('\n=== Reset Complete ===');
console.log('LocalStorage has been reset to initial state.');

import { useState, useEffect } from 'react'
import { Card, Button } from 'antd'
const MatchConfirmation = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentRequest, setCurrentRequest] = useState(null)
  
  // 从localStorage获取匹配请求， 如果没有则使用默认数据
  const [matchRequests, setMatchRequests] = useState(() => {
    try {
      const storedRequests = localStorage.getItem('matchRequests')
      if (storedRequests) {
        const parsedRequests = JSON.parse(storedRequests)
        if (Array.isArray(parsedRequests)) {
          return parsedRequests
        }
      }
    } catch (error) {
      console.error('读取localStorage失败:', error)
    }
    // 默认数据
    const defaultRequests = [
      {
        id: 3,
        title: '辅导请求 - 小明（三年级）',
        status: 'pending',
        subject: '英语',
        requirement: '单词记忆和基础语法',
        time: '2026-04-01 10:00',
        teacher: {
          name: '刘老师',
          education: '北京大学英语专业',
          experience: '7年',
          location: '北京市'
        }
      },
      {
        id: 4,
        title: '辅导邀请 - 小红（四年级）',
        status: 'pending',
        subject: '数学',
        requirement: '乘法口诀和应用题',
        time: '2026-04-02 14:30',
        teacher: {
          name: '李老师',
          education: '复旦大学数学专业',
          experience: '4年',
          location: '上海市'
        }
      }
    ]
    // 保存默认数据到localStorage
    try {
      localStorage.setItem('matchRequests', JSON.stringify(defaultRequests))
    } catch (error) {
      console.error('保存localStorage失败:', error)
    }
    return defaultRequests
  })
  
  // 从localStorage获取已确认请求
  const [confirmedRequests, setConfirmedRequests] = useState(() => {
    try {
      const storedConfirmedRequests = localStorage.getItem('confirmedRequests')
      if (storedConfirmedRequests) {
        const parsedRequests = JSON.parse(storedConfirmedRequests)
        if (Array.isArray(parsedRequests)) {
          return parsedRequests
        }
      }
    } catch (error) {
      console.error('读取localStorage失败:', error)
    }
    return []
  })
  
  // 组件挂载时初始化数据，确保添加两个已确认的辅导请求和待确认的辅导请求
  useEffect(() => {
    try {
      // 初始化孩子列表
      let children = []
      const storedChildren = localStorage.getItem('children')
      if (storedChildren) {
        children = JSON.parse(storedChildren)
      }
      if (!Array.isArray(children) || children.length === 0) {
        children = [
          { id: 1, name: '小明', grade: '三年级', subject: '数学', status: 'active', tutoringStatus: '进行中', teacher: '陈老师' },
          { id: 2, name: '小红', grade: '四年级', subject: '语文', status: 'active', tutoringStatus: '进行中', teacher: '张老师' }
        ]
        localStorage.setItem('children', JSON.stringify(children))
      }
      
      // 初始化待确认的辅导请求
      let matchRequests = []
      const storedRequests = localStorage.getItem('matchRequests')
      if (storedRequests) {
        matchRequests = JSON.parse(storedRequests)
      }
      if (!Array.isArray(matchRequests) || matchRequests.length === 0) {
        matchRequests = [
          {
            id: 3,
            title: '辅导邀请 - 小明（三年级）',
            status: 'pending',
            subject: '数学',
            requirement: '小数的加减法',
            time: '2026-04-01 10:00',
            teacher: {
              name: '王老师',
              education: '复旦大学数学专业',
              experience: '5年',
              location: '上海市'
            }
          },
          {
            id: 4,
            title: '辅导请求 - 小红（四年级）',
            status: 'pending',
            subject: '语文',
            requirement: '阅读理解',
            time: '2026-04-02 14:30',
            teacher: {
              name: '刘老师',
              education: '北京师范大学中文专业',
              experience: '6年',
              location: '北京市'
            }
          }
        ]
        localStorage.setItem('matchRequests', JSON.stringify(matchRequests))
      }
      
      // 初始化已确认的辅导请求
      let confirmedRequests = []
      const storedConfirmedRequests = localStorage.getItem('confirmedRequests')
      if (storedConfirmedRequests) {
        confirmedRequests = JSON.parse(storedConfirmedRequests)
      }
      if (!Array.isArray(confirmedRequests) || confirmedRequests.length === 0) {
        confirmedRequests = [
          {
            id: 1,
            title: '辅导请求 - 小明（三年级）',
            status: 'confirmed',
            subject: '数学',
            requirement: '分数的加减法',
            time: '2026-03-30 09:30',
            confirmedTime: '2026-04-20 10:00:00',
            teacher: {
              name: '陈老师',
              education: '清华大学数学专业',
              experience: '6年',
              location: '北京市'
            }
          },
          {
            id: 2,
            title: '辅导邀请 - 小红（四年级）',
            status: 'confirmed',
            subject: '语文',
            requirement: '作文指导',
            time: '2026-03-29 16:45',
            confirmedTime: '2026-04-20 10:30:00',
            teacher: {
              name: '张老师',
              education: '北京师范大学中文专业',
              experience: '5年',
              location: '上海市'
            }
          }
        ]
        localStorage.setItem('confirmedRequests', JSON.stringify(confirmedRequests))
      }
      
      // 初始化老师列表
      let teachers = []
      const storedTeachers = localStorage.getItem('teachers')
      if (storedTeachers) {
        teachers = JSON.parse(storedTeachers)
      }
      if (!Array.isArray(teachers) || teachers.length === 0) {
        teachers = [
          {
            id: 1,
            name: '陈老师',
            subject: '数学教师 | 三年级',
            avatar: '陈'
          },
          {
            id: 2,
            name: '张老师',
            subject: '语文教师 | 四年级',
            avatar: '张'
          }
        ]
        localStorage.setItem('teachers', JSON.stringify(teachers))
      }
      
      // 更新状态
      setMatchRequests(matchRequests)
      setConfirmedRequests(confirmedRequests)
    } catch (error) {
      console.error('初始化LocalStorage失败:', error)
    }
  }, [])
  
  const handleApprove = (request) => {
    if (window.confirm('确定要同意这个辅导请求吗？')) {
      // 从待确认列表中移除该请求
      const updatedPendingRequests = matchRequests.filter(req => req.id !== request.id)
      setMatchRequests(updatedPendingRequests)
      
      // 保存更新后的待确认列表到localStorage
      try {
        localStorage.setItem('matchRequests', JSON.stringify(updatedPendingRequests))
      } catch (error) {
        console.error('保存localStorage失败:', error)
      }
      
      // 将该请求添加到已确认列表
      const confirmedRequest = {
        ...request,
        status: 'confirmed',
        confirmedTime: new Date().toLocaleString('zh-CN')
      }
      const updatedConfirmedRequests = [...confirmedRequests, confirmedRequest]
      setConfirmedRequests(updatedConfirmedRequests)
      
      // 保存更新后的已确认列表到localStorage
      try {
        localStorage.setItem('confirmedRequests', JSON.stringify(updatedConfirmedRequests))
      } catch (error) {
        console.error('保存localStorage失败:', error)
      }
      
      // 更新孩子管理页面的辅导状态和辅导老师
      // 使用localStorage存储状态，以便在不同页面之间共享
      const childName = request.title.split(' - ')[1].split('（')[0]
      
      // 从localStorage获取当前孩子列表
      let children = []
      try {
        const storedChildren = localStorage.getItem('children')
        if (storedChildren) {
          children = JSON.parse(storedChildren)
        }
      } catch (error) {
        console.error('读取localStorage失败:', error)
      }
      
      // 如果localStorage中没有孩子列表，使用默认数据
      if (!Array.isArray(children) || children.length === 0) {
        children = [
          { id: 1, name: '小明', grade: '三年级', subject: '数学', status: 'active', tutoringStatus: '未进行', teacher: null },
          { id: 2, name: '小红', grade: '四年级', subject: '语文', status: 'active', tutoringStatus: '未进行', teacher: null }
        ]
      }
      
      // 更新对应孩子的辅导状态和辅导老师
      const updatedChildren = children.map(child => 
        child.name === childName ? { ...child, tutoringStatus: '进行中', teacher: request.teacher.name } : child
      )
      
      // 保存更新后的孩子列表到localStorage
      try {
        localStorage.setItem('children', JSON.stringify(updatedChildren))
      } catch (error) {
        console.error('保存localStorage失败:', error)
      }
      
      // 更新教师沟通页面的老师列表
      let teachers = []
      try {
        const storedTeachers = localStorage.getItem('teachers')
        if (storedTeachers) {
          teachers = JSON.parse(storedTeachers)
        }
      } catch (error) {
        console.error('读取localStorage失败:', error)
      }
      
      if (!Array.isArray(teachers) || teachers.length === 0) {
        teachers = [
          {
            id: 1,
            name: '李老师',
            subject: '数学教师 | 三年级',
            avatar: '李'
          },
          {
            id: 2,
            name: '张老师',
            subject: '语文教师 | 四年级',
            avatar: '张'
          }
        ]
      }
      
      // 检查是否已经存在该老师
      const teacherExists = teachers.some(teacher => teacher.name === request.teacher.name)
      if (!teacherExists) {
        const newTeacher = {
          id: teachers.length + 1,
          name: request.teacher.name,
          subject: `${request.subject}教师 | ${request.title.split('（')[1].split('）')[0]}`,
          avatar: request.teacher.name.charAt(0)
        }
        teachers.push(newTeacher)
        try {
          localStorage.setItem('teachers', JSON.stringify(teachers))
        } catch (error) {
          console.error('保存localStorage失败:', error)
        }
      }
      
      alert('已同意辅导请求，辅导状态已更新')
    }
  }
  
  const handleReject = (request) => {
    if (window.confirm('确定要拒绝这个辅导请求吗？')) {
      // 从待确认列表中移除该请求
      const updatedPendingRequests = matchRequests.filter(req => req.id !== request.id)
      setMatchRequests(updatedPendingRequests)
      
      // 保存更新后的待确认列表到localStorage
      try {
        localStorage.setItem('matchRequests', JSON.stringify(updatedPendingRequests))
      } catch (error) {
        console.error('保存localStorage失败:', error)
      }
      
      alert('已拒绝辅导请求')
    }
  }
  
  const handleCancel = (request) => {
    if (window.confirm('确定要撤销这个已确认的辅导请求吗？')) {
      // 从已确认列表中移除该请求
      const updatedConfirmedRequests = confirmedRequests.filter(req => req.id !== request.id)
      setConfirmedRequests(updatedConfirmedRequests)
      
      // 保存更新后的已确认列表到localStorage
      try {
        localStorage.setItem('confirmedRequests', JSON.stringify(updatedConfirmedRequests))
      } catch (error) {
        console.error('保存localStorage失败:', error)
      }
      
      // 将该请求重新添加到待确认列表
      const pendingRequest = {
        ...request,
        status: 'pending'
      }
      delete pendingRequest.confirmedTime
      const updatedPendingRequests = [...matchRequests, pendingRequest]
      setMatchRequests(updatedPendingRequests)
      
      // 保存更新后的待确认列表到localStorage
      try {
        localStorage.setItem('matchRequests', JSON.stringify(updatedPendingRequests))
      } catch (error) {
        console.error('保存localStorage失败:', error)
      }
      
      // 更新孩子管理页面的辅导状态和辅导老师
      const childName = request.title.split(' - ')[1].split('（')[0]
      
      // 从localStorage获取当前孩子列表
      let children = []
      try {
        const storedChildren = localStorage.getItem('children')
        if (storedChildren) {
          children = JSON.parse(storedChildren)
        }
      } catch (error) {
        console.error('读取localStorage失败:', error)
      }
      
      if (!Array.isArray(children) || children.length === 0) {
        children = [
          { id: 1, name: '小明', grade: '三年级', subject: '数学', status: 'active', tutoringStatus: '未进行', teacher: null },
          { id: 2, name: '小红', grade: '四年级', subject: '语文', status: 'active', tutoringStatus: '未进行', teacher: null }
        ]
      }
      
      // 更新对应孩子的辅导状态和辅导老师
      const updatedChildren = children.map(child => 
        child.name === childName ? { ...child, tutoringStatus: '未进行', teacher: null } : child
      )
      
      // 保存更新后的孩子列表到localStorage
      try {
        localStorage.setItem('children', JSON.stringify(updatedChildren))
      } catch (error) {
        console.error('保存localStorage失败:', error)
      }
      
      // 从教师沟通页面的老师列表中移除该老师
      let teachers = []
      try {
        const storedTeachers = localStorage.getItem('teachers')
        if (storedTeachers) {
          teachers = JSON.parse(storedTeachers)
        }
      } catch (error) {
        console.error('读取localStorage失败:', error)
      }
      
      if (Array.isArray(teachers)) {
        const updatedTeachers = teachers.filter(teacher => teacher.name !== request.teacher.name)
        try {
          localStorage.setItem('teachers', JSON.stringify(updatedTeachers))
        } catch (error) {
          console.error('保存localStorage失败:', error)
        }
      }
      
      alert('已撤销辅导请求，辅导状态已更新')
    }
  }
  
  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 匹配确认标题栏 */}
      <div style={{
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>匹配确认</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>欢迎，王家长</span>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#FF9800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>王</div>
        </div>
      </div>

      {/* 匹配请求列表 */}
      <Card 
        style={{ 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderRadius: 10,
          padding: 25,
          backgroundColor: '#fff'
        }}
      >
        {matchRequests.map(request => (
          <div 
            key={request.id}
            style={{ 
              padding: 20, 
              borderBottom: '1px solid #e0e0e0',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{request.title}</div>
              <span style={{
                padding: '5px 10px',
                borderRadius: 15,
                fontSize: '0.8em',
                fontWeight: 'bold',
                backgroundColor: '#fff3cd',
                color: '#856404'
              }}>待家长确认</span>
            </div>
            <div style={{ marginBottom: 15 }}>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>📝 辅导科目：{request.subject}</p>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>🎯 学习需求：{request.requirement}</p>
              <p style={{ fontSize: '0.9em' }}>⏰ {request.title.includes('请求') ? '申请' : '邀请'}时间：{request.time}</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 15 }}>
              <h4 style={{ marginBottom: 10, color: '#FF9800' }}>教师信息</h4>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>👩‍🏫 姓名：{request.teacher.name}</p>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>🎓 教育背景：{request.teacher.education}</p>
              <p style={{ marginBottom: 5, fontSize: '0.9em' }}>📚 教学经验：{request.teacher.experience}</p>
              <p style={{ fontSize: '0.9em' }}>📍 所在地：{request.teacher.location}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button 
                style={{ 
                  backgroundColor: '#FF9800', 
                  color: 'white', 
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  borderRadius: 5,
                  fontSize: '0.9em',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleApprove(request)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F57C00'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF9800'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                同意
              </Button>
              <Button 
                style={{ 
                  backgroundColor: '#e0e0e0', 
                  color: '#333', 
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  borderRadius: 5,
                  fontSize: '0.9em',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleReject(request)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#bdbdbd'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e0e0e0'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                拒绝
              </Button>
            </div>
          </div>
        ))}
      </Card>
      
      {/* 已确认的辅导请求 */}
      {confirmedRequests.length > 0 && (
        <Card 
          style={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            borderRadius: 10,
            padding: 25,
            marginTop: 30,
            backgroundColor: '#fff'
          }}
        >
          <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>已确认的辅导请求</h2>
          {confirmedRequests.map(request => (
            <div 
              key={request.id}
              style={{ 
                padding: 20, 
                borderBottom: '1px solid #e0e0e0',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{request.title}</div>
                <span style={{
                  padding: '5px 10px',
                  borderRadius: 15,
                  fontSize: '0.8em',
                  fontWeight: 'bold',
                  backgroundColor: '#d4edda',
                  color: '#155724'
                }}>已确认</span>
              </div>
              <div style={{ marginBottom: 15 }}>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>📝 辅导科目：{request.subject}</p>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>🎯 学习需求：{request.requirement}</p>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>⏰ {request.title.includes('请求') ? '申请' : '邀请'}时间：{request.time}</p>
                <p style={{ fontSize: '0.9em' }}>✅ 确认时间：{request.confirmedTime}</p>
              </div>
              <div style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 15 }}>
                <h4 style={{ marginBottom: 10, color: '#FF9800' }}>教师信息</h4>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>👩‍🏫 姓名：{request.teacher.name}</p>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>🎓 教育背景：{request.teacher.education}</p>
                <p style={{ marginBottom: 5, fontSize: '0.9em' }}>📚 教学经验：{request.teacher.experience}</p>
                <p style={{ fontSize: '0.9em' }}>📍 所在地：{request.teacher.location}</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button 
                  style={{ 
                    backgroundColor: '#FF9800', 
                    color: 'white', 
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: 5,
                    fontSize: '0.9em',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F57C00'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF9800'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  与老师沟通
                </Button>
                <Button 
                  style={{ 
                    backgroundColor: '#e0e0e0', 
                    color: '#333', 
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: 5,
                    fontSize: '0.9em',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleCancel(request)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#bdbdbd'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0e0e0'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  撤销
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
export default MatchConfirmation

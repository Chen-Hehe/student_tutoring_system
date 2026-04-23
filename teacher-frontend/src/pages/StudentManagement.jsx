import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Card, Button, Tag, Input, Space, Modal, message, Drawer, Descriptions } from 'antd'
import { SearchOutlined, EyeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import { matchAPI } from '../services/matchApi'

const { Search } = Input

const StudentManagement = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  useEffect(() => {
    if (currentUser?.id) {
      loadStudents()
    }
  }, [currentUser?.id])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const result = await matchAPI.getTeacherMatches(currentUser.id)
      const matches = result.data || []
      
      // 过滤已匹配的学生并去重
      const studentMap = new Map()
      matches
        .filter(m => m.status === 2) // 已匹配状态
        .forEach(m => {
          // 如果学生 ID 不存在于 map 中，添加它
          if (!studentMap.has(m.studentId)) {
            studentMap.set(m.studentId, {
              key: m.studentId,
              id: m.studentId,
              name: m.studentName,
              grade: m.studentGrade,
              school: m.studentSchool,
              subject: m.subject,
              learningNeeds: m.studentLearningNeeds,
              matchTime: m.createdAt,
              status: 'active'
            })
          }
        })
      
      // 将 map 转换为数组
      const matchedStudents = Array.from(studentMap.values())
      
      setStudents(matchedStudents)
    } catch (error) {
      console.error('加载学生列表失败:', error)
      message.error('加载学生列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (student) => {
    setSelectedStudent(student)
    setDrawerVisible(true)
  }

  const handleSendMessage = (student) => {
    // TODO: 跳转到聊天页面并选中该学生
    message.info('即将跳转到聊天页面')
  }

  // 过滤学生列表
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchText.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchText.toLowerCase()) ||
    student.school.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => <Tag color="blue">{grade}</Tag>
    },
    {
      title: '学校',
      dataIndex: 'school',
      key: 'school',
      ellipsis: true
    },
    {
      title: '辅导科目',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => <Tag color="green">{subject}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<MessageOutlined />}
            onClick={() => handleSendMessage(record)}
          >
            发消息
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>👨‍🎓 学生管理</h2>
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索学生姓名、年级、学校"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredStudents}
          loading={loading}
          rowSelection={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 名学生`
          }}
        />
      </Card>

      {/* 学生详情抽屉 */}
      <Drawer
        title="学生详情"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedStudent && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="姓名">{selectedStudent.name}</Descriptions.Item>
            <Descriptions.Item label="年级">{selectedStudent.grade}</Descriptions.Item>
            <Descriptions.Item label="学校">{selectedStudent.school}</Descriptions.Item>
            <Descriptions.Item label="辅导科目">{selectedStudent.subject}</Descriptions.Item>
            <Descriptions.Item label="学习需求" span={2}>
              {selectedStudent.learningNeeds || '暂无'}
            </Descriptions.Item>
            <Descriptions.Item label="匹配时间">
              {new Date(selectedStudent.matchTime).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}

export default StudentManagement

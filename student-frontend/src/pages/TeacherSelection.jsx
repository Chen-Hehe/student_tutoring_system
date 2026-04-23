import { useState } from 'react'
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, message, Avatar } from 'antd'
import { useSelector } from 'react-redux'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'

const { TextArea } = Input

const TeacherSelection = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [searchText, setSearchText] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [form] = Form.useForm()

  // 模拟教师数据
  const teachers = [
    {
      key: '1',
      id: 1,
      name: '李老师',
      subject: '数学',
      grade: '小学',
      experience: 10,
      rating: 4.8,
      students: 50,
      description: '擅长分数运算和几何基础，教学经验丰富',
    },
    {
      key: '2',
      id: 2,
      name: '王老师',
      subject: '语文',
      grade: '初中',
      experience: 8,
      rating: 4.9,
      students: 45,
      description: '专注作文教学和阅读理解，方法独特',
    },
    {
      key: '3',
      id: 3,
      name: '张老师',
      subject: '英语',
      grade: '小学',
      experience: 12,
      rating: 4.7,
      students: 60,
      description: '善于激发学生学习兴趣，口语教学出色',
    },
  ]

  const columns = [
    {
      title: '教师',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#4CAF50' }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.subject} · {record.grade}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '教龄',
      dataIndex: 'experience',
      key: 'experience',
      render: (exp) => `${exp}年`,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Tag style={{ backgroundColor: '#4CAF50', border: 'none', color: '#fff' }}>⭐ {rating}</Tag>
      ),
    },
    {
      title: '学生数',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: '简介',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => handleSelectTeacher(record)}
            style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
          >
            选择此老师
          </Button>
        </Space>
      ),
    },
  ]

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher)
    setIsModalOpen(true)
  }

  const handleRequestSubmit = async () => {
    try {
      const values = await form.validateFields()
      // TODO: 调用 API 发送辅导请求
      console.log('发送请求:', { teacherId: selectedTeacher.id, ...values })
      message.success('辅导请求已发送，等待老师确认！')
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  // 过滤教师列表
  const filteredTeachers = teachers.filter(teacher => {
    // 搜索文本过滤
    const matchesSearch = searchText === '' || 
      teacher.name.toLowerCase().includes(searchText.toLowerCase())
    
    // 科目过滤
    const matchesSubject = selectedSubject === '' || 
      teacher.subject === selectedSubject
    
    // 教龄过滤
    const matchesExperience = selectedExperience === '' || {
      '0-5': teacher.experience >= 0 && teacher.experience <= 5,
      '5-10': teacher.experience > 5 && teacher.experience <= 10,
      '10+': teacher.experience > 10
    }[selectedExperience]
    
    // 年级过滤
    const matchesGrade = selectedGrade === '' || 
      teacher.grade === selectedGrade
    
    return matchesSearch && matchesSubject && matchesExperience && matchesGrade
  })

  // 处理搜索
  const handleSearch = () => {
    console.log('搜索条件:', {
      searchText,
      selectedSubject,
      selectedExperience,
      selectedGrade
    })
  }

  // 处理重置
  const handleReset = () => {
    setSearchText('')
    setSelectedSubject('')
    setSelectedExperience('')
    setSelectedGrade('')
    console.log('重置搜索条件')
  }

  return (
    <div style={{ background: '#f0f8f0', padding: 0 }}>
      {/* 学生端标题栏 */}
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
        <h1 style={{ color: '#4CAF50', margin: 0, fontSize: '1.8em' }}>👩‍🏫 教师选择</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>欢迎，{currentUser?.name || '学生'}</span>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>{currentUser?.name?.charAt(0) || '学'}</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* 搜索筛选 */}
        <Card 
          style={{ 
            marginBottom: 16,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'end' }}>
            <Input
              placeholder="搜索教师姓名"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 16, alignItems: 'end' }}>
              <div>
                <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>科目</div>
                <Select
                  placeholder="全部科目"
                  style={{ width: 120 }}
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  allowClear
                >
                  <Select.Option value="数学">数学</Select.Option>
                  <Select.Option value="语文">语文</Select.Option>
                  <Select.Option value="英语">英语</Select.Option>
                  <Select.Option value="物理">物理</Select.Option>
                  <Select.Option value="化学">化学</Select.Option>
                </Select>
              </div>
              <div>
                <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>教龄</div>
                <Select
                  placeholder="全部教龄"
                  style={{ width: 120 }}
                  value={selectedExperience}
                  onChange={setSelectedExperience}
                  allowClear
                >
                  <Select.Option value="0-5">0-5年</Select.Option>
                  <Select.Option value="5-10">5-10年</Select.Option>
                  <Select.Option value="10+">10年以上</Select.Option>
                </Select>
              </div>
              <div>
                <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>年级</div>
                <Select
                  placeholder="全部年级"
                  style={{ width: 120 }}
                  value={selectedGrade}
                  onChange={setSelectedGrade}
                  allowClear
                >
                  <Select.Option value="小学">小学</Select.Option>
                  <Select.Option value="初中">初中</Select.Option>
                  <Select.Option value="高中">高中</Select.Option>
                </Select>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  onClick={handleSearch}
                  style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', height: 32 }}
                >
                  搜索
                </Button>
                <Button 
                  onClick={handleReset}
                  style={{ height: 32 }}
                >
                  重置
                </Button>
              </Space>
            </div>
          </div>
        </Card>

        {/* 教师列表 */}
        <Card 
          title={<span style={{ color: '#4CAF50', fontSize: '1.3em' }}>可选教师列表</span>}
          style={{ 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <Table 
            columns={columns} 
            dataSource={filteredTeachers}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>

      {/* 选择教师模态框 */}
      <Modal
        title={`选择 ${selectedTeacher?.name} 老师`}
        open={isModalOpen}
        onOk={handleRequestSubmit}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okText="发送请求"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <p><strong>科目：</strong>{selectedTeacher?.subject}</p>
          <p><strong>简介：</strong>{selectedTeacher?.description}</p>
        </div>
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="申请理由"
            rules={[{ required: true, message: '请输入申请理由' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请说明您希望在哪方面得到辅导..."
            />
          </Form.Item>
          <Form.Item
            name="schedule"
            label="期望辅导时间"
            rules={[{ required: true, message: '请输入期望时间' }]}
          >
            <Input placeholder="例如：每周六下午 2-4 点" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TeacherSelection

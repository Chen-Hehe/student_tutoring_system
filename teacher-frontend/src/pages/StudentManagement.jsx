import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Card, Button, Tag, Input, Space, Modal, message, Drawer, Descriptions, Progress, Form, InputNumber, DatePicker, Select, Dropdown, Menu } from 'antd'
import { SearchOutlined, EyeOutlined, MessageOutlined, StarOutlined, LineChartOutlined, FileTextOutlined, DownOutlined } from '@ant-design/icons'
import { matchAPI } from '../services/matchApi'
import api from '../services/api'
import dayjs from 'dayjs'

const { Search } = Input

const StudentManagement = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [progressDrawerVisible, setProgressDrawerVisible] = useState(false)
  const [reportDrawerVisible, setReportDrawerVisible] = useState(false)
  const [studentTasks, setStudentTasks] = useState([])
  const [studentProgress, setStudentProgress] = useState(0)
  const [tasksLoading, setTasksLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportForm] = Form.useForm()
  const [gradeRecords, setGradeRecords] = useState([
    { subject: '数学', grade: null },
    { subject: '语文', grade: null },
    { subject: '英语', grade: null }
  ])
  const [learningProgress, setLearningProgress] = useState([
    { subject: '数学', progress: null },
    { subject: '语文', progress: null },
    { subject: '英语', progress: null }
  ])

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

  // 计算学习进度
  const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === 'completed').length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  // 查看学生学习进度
  const handleViewProgress = async (student) => {
    setSelectedStudent(student)
    setTasksLoading(true)
    try {
      // 这里假设学生的id就是用户id，需要根据实际情况调整
      const response = await api.get(`/tasks/student/${student.id}`)
      const tasks = response.map(task => ({
        key: task.id,
        id: task.id,
        title: task.title,
        dueDate: new Date(task.dueDate).toLocaleString('zh-CN'),
        status: task.status
      }))
      setStudentTasks(tasks)
      const progress = calculateProgress(tasks)
      setStudentProgress(progress)
      setProgressDrawerVisible(true)
    } catch (error) {
      console.error('获取学生学习任务失败:', error)
      message.error('获取学生学习任务失败')
    } finally {
      setTasksLoading(false)
    }
  }

  // 获取学生的学习报告
  const getStudentReport = async (studentId) => {
    try {
      // 调用API获取学生的学习报告
      const response = await api.get(`/learning-reports/student/${studentId}`)
      return response
    } catch (error) {
      console.error('获取学生学习报告失败:', error)
      return null
    }
  }

  // 打开学习报告抽屉
  const handleOpenReportDrawer = async (student) => {
    setSelectedStudent(student)
    setReportLoading(true)
    try {
      // 获取学生的学习报告
      const report = await getStudentReport(student.id)
      if (report) {
        // 填充表单数据
        // 处理报告周期格式
        let reportPeriodValue = null
        if (report.reportPeriod) {
          // 检查报告周期格式是否为"2026年3月"这种格式
          const match = report.reportPeriod.match(/(\d+)年(\d+)月/)
          if (match) {
            const year = match[1]
            const month = match[2].padStart(2, '0')
            reportPeriodValue = dayjs(`${year}-${month}-01`)
          } else {
            reportPeriodValue = dayjs(report.reportPeriod)
          }
        }
        reportForm.setFieldsValue({
          reportPeriod: reportPeriodValue,
          overall: report.overall,
          classRank: report.classRank,
          comment: report.comment
        })
        
        // 获取成绩记录
        const gradeResponse = await api.get(`/grade-records/report/${report.id}`)
        const gradeMap = new Map()
        gradeResponse.forEach(item => {
          gradeMap.set(item.subject, item.grade)
        })
        setGradeRecords([
          { subject: '数学', grade: gradeMap.get('数学') || null },
          { subject: '语文', grade: gradeMap.get('语文') || null },
          { subject: '英语', grade: gradeMap.get('英语') || null }
        ])
        
        // 获取学习进度
        const progressResponse = await api.get(`/learning-progress/report/${report.id}`)
        const progressMap = new Map()
        progressResponse.forEach(item => {
          progressMap.set(item.subject, item.progress)
        })
        setLearningProgress([
          { subject: '数学', progress: progressMap.get('数学') || null },
          { subject: '语文', progress: progressMap.get('语文') || null },
          { subject: '英语', progress: progressMap.get('英语') || null }
        ])
      } else {
        // 重置表单
        reportForm.resetFields()
        setGradeRecords([
          { subject: '数学', grade: null },
          { subject: '语文', grade: null },
          { subject: '英语', grade: null }
        ])
        setLearningProgress([
          { subject: '数学', progress: null },
          { subject: '语文', progress: null },
          { subject: '英语', progress: null }
        ])
      }
      setReportDrawerVisible(true)
    } catch (error) {
      console.error('打开学习报告抽屉失败:', error)
      message.error('打开学习报告抽屉失败')
    } finally {
      setReportLoading(false)
    }
  }

  // 处理成绩变化
  const handleGradeChange = (index, value) => {
    const newGradeRecords = [...gradeRecords]
    newGradeRecords[index].grade = value
    setGradeRecords(newGradeRecords)
  }

  // 处理学习进度变化
  const handleProgressChange = (index, value) => {
    const newLearningProgress = [...learningProgress]
    newLearningProgress[index].progress = value
    setLearningProgress(newLearningProgress)
  }

  // 提交学习报告
  const handleSubmitReport = async (values) => {
    setReportLoading(true)
    try {
      // 获取学生的学习报告
      const existingReport = await getStudentReport(selectedStudent.id)
      
      // 计算平均成绩
      const validGrades = gradeRecords.filter(record => record.grade !== null).map(record => record.grade)
      const averageGrade = validGrades.length > 0 ? Math.round(validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length) : 0

      // 学习报告数据
      const reportData = {
        studentId: selectedStudent.id,
        reportPeriod: values.reportPeriod.format('YYYY年MM月'),
        overall: values.overall,
        classRank: values.classRank,
        comment: values.comment
      }

      let reportId
      if (existingReport) {
        // 更新现有的学习报告
        await api.put(`/learning-reports/${existingReport.id}`, reportData)
        reportId = existingReport.id
        
        // 更新成绩记录
        for (const record of gradeRecords) {
          if (record.grade !== null) {
            // 检查是否已有该科目的成绩记录
            const gradeResponse = await api.get(`/grade-records/report/${reportId}`)
            const existingGrade = gradeResponse.find(item => item.subject === record.subject)
            if (existingGrade) {
              // 更新现有的成绩记录
              await api.put(`/grade-records/${existingGrade.id}`, {
                reportId: reportId,
                subject: record.subject,
                grade: record.grade
              })
            } else {
              // 创建新的成绩记录
              await api.post('/grade-records', {
                reportId: reportId,
                subject: record.subject,
                grade: record.grade
              })
            }
          }
        }

        // 更新学习进度记录
        for (const progress of learningProgress) {
          if (progress.progress !== null) {
            // 检查是否已有该科目的学习进度记录
            const progressResponse = await api.get(`/learning-progress/report/${reportId}`)
            const existingProgress = progressResponse.find(item => item.subject === progress.subject)
            if (existingProgress) {
              // 更新现有的学习进度记录
              await api.put(`/learning-progress/${existingProgress.id}`, {
                reportId: reportId,
                subject: progress.subject,
                progress: progress.progress
              })
            } else {
              // 创建新的学习进度记录
              await api.post('/learning-progress', {
                reportId: reportId,
                subject: progress.subject,
                progress: progress.progress
              })
            }
          }
        }
      } else {
        // 创建新的学习报告
        const reportResponse = await api.post('/learning-reports', reportData)
        reportId = reportResponse.id

        // 创建成绩记录
        for (const record of gradeRecords) {
          if (record.grade !== null) {
            await api.post('/grade-records', {
              reportId: reportId,
              subject: record.subject,
              grade: record.grade
            })
          }
        }

        // 创建学习进度记录
        for (const progress of learningProgress) {
          if (progress.progress !== null) {
            await api.post('/learning-progress', {
              reportId: reportId,
              subject: progress.subject,
              progress: progress.progress
            })
          }
        }
      }

      setReportDrawerVisible(false)
      message.success(existingReport ? '学习报告已更新' : '学习报告已添加')
    } catch (error) {
      console.error('提交学习报告失败:', error)
      message.error('提交学习报告失败')
    } finally {
      setReportLoading(false)
    }
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
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="detail" onClick={() => handleViewDetail(record)}>
              <EyeOutlined /> 详情
            </Menu.Item>
            <Menu.Item key="progress" onClick={() => handleViewProgress(record)}>
              <LineChartOutlined /> 学习进度
            </Menu.Item>
            <Menu.Item key="report" onClick={() => handleOpenReportDrawer(record)}>
              <FileTextOutlined /> 学习报告
            </Menu.Item>
            <Menu.Item key="message" onClick={() => handleSendMessage(record)}>
              <MessageOutlined /> 发消息
            </Menu.Item>
          </Menu>
        )
        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="link" size="small" icon={<DownOutlined />}>
              操作
            </Button>
          </Dropdown>
        )
      }
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

      {/* 学生学习进度抽屉 */}
      <Drawer
        title={`${selectedStudent?.name || ''}的学习进度`}
        placement="right"
        width={800}
        open={progressDrawerVisible}
        onClose={() => setProgressDrawerVisible(false)}
      >
        {selectedStudent && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 8 }}>学习进度</h3>
                  <Progress percent={studentProgress} size="small" strokeColor="#4CAF50" />
                  <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                    已完成 {studentTasks.filter(task => task.status === 'completed').length} / {studentTasks.length} 个任务
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#f0f8f0', borderRadius: 8 }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#4CAF50' }}>{studentProgress}%</div>
                  <div style={{ fontSize: 14, color: '#666' }}>完成率</div>
                </div>
              </div>
            </Card>

            <Card title="学习任务">
              <Table
                columns={[
                  {
                    title: '任务名称',
                    dataIndex: 'title',
                    key: 'title'
                  },
                  {
                    title: '截止日期',
                    dataIndex: 'dueDate',
                    key: 'dueDate'
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status) => {
                      const color = status === 'completed' ? '#4CAF50' : '#8BC34A'
                      const text = status === 'completed' ? '已完成' : '待完成'
                      return <Tag style={{ backgroundColor: color, border: 'none', color: '#fff' }}>{text}</Tag>
                    }
                  }
                ]}
                dataSource={studentTasks}
                loading={tasksLoading}
                pagination={false}
                size="small"
                locale={{ emptyText: '暂无任务' }}
              />
            </Card>
          </div>
        )}
      </Drawer>

      {/* 学习报告抽屉 */}
      <Drawer
        title={`${selectedStudent?.name || ''}的学习报告`}
        placement="right"
        width={800}
        open={reportDrawerVisible}
        onClose={() => setReportDrawerVisible(false)}
      >
        {selectedStudent && (
          <Form
            form={reportForm}
            onFinish={handleSubmitReport}
            layout="vertical"
          >
            <Card style={{ marginBottom: 16 }}>
              <Form.Item
                name="reportPeriod"
                label="报告周期"
                rules={[{ required: true, message: '请选择报告周期' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  picker="month"
                  format="YYYY-MM"
                />
              </Form.Item>

              <Form.Item
                name="overall"
                label="总体评价"
                rules={[{ required: true, message: '请选择总体评价' }]}
              >
                <Select placeholder="请选择总体评价">
                  <Select.Option value="优秀">优秀</Select.Option>
                  <Select.Option value="良好">良好</Select.Option>
                  <Select.Option value="中等">中等</Select.Option>
                  <Select.Option value="待提高">待提高</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="classRank"
                label="班级排名"
                rules={[{ required: true, message: '请输入班级排名' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入班级排名" />
              </Form.Item>
            </Card>

            <Card title="成绩记录" style={{ marginBottom: 16 }}>
              {gradeRecords.map((record, index) => (
                <Form.Item key={record.subject} label={record.subject}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    placeholder={`请输入${record.subject}成绩`}
                    value={record.grade}
                    onChange={(value) => handleGradeChange(index, value)}
                  />
                </Form.Item>
              ))}
            </Card>

            <Card title="学习进度" style={{ marginBottom: 16 }}>
              {learningProgress.map((progress, index) => (
                <Form.Item key={progress.subject} label={progress.subject}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    placeholder={`请输入${progress.subject}学习进度`}
                    value={progress.progress}
                    onChange={(value) => handleProgressChange(index, value)}
                  />
                </Form.Item>
              ))}
            </Card>

            <Card title="教师评语">
              <Form.Item
                name="comment"
                label="评语"
                rules={[{ required: true, message: '请输入教师评语' }]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="请输入教师评语"
                />
              </Form.Item>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <Button onClick={() => setReportDrawerVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={reportLoading}>
                提交报告
              </Button>
            </div>
          </Form>
        )}
      </Drawer>
    </div>
  )
}

export default StudentManagement

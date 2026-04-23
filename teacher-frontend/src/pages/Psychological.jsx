import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Table, Button, Tag, Modal, Form, Input, Select, Rate, message, Drawer, Descriptions, Tabs } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import { psychologicalAPI } from '../services/psychologicalApi'
import { matchAPI } from '../services/matchApi'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

const Psychological = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentStatus, setStudentStatus] = useState(null)
  const [studentAssessments, setStudentAssessments] = useState([])
  const [teacherAssessments, setTeacherAssessments] = useState([])
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [assessmentDetails, setAssessmentDetails] = useState([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (currentUser?.id) {
      loadStudents()
    }
  }, [currentUser?.id])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const result = await matchAPI.getTeacherMatches()
      const matches = result.data || []
      
      // 过滤已匹配的学生并去重
      const studentMap = new Map()
      matches
        .filter(m => m.status === 2) // 已匹配状态
        .forEach(m => {
          // 如果学生 ID 不存在于 map 中，添加它
          if (!studentMap.has(m.studentId)) {
            studentMap.set(m.studentId, {
              id: m.studentId,
              name: m.studentName,
              grade: m.studentGrade
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

  const loadStudentPsychologicalData = async (studentId) => {
    setLoading(true)
    try {
      // 加载心理状态
      const statusResult = await psychologicalAPI.getStatus(studentId)
      if (statusResult.success && statusResult.data) {
        setStudentStatus(statusResult.data)
      }
      
      // 加载学生自评
      const studentAssessmentsResult = await psychologicalAPI.getAssessmentsByStudentIdAndType(studentId, 'student_self')
      if (studentAssessmentsResult.success && studentAssessmentsResult.data) {
        setStudentAssessments(studentAssessmentsResult.data)
      } else {
        setStudentAssessments([])
      }
      
      // 加载教师评估
      const teacherAssessmentsResult = await psychologicalAPI.getAssessmentsByStudentIdAndType(studentId, 'teacher_professional')
      if (teacherAssessmentsResult.success && teacherAssessmentsResult.data) {
        setTeacherAssessments(teacherAssessmentsResult.data)
      } else {
        setTeacherAssessments([])
      }
    } catch (error) {
      console.error('加载学生心理数据失败:', error)
      setStudentAssessments([])
      setTeacherAssessments([])
    } finally {
      setLoading(false)
    }
  }

  const loadAssessmentDetails = async (assessmentId) => {
    try {
      const result = await psychologicalAPI.getAssessmentDetails(assessmentId)
      if (result.success && result.data) {
        setAssessmentDetails(result.data)
      }
    } catch (error) {
      console.error('加载评估详情失败:', error)
    }
  }

  const handleAddAssessment = async (values) => {
    try {
      // 创建教师评估记录
      const assessmentData = {
        studentId: values.studentId,
        assessorId: currentUser.id,
        assessmentDate: new Date(),
        score: values.score * 10,
        comments: values.comments,
        recommendations: values.recommendations,
        assessType: 'teacher_professional'
      }
      
      const assessmentResult = await psychologicalAPI.createAssessment(assessmentData)
      if (assessmentResult.success && assessmentResult.data) {
        // 创建评估详情
        const assessmentId = assessmentResult.data.id
        const details = [
          { assessmentId, assessmentType: '情绪稳定性', percentage: values.emotionScore, level: getLevel(values.emotionScore) },
          { assessmentId, assessmentType: '学习压力', percentage: values.stressScore, level: getLevel(values.stressScore) },
          { assessmentId, assessmentType: '社交互动', percentage: values.socialScore, level: getLevel(values.socialScore) },
          { assessmentId, assessmentType: '自我认知', percentage: values.mentalScore, level: getLevel(values.mentalScore) }
        ]
        
        for (const detail of details) {
          await psychologicalAPI.createAssessmentDetail(detail)
        }
        
        // 更新心理状态
        const statusData = {
          studentId: values.studentId,
          emotionStatus: getStatusText(values.emotionScore),
          emotionLevel: getLevel(values.emotionScore),
          emotionPercentage: values.emotionScore,
          socialStatus: getStatusText(values.socialScore),
          socialLevel: getLevel(values.socialScore),
          socialPercentage: values.socialScore,
          stressStatus: getStatusText(values.stressScore),
          stressLevel: getLevel(values.stressScore),
          stressPercentage: values.stressScore,
          mentalStatus: getStatusText(values.mentalScore),
          mentalLevel: getLevel(values.mentalScore),
          mentalPercentage: values.mentalScore
        }
        await psychologicalAPI.createStatus(statusData)
        
        message.success('评估添加成功')
        setModalVisible(false)
        form.resetFields()
        // 重新加载数据
        if (selectedStudent) {
          loadStudentPsychologicalData(selectedStudent.id)
        }
      } else {
        message.error('添加失败：' + (assessmentResult.error || '未知错误'))
      }
    } catch (error) {
      console.error('添加评估失败:', error)
      message.error('添加失败：' + error.message)
    }
  }

  const handleViewDetail = (student) => {
    setSelectedStudent(student)
    loadStudentPsychologicalData(student.id)
    setDrawerVisible(true)
  }

  const handleViewAssessmentDetail = async (assessment) => {
    setSelectedAssessment(assessment)
    setDetailModalVisible(true)
    await loadAssessmentDetails(assessment.id)
  }

  const scoreColor = (score) => {
    if (score >= 80) return '#2196F3'
    if (score >= 60) return '#64B5F6'
    return '#FF5722'
  }

  const levelColor = (level) => {
    switch (level) {
      case 'good': return '#2196F3'
      case 'warning': return '#64B5F6'
      case 'danger': return '#FF5722'
      default: return '#2196F3'
    }
  }

  const levelText = (level) => {
    switch (level) {
      case 'good': return '良好'
      case 'warning': return '注意'
      case 'danger': return '需关注'
      default: return '良好'
    }
  }

  const getLevel = (score) => {
    if (score >= 80) return 'good'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const getStatusText = (score) => {
    if (score >= 80) return '优秀'
    if (score >= 60) return '良好'
    return '需关注'
  }

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      )
    }
  ]

  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 教师端标题栏 */}
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
        <h1 style={{ color: '#2196F3', margin: 0, fontSize: '1.8em' }}>💙 心理辅导</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>欢迎，{currentUser?.name || '教师'}</span>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#2196F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>{currentUser?.name?.charAt(0) || '教'}</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <Card 
          style={{ 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff'
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              style={{
                backgroundColor: '#2196F3',
                borderColor: '#2196F3',
                '&:hover': {
                  backgroundColor: '#1976D2',
                  borderColor: '#1976D2'
                }
              }}
            >
              添加心理评估
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={students}
            loading={loading}
            pagination={{
              pageSize: 6,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
          />
        </Card>

        <Modal
          title="添加心理评估"
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false)
            form.resetFields()
          }}
          onOk={() => form.submit()}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddAssessment}
          >
            <Form.Item
              name="studentId"
              label="选择学生"
              rules={[{ required: true, message: '请选择学生' }]}
            >
              <Select placeholder="请选择学生">
                {students.map(student => (
                  <Option key={student.id} value={student.id}>
                    {student.name} - {student.grade}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="score"
              label="心理状态评分"
              rules={[{ required: true, message: '请输入评分' }]}
            >
              <Rate count={10} style={{ fontSize: 24 }} />
            </Form.Item>

            <Form.Item
              name="emotionScore"
              label="情绪稳定性"
              rules={[{ required: true, message: '请输入评分' }]}
            >
              <Select placeholder="请选择">
                <Option value={90}>优秀</Option>
                <Option value={75}>良好</Option>
                <Option value={60}>一般</Option>
                <Option value={45}>需关注</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="socialScore"
              label="社交互动"
              rules={[{ required: true, message: '请输入评分' }]}
            >
              <Select placeholder="请选择">
                <Option value={90}>优秀</Option>
                <Option value={75}>良好</Option>
                <Option value={60}>一般</Option>
                <Option value={45}>需关注</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="stressScore"
              label="学习压力"
              rules={[{ required: true, message: '请输入评分' }]}
            >
              <Select placeholder="请选择">
                <Option value={90}>优秀</Option>
                <Option value={75}>良好</Option>
                <Option value={60}>一般</Option>
                <Option value={45}>需关注</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="mentalScore"
              label="自我认知"
              rules={[{ required: true, message: '请输入评分' }]}
            >
              <Select placeholder="请选择">
                <Option value={90}>优秀</Option>
                <Option value={75}>良好</Option>
                <Option value={60}>一般</Option>
                <Option value={45}>需关注</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="comments"
              label="评估意见"
              rules={[{ required: true, message: '请输入评估意见' }]}
            >
              <TextArea rows={4} placeholder="请输入详细的评估意见" />
            </Form.Item>

            <Form.Item
              name="recommendations"
              label="建议"
            >
              <TextArea rows={3} placeholder="请输入辅导建议（选填）" />
            </Form.Item>
          </Form>
        </Modal>

        <Drawer
          title={`${selectedStudent?.name} - 心理状态详情`}
          placement="right"
          width={800}
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
          ) : (
            <Tabs defaultActiveKey="overview">
              <TabPane tab="心理状态概览" key="overview">
                {studentStatus && (
                  <div>
                    <Descriptions bordered style={{ marginBottom: 24 }}>
                      <Descriptions.Item label="情绪状态">
                        <span style={{ color: levelColor(studentStatus.emotionLevel) }}>
                          {studentStatus.emotionStatus} ({studentStatus.emotionPercentage}%)
                        </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="社交能力">
                        <span style={{ color: levelColor(studentStatus.socialLevel) }}>
                          {studentStatus.socialStatus} ({studentStatus.socialPercentage}%)
                        </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="学习压力">
                        <span style={{ color: levelColor(studentStatus.stressLevel) }}>
                          {studentStatus.stressStatus} ({studentStatus.stressPercentage}%)
                        </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="心理健康">
                        <span style={{ color: levelColor(studentStatus.mentalLevel) }}>
                          {studentStatus.mentalStatus} ({studentStatus.mentalPercentage}%)
                        </span>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                )}
              </TabPane>
              <TabPane tab="学生自评" key="student-assessments">
                {studentAssessments.length > 0 ? (
                  <Table
                    dataSource={studentAssessments}
                    columns={[
                      {
                        title: '评估日期',
                        dataIndex: 'assessmentDate',
                        key: 'assessmentDate',
                        render: (date) => date ? new Date(date).toLocaleDateString() : ''
                      },
                      {
                        title: '评分',
                        dataIndex: 'score',
                        key: 'score',
                        render: (score) => (
                          <span style={{ color: scoreColor(score), fontWeight: 'bold' }}>
                            {score} 分
                          </span>
                        )
                      },
                      {
                        title: '评估意见',
                        dataIndex: 'comments',
                        key: 'comments',
                        ellipsis: true
                      },
                      {
                        title: '操作',
                        key: 'action',
                        render: (_, record) => (
                          <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewAssessmentDetail(record)}
                          >
                            详情
                          </Button>
                        )
                      }
                    ]}
                    pagination={false}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p>该学生未自评</p>
                  </div>
                )}
              </TabPane>
              <TabPane tab="教师评估" key="teacher-assessments">
                <div style={{ marginBottom: 16 }}>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                    style={{
                      backgroundColor: '#2196F3',
                      borderColor: '#2196F3',
                      '&:hover': {
                        backgroundColor: '#1976D2',
                        borderColor: '#1976D2'
                      }
                    }}
                  >
                    添加评估
                  </Button>
                </div>
                {teacherAssessments.length > 0 ? (
                  <Table
                    dataSource={teacherAssessments}
                    columns={[
                      {
                        title: '评估日期',
                        dataIndex: 'assessmentDate',
                        key: 'assessmentDate',
                        render: (date) => date ? new Date(date).toLocaleDateString() : ''
                      },
                      {
                        title: '评分',
                        dataIndex: 'score',
                        key: 'score',
                        render: (score) => (
                          <span style={{ color: scoreColor(score), fontWeight: 'bold' }}>
                            {score} 分
                          </span>
                        )
                      },
                      {
                        title: '评估意见',
                        dataIndex: 'comments',
                        key: 'comments',
                        ellipsis: true
                      },
                      {
                        title: '建议',
                        dataIndex: 'recommendations',
                        key: 'recommendations',
                        ellipsis: true
                      },
                      {
                        title: '操作',
                        key: 'action',
                        render: (_, record) => (
                          <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewAssessmentDetail(record)}
                          >
                            详情
                          </Button>
                        )
                      }
                    ]}
                    pagination={false}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p>暂无教师评估</p>
                  </div>
                )}
              </TabPane>

            </Tabs>
          )}
        </Drawer>

        <Modal
          title={`${selectedAssessment?.assessmentDate ? new Date(selectedAssessment.assessmentDate).toLocaleDateString() : ''} - 评估详情`}
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={600}
        >
          <>
            {/* 心理状态评分 */}
            {selectedAssessment?.score !== undefined && (
              <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#2196F3' }}>心理状态评分：</div>
                <div style={{ fontSize: 18, color: scoreColor(selectedAssessment.score) }}>
                  {selectedAssessment.score} 分
                </div>
              </div>
            )}

            {/* 评估项目 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#2196F3' }}>评估项目：</div>
              {assessmentDetails.length > 0 ? (
                <Table
                  dataSource={assessmentDetails}
                  columns={[
                    {
                      title: '评估项目',
                      dataIndex: 'assessmentType',
                      key: 'assessmentType'
                    },
                    {
                      title: '分数',
                      dataIndex: 'percentage',
                      key: 'percentage',
                      render: (percentage) => (
                        <span style={{ color: scoreColor(percentage) }}>
                          {percentage}%
                        </span>
                      )
                    },
                    {
                      title: '等级',
                      dataIndex: 'level',
                      key: 'level',
                      render: (level) => (
                        <Tag color={levelColor(level)}>
                          {levelText(level)}
                        </Tag>
                      )
                    }
                  ]}
                  pagination={false}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  暂无详细评估项目记录
                </div>
              )}
            </div>

            {/* 评估意见 */}
            {selectedAssessment?.comments && (
              <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#2196F3' }}>评估意见：</div>
                <div>{selectedAssessment.comments}</div>
              </div>
            )}

            {/* 建议 */}
            {selectedAssessment?.recommendations && (
              <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#2196F3' }}>建议：</div>
                <div>{selectedAssessment.recommendations}</div>
              </div>
            )}
          </>
        </Modal>
      </div>
    </div>
  )
}

export default Psychological

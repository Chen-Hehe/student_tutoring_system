import { useState } from 'react'
import { Card, Row, Col, Progress } from 'antd'
const LearningReport = () => {
  const [selectedChild, setSelectedChild] = useState('小明 (三年级)')
  
  const children = [
    '小明 (三年级)',
    '小红 (四年级)'
  ]
  
  const reportData = {
    '小明 (三年级)': {
      name: '小明',
      grade: '三年级',
      subjects: '数学、语文',
      period: '2026年3月',
      overall: '优秀',
      rank: '第5名',
      grades: {
        数学: 92,
        语文: 88,
        英语: 90,
        平均成绩: 90
      },
      progress: {
        数学: 85,
        语文: 78,
        英语: 90
      },
      comment: '小明在本学习期间表现优秀，特别是在数学方面有很大进步。他上课认真听讲，积极参与课堂讨论，作业完成质量高。建议继续保持这种学习态度，在语文阅读理解方面可以多加强练习，提高阅读速度和理解能力。总体来说，小明是一个很有潜力的学生，只要继续努力，成绩会更上一层楼。'
    },
    '小红 (四年级)': {
      name: '小红',
      grade: '四年级',
      subjects: '语文、英语',
      period: '2026年3月',
      overall: '良好',
      rank: '第8名',
      grades: {
        数学: 85,
        语文: 92,
        英语: 88,
        平均成绩: 88
      },
      progress: {
        数学: 75,
        语文: 85,
        英语: 80
      },
      comment: '小红在本学习期间表现良好，尤其是在语文方面有显著进步。她上课认真，作业完成及时，但是在数学方面还需要加强练习。建议在家多做一些数学练习题，提高计算能力和解题技巧。总体来说，小红是一个勤奋的学生，只要继续努力，成绩会有更大的提升。'
    }
  }
  
  const currentReport = reportData[selectedChild]
  
  return (
    <div>
      <Card 
        style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 20,
          marginBottom: 30
        }}
      >
        <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>选择孩子</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {children.map(child => (
            <div 
              key={child}
              style={{
                padding: '15px 30px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedChild === child ? '#FFF3E0' : 'transparent',
                borderColor: selectedChild === child ? '#FF9800' : '#e0e0e0',
                fontWeight: selectedChild === child ? 'bold' : 'normal'
              }}
              onClick={() => setSelectedChild(child)}
              onMouseEnter={(e) => {
                if (selectedChild !== child) {
                  e.currentTarget.borderColor = '#FF9800'
                  e.currentTarget.backgroundColor = '#FFF3E0'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChild !== child) {
                  e.currentTarget.borderColor = '#e0e0e0'
                  e.currentTarget.backgroundColor = 'transparent'
                }
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </Card>
      
      <Card 
        style={{ 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderRadius: 10,
          padding: 30,
          marginBottom: 30
        }}
      >
        <h2 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.5em' }}>学习情况报告</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, paddingBottom: 20, borderBottom: '1px solid #e0e0e0' }}>
          <div>
            <h3 style={{ fontSize: '1.2em', marginBottom: 10 }}>{currentReport.name}</h3>
            <p style={{ color: '#666', marginBottom: 5 }}>{currentReport.grade} | {currentReport.subjects}</p>
            <p style={{ color: '#666' }}>报告周期：{currentReport.period}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2em', marginBottom: 10 }}>总体评价</h3>
            <p style={{ color: '#666', marginBottom: 5 }}>{currentReport.overall}</p>
            <p style={{ color: '#666' }}>班级排名：{currentReport.rank}</p>
          </div>
        </div>
        
        <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
          {Object.entries(currentReport.grades).map(([subject, grade]) => (
            <Col xs={24} md={6} key={subject}>
              <div style={{ 
                backgroundColor: '#f9f9f9',
                padding: 20,
                borderRadius: 10,
                textAlign: 'center'
              }}>
                <h4 style={{ marginBottom: 10, color: '#555' }}>{subject}</h4>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#FF9800' }}>{grade}</div>
              </div>
            </Col>
          ))}
        </Row>
        
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 15, color: '#333' }}>学习进度</h3>
          {Object.entries(currentReport.progress).map(([subject, progress]) => (
            <div key={subject} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 'bold' }}>{subject}</span>
                <span style={{ fontWeight: 'bold' }}>{progress}%</span>
              </div>
              <Progress 
                percent={progress} 
                strokeColor={{ 
                  from: '#FF9800', 
                  to: '#F57C00' 
                }} 
                strokeWidth={10}
                showInfo={false}
              />
            </div>
          ))}
        </div>
        
        <div style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10 }}>
          <h3 style={{ marginBottom: 15, color: '#333' }}>教师评语</h3>
          <p style={{ lineHeight: 1.5 }}>{currentReport.comment}</p>
        </div>
      </Card>
    </div>
  )
}
export default LearningReport

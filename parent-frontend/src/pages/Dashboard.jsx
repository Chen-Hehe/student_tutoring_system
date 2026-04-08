import { Card, Avatar, Button, Row, Col } from 'antd'
const Dashboard = () => {
  return (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              borderRadius: 10,
              padding: 25
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>👨‍🎓</div>
            <h3 style={{ color: '#FF9800', marginBottom: 15, fontSize: '1.3em' }}>孩子情况</h3>
            <p style={{ marginBottom: 5 }}>当前管理 2 个孩子</p>
            <p>1 个孩子正在接受辅导</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              borderRadius: 10,
              padding: 25
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>📊</div>
            <h3 style={{ color: '#FF9800', marginBottom: 15, fontSize: '1.3em' }}>学习成绩</h3>
            <p style={{ marginBottom: 5 }}>平均成绩：85 分</p>
            <p>最近进步：+5 分</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              borderRadius: 10,
              padding: 25
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>❤️</div>
            <h3 style={{ color: '#FF9800', marginBottom: 15, fontSize: '1.3em' }}>心理状态</h3>
            <p style={{ marginBottom: 5 }}>最近评估：良好</p>
            <p>需要关注：0 个孩子</p>
          </Card>
        </Col>
      </Row>
      
      <Card 
        style={{ 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderRadius: 10,
          padding: 25
        }}
      >
        <h3 style={{ color: '#FF9800', marginBottom: 20, fontSize: '1.3em' }}>我的孩子</h3>
        <div style={{ borderBottom: '1px solid #e0e0e0', padding: 15, display: 'flex', alignItems: 'center' }}>
          <Avatar style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#FFF3E0', color: '#FF9800', fontWeight: 'bold', marginRight: 15 }}>小</Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 5 }}>小明</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>三年级</div>
          </div>
          <span style={{ padding: '5px 10px', borderRadius: 15, fontSize: '0.8em', fontWeight: 'bold', backgroundColor: '#d4edda', color: '#155724' }}>学习良好</span>
          <Button style={{ marginLeft: 10, backgroundColor: '#FF9800', color: 'white', fontWeight: 'bold' }}>查看详情</Button>
        </div>
        <div style={{ padding: 15, display: 'flex', alignItems: 'center' }}>
          <Avatar style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#FFF3E0', color: '#FF9800', fontWeight: 'bold', marginRight: 15 }}>小</Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 5 }}>小红</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>四年级</div>
          </div>
          <span style={{ padding: '5px 10px', borderRadius: 15, fontSize: '0.8em', fontWeight: 'bold', backgroundColor: '#fff3cd', color: '#856404' }}>需要关注</span>
          <Button style={{ marginLeft: 10, backgroundColor: '#FF9800', color: 'white', fontWeight: 'bold' }}>查看详情</Button>
        </div>
      </Card>
    </div>
  )
}
export default Dashboard

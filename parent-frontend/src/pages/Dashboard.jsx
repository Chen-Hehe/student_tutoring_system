import { Card, Avatar, Button, Row, Col } from 'antd'

const Dashboard = () => {
  // 卡片样式，根据老师的CSS设置
  const cardStyle = {
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease'
  }

  // 标题栏样式
  const headerStyle = {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  // 孩子列表样式
  const childListStyle = {
    ...cardStyle,
    padding: 20
  }

  // 孩子项样式
  const childItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #e0e0e0',
    transition: 'all 0.3s ease'
  }

  return (
    <div style={{ background: '#f0f8ff', padding: 0 }}>
      {/* 家长仪表盘标题栏 */}
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
        <h1 style={{ color: '#FF9800', margin: 0, fontSize: '1.8em' }}>家长仪表盘</h1>
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

      {/* 三个并排卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8} style={{ display: 'flex' }}>
          <Card 
            hoverable 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>👨‍🎓</div>
            <h3 style={{ color: '#FF9800', margin: '0 0 15px 0', fontSize: '1.3em' }}>孩子情况</h3>
            <p style={{ margin: 0, fontSize: '1em', color: '#333' }}>当前管理 2 个孩子</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1em', color: '#333' }}>1 个孩子正在接受辅导</p>
          </Card>
        </Col>
        <Col xs={24} md={8} style={{ display: 'flex' }}>
          <Card 
            hoverable 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>📊</div>
            <h3 style={{ color: '#FF9800', margin: '0 0 15px 0', fontSize: '1.3em' }}>学习成绩</h3>
            <p style={{ margin: 0, fontSize: '1em', color: '#333' }}>平均成绩：85 分</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1em', color: '#333' }}>最近进步：+5 分</p>
          </Card>
        </Col>
        <Col xs={24} md={8} style={{ display: 'flex' }}>
          <Card 
            hoverable 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '2.5em', marginBottom: 15, color: '#FF9800' }}>❤️</div>
            <h3 style={{ color: '#FF9800', margin: '0 0 15px 0', fontSize: '1.3em' }}>心理状态</h3>
            <p style={{ margin: 0, fontSize: '1em', color: '#333' }}>最近评估：良好</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '1em', color: '#333' }}>需要关注：0 个孩子</p>
          </Card>
        </Col>
      </Row>

      {/* 我的孩子卡片 */}
      <Card style={childListStyle}>
        <h3 style={{ color: '#FF9800', margin: '0 0 20px 0', fontSize: '1.3em' }}>我的孩子</h3>
        <div 
          style={childItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9f9f9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <div style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: '#FFF3E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF9800',
            fontWeight: 'bold',
            marginRight: 15
          }}>小</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 5, fontSize: '1em' }}>小明</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>三年级</div>
          </div>
          <span style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '5px 10px',
            borderRadius: 15,
            fontSize: '0.8em',
            fontWeight: 'bold',
            marginRight: 10
          }}>学习良好</span>
          <Button 
            type="primary" 
            style={{
              backgroundColor: '#FF9800',
              border: 'none',
              fontSize: '0.9em',
              padding: '8px 16px',
              borderRadius: 5,
              fontWeight: 'bold',
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
            查看详情
          </Button>
        </div>
        <div 
          style={childItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9f9f9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <div style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: '#FFF3E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF9800',
            fontWeight: 'bold',
            marginRight: 15
          }}>小</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 5, fontSize: '1em' }}>小红</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>四年级</div>
          </div>
          <span style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '5px 10px',
            borderRadius: 15,
            fontSize: '0.8em',
            fontWeight: 'bold',
            marginRight: 10
          }}>需要关注</span>
          <Button 
            type="primary" 
            style={{
              backgroundColor: '#FF9800',
              border: 'none',
              fontSize: '0.9em',
              padding: '8px 16px',
              borderRadius: 5,
              fontWeight: 'bold',
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
            查看详情
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
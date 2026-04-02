import { Card, Row, Col, Statistic } from 'antd'
import { UserOutlined, BookOutlined, MessageOutlined, CheckCircleOutlined } from '@ant-design/icons'

const Dashboard = () => {
  return (
    <div>
      <h2>系统仪表盘</h2>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1280}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="学习资源"
              value={456}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日消息"
              value={892}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功匹配"
              value={234}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

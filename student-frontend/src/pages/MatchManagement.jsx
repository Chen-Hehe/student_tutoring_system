import { useSelector } from 'react-redux'

const MatchManagement = () => {
  const currentUser = useSelector((state) => state.auth.user)
  
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
        <h1 style={{ color: '#4CAF50', margin: 0, fontSize: '1.8em' }}>🤝 匹配管理</h1>
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
        <div style={{ 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 40,
          backgroundColor: '#fff',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#4CAF50' }}>匹配管理</h2>
          <p style={{ color: '#666' }}>发送辅导请求，查看匹配状态。</p>
        </div>
      </div>
    </div>
  )
}

export default MatchManagement

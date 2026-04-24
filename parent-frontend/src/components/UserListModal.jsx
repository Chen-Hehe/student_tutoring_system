import { useState, useEffect } from 'react'
import { Modal, List, Avatar, Input, Spin, Empty, Tag } from 'antd'
import { userAPI } from '../services/userApi'
import { SearchOutlined } from '@ant-design/icons'

const { Search } = Input

/**
 * 用户列表选择弹窗组件
 */
const UserListModal = ({ visible, onCancel, onSelect, currentUserId, currentRole }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  // 根据当前用户角色确定可聊天的对象角色
  const getTargetRole = () => {
    // 学生 (2) -> 看老师 (1)
    // 老师 (1) -> 看学生 (2)
    // 家长 (3) -> 看老师 (1)
    // 管理员 (4) -> 看所有人
    if (currentRole === 2) return 1
    if (currentRole === 1) return 2
    if (currentRole === 3) return 1
    return null // 管理员看所有人
  }

  // 加载用户列表
  useEffect(() => {
    if (visible) {
      loadUsers()
    }
  }, [visible])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const targetRole = getTargetRole()
      const result = await userAPI.getUsers(targetRole)
      console.log('【DEBUG】获取用户列表返回:', result)
      
      // 处理不同的返回格式
      let usersArray = []
      if (Array.isArray(result)) {
        usersArray = result
      } else if (Array.isArray(result?.data)) {
        usersArray = result.data
      } else if (result?.data?.data && Array.isArray(result.data.data)) {
        usersArray = result.data.data
      } else if (result?.success && Array.isArray(result.data)) {
        usersArray = result.data
      }
      
      // 过滤掉当前用户自己
      const filteredUsers = usersArray.filter(user => user && user.id !== currentUserId)
      console.log('【DEBUG】过滤后的用户列表:', filteredUsers)
      setUsers(filteredUsers)
    } catch (error) {
      console.error('加载用户列表失败:', error)
      setUsers([]) // 确保设置为空数组
    } finally {
      setLoading(false)
    }
  }

  // 搜索过滤
  const filteredUsers = users.filter(user => {
    if (!searchText) return true
    const search = searchText.toLowerCase()
    return user.name?.toLowerCase().includes(search) || 
           user.username?.toLowerCase().includes(search)
  })

  // 获取角色标签
  const getRoleTag = (role) => {
    const roleMap = {
      1: { color: 'blue', text: '教师' },
      2: { color: 'green', text: '学生' },
      3: { color: 'orange', text: '家长' },
      4: { color: 'red', text: '管理员' }
    }
    const roleInfo = roleMap[role] || { color: 'default', text: '未知' }
    return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>
  }

  const handleUserClick = (user) => {
    onSelect(user)
    onCancel()
  }

  return (
    <Modal
      title="选择聊天对象"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Search
        placeholder="搜索用户姓名或用户名"
        allowClear
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      
      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : filteredUsers.length === 0 ? (
          <Empty description={searchText ? '未找到匹配的用户' : '暂无用户'} />
        ) : (
          <List
            dataSource={filteredUsers}
            renderItem={(user) => (
              <List.Item
                onClick={() => handleUserClick(user)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  borderRadius: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={user.avatar} size="large">
                      {user.name?.[0] || user.username?.[0]}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 500 }}>{user.name || user.username}</span>
                      {getRoleTag(user.role)}
                    </div>
                  }
                  description={user.username}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Modal>
  )
}

export default UserListModal

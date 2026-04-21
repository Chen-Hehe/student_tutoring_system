import dayjs from 'dayjs'

/**
 * Format timestamp to readable date string
 * @param {number|string} timestamp 
 * @param {string} format 
 * @returns {string}
 */
export const formatDate = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(timestamp).format(format)
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {number|string} timestamp 
 * @returns {string}
 */
export const formatRelativeTime = (timestamp) => {
  return dayjs(timestamp).fromNow()
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate phone number format (Chinese)
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phone)
}

/**
 * Get role name by role ID
 * @param {number} roleId 
 * @returns {string}
 */
export const getRoleName = (roleId) => {
  const roleMap = {
    1: '教师',
    2: '学生',
    3: '家长',
    4: '管理员'
  }
  return roleMap[roleId] || '未知'
}

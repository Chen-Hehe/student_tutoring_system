import request from '../utils/request'

/**
 * 获取学生的匹配列表
 */
export function getStudentMatches(studentId) {
  return request({
    url: `/api/v1/matches/student/${studentId}`,
    method: 'get'
  })
}

/**
 * 创建匹配请求（学生主动发起）
 */
export function createMatchRequest(data) {
  return request({
    url: '/api/matches',
    method: 'post',
    data
  })
}

/**
 * 接受匹配邀请
 */
export function acceptMatch(matchId, userId, userType = 'student') {
  return request({
    url: `/api/v1/matches/${matchId}/accept`,
    method: 'post',
    data: {
      userId,
      userType
    }
  })
}

/**
 * 拒绝匹配邀请
 */
export function rejectMatch(matchId, userId, userType = 'student') {
  return request({
    url: `/api/v1/matches/${matchId}/reject`,
    method: 'post',
    data: {
      userId,
      userType
    }
  })
}

/**
 * 取消匹配请求
 */
export function cancelMatchRequest(matchId) {
  return request({
    url: `/api/v1/matches/${matchId}/cancel`,
    method: 'post'
  })
}

/**
 * 获取 AI 推荐教师列表
 */
export function getTeacherRecommendations(studentId) {
  return request({
    url: `/api/matches/recommendations/student/${studentId}`,
    method: 'get'
  })
}

/**
 * 接受 AI 推荐（创建匹配）
 */
export function acceptAIRecommendation(teacherId, studentId, message = '') {
  return request({
    url: '/api/v1/matches',
    method: 'post',
    data: {
      teacherId,
      studentId,
      requesterType: 'student',
      requestMessage: message
    }
  })
}

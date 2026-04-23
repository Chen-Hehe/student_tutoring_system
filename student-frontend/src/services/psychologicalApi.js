import api from './api'

export const psychologicalAPI = {
  getStatus: async (studentId) => {
    try {
      const response = await api.get(`/psychological/status/${studentId}`)
      return {
        success: response.code === 200,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  getAssessmentsByStudentId: async (studentId) => {
    try {
      const response = await api.get(`/psychological/assessments/student/${studentId}`)
      return {
        success: response.code === 200,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  getAssessmentsByStudentIdAndType: async (studentId, assessType) => {
    try {
      const response = await api.get(`/psychological/assessments/student/${studentId}/type/${assessType}`)
      return {
        success: response.code === 200,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  getLatestAssessment: async (studentId) => {
    try {
      const response = await api.get(`/psychological/assessments/latest/${studentId}`)
      return {
        success: response.code === 200,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  createAssessment: async (data) => {
    try {
      const response = await api.post('/psychological/assessments', data)
      return {
        success: response.code === 200,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  createAssessmentDetail: async (data) => {
    try {
      const response = await api.post('/psychological/assessment-details', data)
      return {
        success: response.code === 200,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  createStatus: async (data) => {
    try {
      const response = await api.post('/psychological/status', data)
      return {
        success: response.code === 200,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

import api from './api'

export const psychologicalAPI = {
  getStatus: async (studentId) => {
    try {
      const result = await api.get(`/api/psychological/status/${studentId}`)
      return {
        success: true,
        data: result.data
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
      const result = await api.get(`/api/psychological/assessments/student/${studentId}`)
      return {
        success: true,
        data: result.data
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
      const result = await api.get(`/api/psychological/assessments/student/${studentId}/type/${assessType}`)
      return {
        success: true,
        data: result.data
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
      const result = await api.get(`/api/psychological/assessments/latest/${studentId}`)
      return {
        success: true,
        data: result.data
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
      const result = await api.post('/api/psychological/assessments', data)
      return {
        success: true,
        data: result.data
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
      const result = await api.post('/api/psychological/assessment-details', data)
      return {
        success: true,
        data: result.data
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
      const result = await api.post('/api/psychological/status', data)
      return {
        success: true,
        data: result.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  getAssessmentDetails: async (assessmentId) => {
    try {
      const result = await api.get(`/api/psychological/assessment-details/${assessmentId}`)
      return {
        success: true,
        data: result.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

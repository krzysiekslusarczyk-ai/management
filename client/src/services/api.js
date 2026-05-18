import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me')
}

// User services
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
}

// Pharmacy services
export const pharmacyService = {
  getAll: () => api.get('/pharmacies'),
  getById: (id) => api.get(`/pharmacies/${id}`),
  create: (data) => api.post('/pharmacies', data),
  update: (id, data) => api.put(`/pharmacies/${id}`, data),
  assignUser: (pharmacyId, userId) => api.post(`/pharmacies/${pharmacyId}/users`, { userId })
}

// Schedule services
export const scheduleService = {
  getAll: (params) => api.get('/schedules', { params }),
  getById: (id) => api.get(`/schedules/${id}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  approve: (id) => api.post(`/schedules/${id}/approve`),
  publish: (id) => api.post(`/schedules/${id}/publish`)
}

// Shift services
export const shiftService = {
  getBySchedule: (scheduleId) => api.get(`/shifts/schedule/${scheduleId}`),
  create: (data) => api.post('/shifts', data),
  update: (id, data) => api.put(`/shifts/${id}`, data),
  delete: (id) => api.delete(`/shifts/${id}`)
}

// Absence services
export const absenceService = {
  getAll: (params) => api.get('/absences', { params }),
  create: (data) => api.post('/absences', data),
  update: (id, data) => api.put(`/absences/${id}`, data),
  approve: (id) => api.post(`/absences/${id}/approve`),
  delete: (id) => api.delete(`/absences/${id}`)
}

// Preference services
export const preferenceService = {
  getMy: () => api.get('/preferences/me'),
  getByUser: (userId) => api.get(`/preferences/user/${userId}`),
  createOrUpdate: (data) => api.post('/preferences', data),
  delete: (id) => api.delete(`/preferences/${id}`)
}

export default api

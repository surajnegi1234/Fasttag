const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const authAPI = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) })
}

export const vehicleAPI = {
  getAll: () => request('/vehicles'),
  add: (body) => request('/vehicles', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/vehicles/${id}`, { method: 'DELETE' })
}

export const transactionAPI = {
  getAll: (params = {}) => request(`/transactions?${new URLSearchParams(params)}`),
  recharge: (body) => request('/transactions/recharge', { method: 'POST', body: JSON.stringify(body) }),
  getInvoice: (id) => request(`/transactions/${id}/invoice`)
}

export const notificationAPI = {
  getAll: () => request('/notifications'),
  markAllRead: () => request('/notifications/read-all', { method: 'PUT' })
}

export const adminAPI = {
  getUsers: (params = {}) => request(`/admin/users?${new URLSearchParams(params)}`),
  toggleUser: (id) => request(`/admin/users/${id}/toggle`, { method: 'PUT' }),
  getTransactions: (params = {}) => request(`/admin/transactions?${new URLSearchParams(params)}`),
  getAnalytics: () => request('/admin/analytics')
}

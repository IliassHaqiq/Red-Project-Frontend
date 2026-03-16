import { clearStorage } from '../utils/storage'

const BASE_URL = 'http://localhost:8080/api'

/**
 * Wrapper fetch générique
 * @param {string} path       - ex: "/products"
 * @param {object} options    - options fetch (method, body…)
 * @param {string|null} token - JWT token
 */
export async function request(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(`${BASE_URL}${path}`, { headers, ...options })

  if (!response.ok) {
    // Si le token est invalide ou expiré (401), nettoyer le storage
    if (response.status === 401 && token) {
      clearStorage()
      // Déclencher un événement personnalisé pour notifier App.jsx
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    
    const err = await response.json().catch(() => ({ message: 'Erreur serveur' }))
    throw new Error(err.message || 'Erreur')
  }

  if (response.status === 204) return null
  return response.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login    = (body)        => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) })
export const register = (body)        => request('/auth/register', { method: 'POST', body: JSON.stringify(body) })

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts  = ()           => request('/products')
export const getProduct   = (id)         => request(`/products/${id}`)
export const createProduct = (body, token) => request('/admin/products',     { method: 'POST',   body: JSON.stringify(body) }, token)
export const updateProduct = (id, body, token) => request(`/admin/products/${id}`, { method: 'PUT',    body: JSON.stringify(body) }, token)
export const deleteProduct = (id, token) => request(`/admin/products/${id}`, { method: 'DELETE' }, token)

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories    = ()           => request('/categories')
export const createCategory   = (body, token) => request('/admin/categories', { method: 'POST', body: JSON.stringify(body) }, token)

// ── Orders ────────────────────────────────────────────────────────────────────
export const createOrder      = (body, token) => request('/orders',       { method: 'POST',  body: JSON.stringify(body) }, token)
export const getMyOrders      = (token)        => request('/orders/me',   {}, token)
export const getAllOrders      = (token)        => request('/admin/orders', {}, token)
export const updateOrderStatus = (id, status, token) =>
  request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token)

// ── Users (Admin Sup) ─────────────────────────────────────────────────────────
export const getAllUsers     = (token) => request('/adminsup/users', {}, token)
export const updateUserRole  = (id, role, token) =>
  request(`/adminsup/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }, token)
export const deleteUser      = (id, token) =>
  request(`/adminsup/users/${id}`, { method: 'DELETE' }, token)
export const createAdminUser = (body, token) =>
  request('/adminsup/users', { method: 'POST', body: JSON.stringify(body) }, token)
export const updateAdminUser = (id, body, token) =>
  request(`/adminsup/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token)

// ── Notifications ─────────────────────────────────────────────────────────────
export const getNotifications    = (token)        => request('/notifications', {}, token)
export const getUnreadNotifications = (token)     => request('/notifications/unread', {}, token)
export const getUnreadCount       = (token)        => request('/notifications/unread/count', {}, token)
export const markNotificationRead = (id, token)   => request(`/notifications/${id}/read`, { method: 'PATCH' }, token)
export const markAllNotificationsRead = (token)   => request('/notifications/read-all', { method: 'PATCH' }, token)

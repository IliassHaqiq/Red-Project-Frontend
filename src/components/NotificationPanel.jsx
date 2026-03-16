    import { useState, useEffect } from 'react'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api'
import './NotificationPanel.css'

export default function NotificationPanel({ token, onClose, unreadCount, onMarkRead }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      loadNotifications()
    }
  }, [token])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await getNotifications(token)
      setNotifications(data)
    } catch (e) {
      console.error('Erreur lors du chargement des notifications:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id, token)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      if (onMarkRead) onMarkRead()
    } catch (e) {
      console.error('Erreur lors de la mise à jour:', e)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead(token)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      if (onMarkRead) onMarkRead()
    } catch (e) {
      console.error('Erreur lors de la mise à jour:', e)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_CREATED':
        return '✅'
      case 'ORDER_STATUS_CHANGED':
        return '📦'
      case 'PRODUCT_CREATED':
        return '🆕'
      default:
        return '🔔'
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read)

  return (
    <div className="notification-panel-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-panel-header">
          <h2>Notifications</h2>
          {unreadNotifications.length > 0 && (
            <button className="notification-mark-all-btn" onClick={handleMarkAllAsRead}>
              Tout marquer comme lu
            </button>
          )}
          <button className="notification-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="notification-panel-body">
          {loading ? (
            <div className="notification-loading">
              <span className="spinner" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <div className="notification-empty-icon">🔔</div>
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{formatDate(notification.createdAt)}</span>
                  </div>
                  {!notification.read && <div className="notification-dot" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

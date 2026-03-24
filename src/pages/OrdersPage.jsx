import { useState, useEffect } from 'react'
import { getMyOrders } from '../api'
import './OrdersPage.css'

const STATUS_LABELS = {
  EN_COURS: 'En cours',
  VALIDEE:  'Validée',
  EXPEDIEE: 'Expédiée',
  LIVREE:   'Livrée',
  ANNULEE:  'Annulée',
}

export default function OrdersPage({ token }) {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders(token).then(setOrders).finally(() => setLoading(false))
  }, [token])

  if (loading) return (
    <div className="orders-page">
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 64 }}>
        <span className="spinner spinner-lg" />
      </div>
    </div>
  )

  return (
    <div className="orders-page fade-in">
      <div className="orders-page-header">
        <h1 className="orders-page-title">Mes Commandes</h1>
        <p className="orders-page-sub">{orders.length} commande{orders.length !== 1 ? 's' : ''} passée{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📦</div>
          <div className="empty-title">Aucune commande pour l'instant</div>
          <p>Vos commandes apparaîtront ici après votre premier achat</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div className="order-card-header-left">
                <span className="order-id">Commande #{order.id}</span>
                <span className="order-date">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="order-card-header-right">
                <span className={`status-badge status-${order.status}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="order-total">{Number(order.totalAmount).toFixed(2)} DH</span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  <span>
                    <span className="order-item-name">{item.productName}</span>
                    <span className="order-item-qty">× {item.quantity}</span>
                  </span>
                  <span className="order-item-price">{Number(item.lineTotal).toFixed(2)} DH</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
import { useState } from 'react'
import { createOrder } from '../api'
import './CartPage.css'

export default function CartPage({ cart, setCart, token, addToast, setPage }) {
  const [loading, setLoading] = useState(false)

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    )
  }

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const placeOrder = async () => {
    setLoading(true)
    try {
      await createOrder({ items: cart.map(i => ({ productId: i.id, quantity: i.qty })) }, token)
      setCart([])
      addToast('Commande passée avec succès !')
      setPage('orders')
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) return (
    <div className="cart-page fade-in">
      <div className="empty" style={{ paddingTop: 80 }}>
        <div className="empty-icon">🛒</div>
        <div className="empty-title">Votre panier est vide</div>
        <p style={{ marginBottom: 28 }}>Ajoutez des articles pour commencer vos achats</p>
        <button className="btn btn-primary" onClick={() => setPage('shop')}>
          Découvrir la boutique
        </button>
      </div>
    </div>
  )

  return (
    <div className="cart-page fade-in">
      {/* Header */}
      <div className="cart-page-header">
        <h1 className="cart-page-title">Mon Panier</h1>
        <p className="cart-page-sub">{itemCount} article{itemCount !== 1 ? 's' : ''}</p>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items-panel">
          <div className="cart-items-header">Articles</div>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-unit">{Number(item.price).toFixed(2)} DH / unité</div>
              </div>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                <span className="qty-value">{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
              </div>
              <div className="cart-item-total">
                {(Number(item.price) * item.qty).toFixed(2)} DH
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <div className="cart-summary-header">Récapitulatif</div>
          <div className="cart-summary-body">
            <div className="cart-summary-row">
              <span>Sous-total ({itemCount} article{itemCount !== 1 ? 's' : ''})</span>
              <span>{total.toFixed(2)} DH</span>
            </div>
            <div className="cart-summary-row">
              <span>Livraison</span>
              <span className="cart-summary-free">Gratuite</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-total">
              <span className="cart-summary-total-label">Total TTC</span>
              <span className="cart-total-amount">{total.toFixed(2)} DH</span>
            </div>
            <button className="cart-order-btn" onClick={placeOrder} disabled={loading}>
              {loading ? <span className="spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} /> : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                  </svg>
                  Passer la commande
                </>
              )}
            </button>
            <div className="cart-summary-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Paiement 100% sécurisé
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
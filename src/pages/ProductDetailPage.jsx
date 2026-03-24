import { useMemo, useState } from 'react'
import './ProductDetailPage.css'

export default function ProductDetailPage({ product, token, onAddToCart, setPage, addToast }) {
  const [qty, setQty] = useState(1)

  const sortedImages = useMemo(() =>
    [...(product?.images || [])].sort((a, b) => a.displayOrder - b.displayOrder),
    [product]
  )

  const defaultImage =
    sortedImages.find(img => img.primaryImage)?.imageUrl ||
    sortedImages[0]?.imageUrl || ''

  const [selectedImage, setSelectedImage] = useState(defaultImage)

  if (!product) return null

  const handleAdd = () => {
    onAddToCart(product, qty)
    addToast(`${product.name} ajouté au panier`)
  }

  return (
    <div className="product-detail-page fade-in">
      {/* Back */}
      <button className="back-btn" onClick={() => setPage('shop')}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 12L6 8l4-4"/>
        </svg>
        Retour à la boutique
      </button>

      <div className="product-detail-layout">
        {/* ── Gallery ── */}
        <div className="product-gallery">
          <div className="product-main-image-wrap">
            {selectedImage
              ? <img src={selectedImage} alt={product.name} className="product-main-image" />
              : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:80,opacity:0.15 }}>📦</div>
            }
          </div>
          {sortedImages.length > 1 && (
            <div className="product-thumbnails">
              {sortedImages.map(img => (
                <img
                  key={img.id || img.imageUrl}
                  src={img.imageUrl}
                  alt={product.name}
                  className={`product-thumbnail ${selectedImage === img.imageUrl ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img.imageUrl)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="product-info">
          <div className="product-category">{product.category}</div>
          <h1>{product.name}</h1>
          <div className="product-price">{Number(product.price).toFixed(2)} DH</div>

          {product.description && (
            <>
              <div className="product-desc-label">Description</div>
              <p className="product-desc-text">{product.description}</p>
            </>
          )}

          <div className={`product-stock-row ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stock > 0 ? `${product.stock} unités disponibles` : 'Rupture de stock'}
          </div>

          {product.stock > 0 && (
            <div className="product-cta-box">
              <div className="qty-label">Quantité</div>
              <div className="qty-box">
                <div className="qty-controls">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>
                  {(Number(product.price) * qty).toFixed(2)} DH au total
                </span>
              </div>

              {token ? (
                <button className="btn-add-cart" onClick={handleAdd}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Ajouter au panier
                </button>
              ) : (
                <button className="btn-login-to-buy" onClick={() => setPage('auth')}>
                  Connectez-vous pour acheter →
                </button>
              )}
            </div>
          )}

          <div className="product-divider" />

          {/* Trust badges */}
          <div className="product-trust">
            <div className="trust-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Paiement sécurisé
            </div>
            <div className="trust-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Livraison gratuite
            </div>
            <div className="trust-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Retour sous 30 jours
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { getProducts, getCategories } from '../api'
import './ShopPage.css'

export default function ShopPage({ token, onAddToCart, addToast, setPage, setDetailProduct }) {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [activeCat, setActiveCat]   = useState('all')
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p); setCategories(c) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const matchCat    = activeCat === 'all' || p.category === activeCat
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.description?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const getPrimaryImage = (p) =>
    p.images?.find(img => img.primaryImage)?.imageUrl ||
    p.images?.[0]?.imageUrl || ''

  const openDetail = (product) => {
    setDetailProduct(product)
    setPage('detail')
  }

  if (loading) return (
    <div className="shop-loading">
      <span className="spinner spinner-lg" style={{ marginTop: 80 }} />
    </div>
  )

  return (
    <div>
      {/* ── Hero ── */}
      <div className="shop-hero">
        <div className="shop-hero-label">Nouvelle collection</div>
        <h1 className="shop-hero-title">Notre Collection</h1>
        <p className="shop-hero-sub">Découvrez des produits sélectionnés avec soin pour vous</p>
      </div>

      {/* ── Sticky toolbar ── */}
      <div className="shop-toolbar">
        <div className="shop-search-wrap">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7" cy="7" r="5"/><path d="m11 11 3 3"/>
          </svg>
          <input
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="shop-toolbar-sep" />

        <div className="shop-cat-tabs">
          <button
            className={`shop-cat-tab ${activeCat === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCat('all')}
          >
            Tout
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              className={`shop-cat-tab ${activeCat === c.name ? 'active' : ''}`}
              onClick={() => setActiveCat(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>

        <span className="shop-count-badge">
          {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Grid ── */}
      <div className="shop-body fade-in">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Aucun produit trouvé</div>
            <p>Essayez une autre catégorie ou terme de recherche</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p, i) => {
              const img = getPrimaryImage(p)
              return (
                <article
                  key={p.id}
                  className="product-card"
                  onClick={() => openDetail(p)}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="product-card-image-wrap">
                    {img ? (
                      <img src={img} alt={p.name} className="product-card-image" />
                    ) : (
                      <div className="product-card-image-placeholder">📦</div>
                    )}
                    {p.stock === 0 && (
                      <span className="product-card-badge out">Rupture</span>
                    )}
                    {p.stock > 0 && p.stock < 5 && (
                      <span className="product-card-badge">Dernières pièces</span>
                    )}
                  </div>

                  <div className="product-card-body">
                    <div className="product-category">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    {p.description && (
                      <p className="product-desc">{p.description}</p>
                    )}
                    <div className="product-card-footer">
                      <span className="product-price">{Number(p.price).toFixed(2)} DH</span>
                      <span className={`product-stock ${p.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                        {p.stock > 0 ? `✓ ${p.stock} en stock` : '✗ Rupture'}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
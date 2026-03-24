import { useState, useEffect } from 'react'
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../api'

export default function AdminProducts({ token, addToast }) {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null)
  const [search, setSearch]         = useState('')
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', categoryId: '',
    images: [{ imageUrl: '', primaryImage: true, displayOrder: 1 }]
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p); setCategories(c) })
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => {
    setForm({ name: '', description: '', price: '', stock: '', categoryId: '',
      images: [{ imageUrl: '', primaryImage: true, displayOrder: 1 }] })
    setError(''); setModal('create')
  }

  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description || '',
      price: p.price, stock: p.stock,
      categoryId: categories.find(c => c.name === p.category)?.id || '',
      images: p.images?.length
        ? p.images.map((img, i) => ({ imageUrl: img.imageUrl, primaryImage: !!img.primaryImage, displayOrder: img.displayOrder ?? i + 1 }))
        : [{ imageUrl: '', primaryImage: true, displayOrder: 1 }]
    })
    setError(''); setModal(p)
  }

  const save = async () => {
    setSaving(true); setError('')
    try {
      const body = {
        name: form.name, description: form.description,
        price: parseFloat(form.price), stock: parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
        images: form.images.filter(img => img.imageUrl.trim())
          .map((img, i) => ({ imageUrl: img.imageUrl.trim(), primaryImage: img.primaryImage, displayOrder: i + 1 }))
      }
      if (modal === 'create') { await createProduct(body, token); addToast('Produit créé') }
      else { await updateProduct(modal.id, body, token); addToast('Produit mis à jour') }
      setModal(null); load()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    await deleteProduct(id, token); addToast('Produit supprimé'); load()
  }

  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const setImageField = (i, key, value) =>
    setForm(f => ({ ...f, images: f.images.map((img, idx) => idx === i ? { ...img, [key]: value } : img) }))

  const addImageField = () =>
    setForm(f => ({ ...f, images: [...f.images, { imageUrl: '', primaryImage: false, displayOrder: f.images.length + 1 }] }))

  const removeImageField = (i) =>
    setForm(f => {
      const updated = f.images.filter((_, idx) => idx !== i).map((img, idx) => ({ ...img, displayOrder: idx + 1 }))
      if (updated.length > 0 && !updated.some(img => img.primaryImage)) updated[0].primaryImage = true
      return { ...f, images: updated.length ? updated : [{ imageUrl: '', primaryImage: true, displayOrder: 1 }] }
    })

  const setPrimaryImage = (i) =>
    setForm(f => ({ ...f, images: f.images.map((img, idx) => ({ ...img, primaryImage: idx === i })) }))

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Produits</h1>
          <p className="admin-page-subtitle">{products.length} produit{products.length !== 1 ? 's' : ''} dans le catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Nouveau produit
        </button>
      </div>

      {/* Table card */}
      <div className="admin-table-card">
        {/* Toolbar */}
        <div className="admin-table-toolbar">
          <div className="admin-table-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="7" cy="7" r="5"/><path d="m11 11 3 3"/>
            </svg>
            <input
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="admin-count-chip">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <span className="spinner spinner-lg" />
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th style={{ width: 56 }}>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty" style={{ padding: '40px 0' }}>
                      <div className="empty-icon">🔍</div>
                      <div className="empty-title">Aucun résultat</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(p => {
                const primaryImage = p.images?.find(img => img.primaryImage)?.imageUrl || p.images?.[0]?.imageUrl || ''
                return (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--muted)', fontWeight: 500 }}>#{p.id}</td>
                    <td>
                      {primaryImage
                        ? <img src={primaryImage} alt={p.name} className="admin-product-thumb" />
                        : <div className="admin-product-thumb-empty">—</div>
                      }
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                      {p.description && (
                        <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ display:'inline-block', padding:'2px 9px', background:'var(--surface3)', border:'1px solid var(--border)', borderRadius:20, fontSize:12, fontWeight:500, color:'var(--text-2)' }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {Number(p.price).toFixed(2)} DH
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 600,
                        color: p.stock === 0 ? 'var(--red)' : p.stock < 5 ? 'var(--warning)' : 'var(--success)'
                      }}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="table-action-btn" onClick={() => openEdit(p)}>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 2a2.12 2.12 0 0 1 3 3L5 14l-4 1 1-4Z"/>
                          </svg>
                          Modifier
                        </button>
                        <button className="table-action-btn danger" onClick={() => del(p.id)}>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 4h12M5 4V2h6v2M6 7v6M10 7v6M3 4l1 10h8l1-10"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {modal === 'create' ? 'Nouveau produit' : `Modifier — ${modal.name}`}
              </h3>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="field">
              <label className="label">Nom du produit</label>
              <input className="input" placeholder="Ex: Robe d'été fleurie" value={form.name} onChange={setF('name')} />
            </div>
            <div className="field">
              <label className="label">Description</label>
              <textarea className="input" rows={3} placeholder="Description courte..." value={form.description} onChange={setF('description')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="field">
                <label className="label">Prix (DH)</label>
                <input className="input" type="number" step="0.01" min="0" placeholder="0.00" value={form.price} onChange={setF('price')} />
              </div>
              <div className="field">
                <label className="label">Stock</label>
                <input className="input" type="number" min="0" placeholder="0" value={form.stock} onChange={setF('stock')} />
              </div>
            </div>
            <div className="field">
              <label className="label">Catégorie</label>
              <select className="input" value={form.categoryId} onChange={setF('categoryId')}>
                <option value="">Sélectionner une catégorie...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="field">
              <label className="label">Images</label>
              <div className="admin-images-list">
                {form.images.map((img, index) => (
                  <div key={index} className="admin-image-row">
                    <input className="input" type="text" placeholder="https://..." value={img.imageUrl}
                      onChange={e => setImageField(index, 'imageUrl', e.target.value)} />
                    <label className="admin-image-primary">
                      <input type="radio" name="primaryImage" checked={img.primaryImage} onChange={() => setPrimaryImage(index)} />
                      Principale
                    </label>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeImageField(index)}>✕</button>
                    {img.imageUrl && (
                      <img src={img.imageUrl} alt="" className="admin-image-preview" />
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addImageField}>
                + Ajouter une image
              </button>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? <span className="spinner" /> : modal === 'create' ? 'Créer le produit' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
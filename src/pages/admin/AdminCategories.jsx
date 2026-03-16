import { useState, useEffect } from 'react'
import { getCategories, createCategory } from '../../api'

export default function AdminCategories({ token, addToast }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [name, setName]             = useState('')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  const load = () => {
    setLoading(true)
    getCategories().then(setCategories).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const create = async () => {
    if (!name.trim()) return
    setSaving(true); setError('')
    try {
      await createCategory({ name }, token)
      addToast('Catégorie créée')
      setName('')
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Catégories</h1>
          <p className="admin-page-subtitle">{categories.length} catégorie{categories.length !== 1 ? 's' : ''} configurée{categories.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Create form */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', maxWidth: 520, marginBottom: 32, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: 'var(--text)' }}>
          Ajouter une catégorie
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="input"
            placeholder="Ex: Robes, Accessoires, Chaussures..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && create()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={create} disabled={saving || !name.trim()}>
            {saving ? <span className="spinner" /> : 'Créer'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 10 }}>
          Appuyez sur Entrée ou cliquez Créer pour ajouter la catégorie.
        </p>
      </div>

      {/* Categories grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <span className="spinner spinner-lg" />
        </div>
      ) : categories.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏷️</div>
          <div className="empty-title">Aucune catégorie</div>
          <p>Créez votre première catégorie ci-dessus</p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted-2)', marginBottom: 14 }}>
            {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {categories.map(c => (
              <div key={c.id} className="category-chip">
                <span style={{ fontSize: 18 }}>🏷️</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{c.name}</span>
                <span className="category-chip-id">#{c.id}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
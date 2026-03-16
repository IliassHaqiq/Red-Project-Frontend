import { useState, useEffect } from 'react'
import { getAllOrders, updateOrderStatus } from '../../api'

const STATUSES = ['EN_COURS', 'VALIDEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE']

const STATUS_LABELS = {
  EN_COURS: 'En cours',
  VALIDEE:  'Validée',
  EXPEDIEE: 'Expédiée',
  LIVREE:   'Livrée',
  ANNULEE:  'Annulée',
}

export default function AdminOrders({ token, addToast }) {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  const load = () => {
    setLoading(true)
    getAllOrders(token).then(setOrders).finally(() => setLoading(false))
  }
  useEffect(load, [token])

  const changeStatus = async (id, status) => {
    await updateOrderStatus(id, status, token)
    addToast('Statut mis à jour')
    load()
  }

  const filtered = orders.filter(o =>
    o.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.id).includes(search)
  )

  const totalRevenue = orders
    .filter(o => o.status !== 'ANNULEE')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0)

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Commandes</h1>
          <p className="admin-page-subtitle">{orders.length} commande{orders.length !== 1 ? 's' : ''} au total</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted-2)', marginBottom: 4 }}>
            Revenu total
          </div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            {totalRevenue.toFixed(2)} €
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
        {STATUSES.map(s => {
          const count = orders.filter(o => o.status === s).length
          return (
            <div key={s} className="stat-card" style={{ padding: '14px 16px' }}>
              <div className="stat-label" style={{ marginBottom: 6 }}>{STATUS_LABELS[s]}</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, letterSpacing: '-0.03em' }}>{count}</div>
            </div>
          )
        })}
      </div>

      {/* Table card */}
      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="7" cy="7" r="5"/><path d="m11 11 3 3"/>
            </svg>
            <input placeholder="Rechercher par email ou ID..." value={search} onChange={e => setSearch(e.target.value)} />
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
                <th>Commande</th>
                <th>Client</th>
                <th>Total</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Modifier le statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="empty" style={{ padding: '40px 0' }}>
                    <div className="empty-icon">📭</div>
                    <div className="empty-title">Aucune commande trouvée</div>
                  </div>
                </td></tr>
              ) : filtered.map(o => (
                <tr key={o.id}>
                  <td>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>#{o.id}</span>
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{o.customerEmail}</td>
                  <td>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {Number(o.totalAmount).toFixed(2)} €
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted-2)', fontSize: 12.5 }}>
                    {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span className={`status-badge status-${o.status}`}>{STATUS_LABELS[o.status] || o.status}</span>
                  </td>
                  <td>
                    <select
                      className="input"
                      style={{ width: 'auto', padding: '5px 28px 5px 10px', fontSize: 12.5, minWidth: 120 }}
                      value={o.status}
                      onChange={e => changeStatus(o.id, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
import { useState } from 'react'
import AdminProducts   from './admin/AdminProducts'
import AdminOrders     from './admin/AdminOrders'
import AdminCategories from './admin/AdminCategories'
import AdminUsers      from './admin/AdminUsers'
import './AdminPage.css'

const NAV_ITEMS_BASE = [
  { key: 'products',   icon: '📦', label: 'Produits'   },
  { key: 'orders',     icon: '📋', label: 'Commandes'  },
  { key: 'categories', icon: '🏷️', label: 'Catégories' },
]

export default function AdminPage({ token, addToast, user, isAdminSup }) {
  const [section, setSection] = useState('products')

  const navItems = isAdminSup
    ? [...NAV_ITEMS_BASE, { key: 'users', icon: '👤', label: 'Utilisateurs' }]
    : NAV_ITEMS_BASE

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-section">Catalogue</div>
        {navItems.map(n => (
          <button
            key={n.key}
            className={`admin-nav-item ${section === n.key ? 'active' : ''}`}
            onClick={() => setSection(n.key)}
          >
            <span className="admin-nav-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </aside>

      {/* ── Main ── */}
      <div className="admin-content" key={section}>
        {section === 'products'   && <AdminProducts   token={token} addToast={addToast} />}
        {section === 'orders'     && <AdminOrders     token={token} addToast={addToast} />}
        {section === 'categories' && <AdminCategories token={token} addToast={addToast} />}
        {section === 'users'      && isAdminSup && <AdminUsers token={token} addToast={addToast} />}
      </div>
    </div>
  )
}
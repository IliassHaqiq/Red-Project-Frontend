import './Navbar.css'

export default function Navbar({ user, page, setPage, cartCount, onLogout, notificationCount, onNotificationClick }) {
  const isAdmin  = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_ADMINSUP')
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <nav className="nav">
      {/* Logo */}
      <div className="nav-logo" onClick={() => setPage('shop')}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shopping cart icon */}
          <path 
            d="M6 6h3l3.6 12.8a2 2 0 0 0 1.9 1.4h9.8a2 2 0 0 0 1.9-1.4L29 10H10" 
            stroke="#dc2626" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="13" cy="27" r="1.5" fill="#dc2626"/>
          <circle cx="24" cy="27" r="1.5" fill="#dc2626"/>
        </svg>
        <span className="nav-logo-text">
          Cart<span className="nav-logo-highlight">ify</span>
        </span>
      </div>

      {/* Nav links */}
      <div className="nav-links">
        <button
          className={`nav-link ${page === 'shop' ? 'active' : ''}`}
          onClick={() => setPage('shop')}
        >
          Boutique
        </button>

        {user && (
          <button
            className={`nav-link ${page === 'orders' ? 'active' : ''}`}
            onClick={() => setPage('orders')}
          >
            Mes commandes
          </button>
        )}

        {isAdmin && (
          <button
            className={`nav-link admin-link ${page === 'admin' ? 'active' : ''}`}
            onClick={() => setPage('admin')}
          >
            ⚡ Admin
          </button>
        )}
      </div>

      {/* Right actions */}
      <div className="nav-actions">
        {user && (
          <>
            <button className="nav-notification-btn" onClick={onNotificationClick} title="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notificationCount > 0 && (
                <span className="nav-notification-badge">{notificationCount > 9 ? '9+' : notificationCount}</span>
              )}
            </button>
            <button className="nav-cart-btn" onClick={() => setPage('cart')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount}</span>
              )}
            </button>
          </>
        )}

        {user ? (
          <>
            <div className="nav-sep" />
            <div className="nav-user-chip" title={user.fullName}>
              <div className="nav-avatar">{initials}</div>
              <span className="nav-user-name">{user.fullName || user.email}</span>
            </div>
            <button className="nav-logout-btn" onClick={onLogout} title="Se déconnecter">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Déconnexion
            </button>
          </>
        ) : (
          <button className="nav-connect-btn" onClick={() => setPage('auth')}>
            Connexion
          </button>
        )}
      </div>
    </nav>
  )
}
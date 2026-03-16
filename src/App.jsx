import { useState, useEffect } from 'react'
import Navbar            from './components/Navbar'
import Toast             from './components/Toast'
import NotificationPanel from './components/NotificationPanel'
import { useToast }      from './hooks/useToast'
import AuthPage          from './pages/AuthPage'
import ShopPage          from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage          from './pages/CartPage'
import OrdersPage        from './pages/OrdersPage'
import AdminPage         from './pages/AdminPage'
import { saveToken, getToken, saveUser, getUser, saveCart, getCart, clearStorage } from './utils/storage'
import { getUnreadCount } from './api'

export default function App() {
  const [page, setPage]               = useState('shop')
  const [user, setUser]               = useState(null)
  const [token, setToken]             = useState(null)
  const [cart, setCart]               = useState([])
  const [detailProduct, setDetailProduct] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const { toasts, addToast }          = useToast()

  // ── Chargement initial depuis localStorage ────────────────────────────────
  useEffect(() => {
    const savedToken = getToken()
    const savedUser = getUser()
    const savedCart = getCart()

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(savedUser)
    }

    if (savedCart && savedCart.length > 0) {
      setCart(savedCart)
    }
  }, [])

  // ── Sauvegarde du panier à chaque modification ─────────────────────────────
  useEffect(() => {
    saveCart(cart)
  }, [cart])

  // ── Gestion de l'expiration du token ────────────────────────────────────────
  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null)
      setUser(null)
      setCart([])
      clearStorage()
      setPage('shop')
      setNotificationCount(0)
      addToast('Votre session a expiré. Veuillez vous reconnecter.', 'error')
    }

    window.addEventListener('auth:expired', handleAuthExpired)
    return () => window.removeEventListener('auth:expired', handleAuthExpired)
  }, [addToast])

  // ── Chargement du compteur de notifications ────────────────────────────────
  useEffect(() => {
    if (token) {
      loadNotificationCount()
      // Rafraîchir le compteur toutes les 30 secondes
      const interval = setInterval(loadNotificationCount, 30000)
      return () => clearInterval(interval)
    } else {
      setNotificationCount(0)
    }
  }, [token])

  const loadNotificationCount = async () => {
    if (!token) return
    try {
      const data = await getUnreadCount(token)
      setNotificationCount(data.count || 0)
    } catch (e) {
      console.error('Erreur lors du chargement du compteur de notifications:', e)
    }
  }

  // ── Auth ───────────────────────────────────────────────────────────────────
  const handleLogin = (data) => {
    setToken(data.token)
    setUser(data)
    saveToken(data.token)
    saveUser(data)
    setPage('shop')
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    setCart([])
    setNotificationCount(0)
    setShowNotifications(false)
    clearStorage()
    setPage('shop')
    addToast('Déconnecté')
  }

  const handleNotificationClick = () => {
    setShowNotifications(true)
  }

  const handleNotificationClose = () => {
    setShowNotifications(false)
    loadNotificationCount() // Rafraîchir le compteur après fermeture
  }

  // ── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = (product, qty) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      const updated = existing 
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { ...product, qty }]
      return updated
    })
  }

  const cartCount   = cart.reduce((sum, i) => sum + i.qty, 0)
  const isAdmin     = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_ADMINSUP')
  const isAdminSup  = user?.roles?.includes('ROLE_ADMINSUP')

  // ── Router ─────────────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'auth':
        return <AuthPage onLogin={handleLogin} addToast={addToast} />

      case 'shop':
        return (
          <ShopPage
            token={token}
            onAddToCart={addToCart}
            addToast={addToast}
            setPage={setPage}
            setDetailProduct={setDetailProduct}
          />
        )

      case 'detail':
        return (
          <ProductDetailPage
            product={detailProduct}
            token={token}
            onAddToCart={addToCart}
            setPage={setPage}
            addToast={addToast}
          />
        )

      case 'cart':
        return (
          <CartPage
            cart={cart}
            setCart={setCart}
            token={token}
            addToast={addToast}
            setPage={setPage}
          />
        )

      case 'orders':
        return token
          ? <OrdersPage token={token} />
          : <AuthPage onLogin={handleLogin} addToast={addToast} />

      case 'admin':
        return isAdmin
          ? <AdminPage token={token} addToast={addToast} user={user} isAdminSup={isAdminSup} />
          : <ShopPage token={token} onAddToCart={addToCart} addToast={addToast} setPage={setPage} setDetailProduct={setDetailProduct} />

      default:
        return null
    }
  }

  return (
    <>
      {page !== 'auth' && (
        <Navbar
          user={user}
          page={page}
          setPage={setPage}
          cartCount={cartCount}
          notificationCount={notificationCount}
          onLogout={handleLogout}
          onNotificationClick={handleNotificationClick}
        />
      )}

      {showNotifications && token && (
        <NotificationPanel
          token={token}
          onClose={handleNotificationClose}
          unreadCount={notificationCount}
          onMarkRead={loadNotificationCount}
        />
      )}

      {renderPage()}

      <Toast toasts={toasts} />
    </>
  )
}

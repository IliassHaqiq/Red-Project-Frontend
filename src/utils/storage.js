/**
 * Utilitaire pour gérer la persistance dans localStorage
 */

const STORAGE_KEYS = {
  TOKEN: 'ecommerce_token',
  USER: 'ecommerce_user',
  CART: 'ecommerce_cart'
}

/**
 * Sauvegarde le token JWT
 */
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }
}

/**
 * Récupère le token JWT
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/**
 * Sauvegarde les informations utilisateur
 */
export const saveUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
}

/**
 * Récupère les informations utilisateur
 */
export const getUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (e) {
      console.error('Erreur lors du parsing des données utilisateur:', e)
      return null
    }
  }
  return null
}

/**
 * Sauvegarde le panier
 */
export const saveCart = (cart) => {
  if (cart && cart.length > 0) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CART)
  }
}

/**
 * Récupère le panier
 */
export const getCart = () => {
  const cartStr = localStorage.getItem(STORAGE_KEYS.CART)
  if (cartStr) {
    try {
      return JSON.parse(cartStr)
    } catch (e) {
      console.error('Erreur lors du parsing du panier:', e)
      return []
    }
  }
  return []
}

/**
 * Nettoie toutes les données stockées (déconnexion)
 */
export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.CART)
}

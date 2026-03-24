import { useState } from 'react'
import { login, register } from '../api'
import './AuthPage.css'

export default function AuthPage({ onLogin, addToast }) {
  const [tab, setTab]       = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [form, setForm]     = useState({ fullName: '', email: '', password: '', confirmPassword: '' })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const submit = async () => {
    setError('')
    
    // Validate password confirmation for registration
    if (tab === 'register' && form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    
    setLoading(true)
    try {
      const data =
        tab === 'login'
          ? await login({ email: form.email, password: form.password })
          : await register({ fullName: form.fullName, email: form.email, password: form.password })
      onLogin(data)
      addToast('Bienvenue !')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    return false
  }

  return (
    <div className="auth-container">
      <div className="auth-box fade-in">

        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="auth-logo-text">
              Cart<span className="auth-logo-highlight">ify</span>
            </span>
          </div>
          <div className="auth-tagline">Espace client</div>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
            Connexion
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
            Créer un compte
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {tab === 'register' && (
          <div className="field">
            <label className="label" htmlFor="fullName">Nom complet</label>
            <input id="fullName" name="fullName" className="input" value={form.fullName} onChange={set('fullName')} placeholder="Full Name" autoComplete="name" />
          </div>
        )}

        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" className="input" type="email" value={form.email} onChange={set('email')} placeholder="vous@exemple.com" autoComplete="email" />
        </div>

        <div className="field">
          <label className="label" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            className="input"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
        </div>

        {tab === 'register' && (
          <div className="field">
            <label className="label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              onPaste={handlePaste}
              placeholder="••••••••"
              autoComplete="new-password"
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
        )}

        <button
          className="btn btn-primary auth-submit"
          onClick={submit}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : tab === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>

      </div>
    </div>
  )
}
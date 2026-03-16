import { useState } from 'react'
import { login, register } from '../api'
import './AuthPage.css'

export default function AuthPage({ onLogin, addToast }) {
  const [tab, setTab]       = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [form, setForm]     = useState({ fullName: '', email: '', password: '' })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const submit = async () => {
    setError('')
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

  return (
    <div className="auth-container">
      <div className="auth-box fade-in">

        <div className="auth-brand">
          <div className="auth-logo">Rouge<span>.</span></div>
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
            <input id="fullName" name="fullName" className="input" value={form.fullName} onChange={set('fullName')} placeholder="Jean Dupont" autoComplete="name" />
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
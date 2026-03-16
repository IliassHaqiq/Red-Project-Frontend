import { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole, deleteUser, createAdminUser, updateAdminUser } from '../../api'

const ROLE_OPTIONS = [
  { value: 'ROLE_ADMIN',   label: 'Admin' },
  { value: 'ROLE_ADMINSUP', label: 'Admin Sup' },
]

export default function AdminUsers({ token, addToast }) {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [modal, setModal] = useState(null) // 'create' | user
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'ROLE_ADMIN' })

  const load = () => {
    setLoading(true)
    getAllUsers(token)
      .then(setUsers)
      .finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const changeRole = async (userId, role) => {
    setSavingId(userId)
    try {
      await updateUserRole(userId, role, token)
      addToast('Rôle mis à jour')
      load()
    } catch (e) {
      addToast(e.message || 'Erreur lors de la mise à jour du rôle', 'error')
    } finally {
      setSavingId(null)
    }
  }

  const removeUser = async (userId) => {
    if (!confirm('Supprimer cet administrateur ?')) return
    setSavingId(userId)
    try {
      await deleteUser(userId, token)
      addToast('Utilisateur supprimé')
      load()
    } catch (e) {
      addToast(e.message || 'Erreur lors de la suppression', 'error')
    } finally {
      setSavingId(null)
    }
  }

  const openCreate = () => {
    setForm({ fullName: '', email: '', password: '', role: 'ROLE_ADMIN' })
    setModal('create')
  }

  const openEdit = (u) => {
    const role = Array.isArray(u.roles) ? (u.roles[0] || 'ROLE_ADMIN') : 'ROLE_ADMIN'
    setForm({ fullName: u.fullName || '', email: u.email || '', password: '', role })
    setModal(u)
  }

  const save = async () => {
    const isCreate = modal === 'create'
    setSavingId(isCreate ? 'create' : modal?.id)
    try {
      if (isCreate) {
        await createAdminUser(form, token)
        addToast('Utilisateur créé')
      } else {
        const body = {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          ...(form.password?.trim() ? { password: form.password } : {}),
        }
        await updateAdminUser(modal.id, body, token)
        addToast('Utilisateur mis à jour')
      }
      setModal(null)
      load()
    } catch (e) {
      addToast(e.message || 'Erreur', 'error')
    } finally {
      setSavingId(null)
    }
  }

  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Utilisateurs</h1>
          <p className="admin-page-subtitle">
            Gérer les comptes Admin et Admin Sup (pas les clients)
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Ajouter
        </button>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <span className="spinner spinner-lg" />
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const currentRole = Array.isArray(u.roles)
                  ? (u.roles[0] || 'ROLE_ADMIN')
                  : 'ROLE_ADMIN'
                return (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className="input"
                        value={currentRole}
                        onChange={e => changeRole(u.id, e.target.value)}
                        disabled={savingId === u.id}
                      >
                        {ROLE_OPTIONS.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="table-action-btn"
                        onClick={() => openEdit(u)}
                        disabled={savingId === u.id}
                      >
                        Modifier
                      </button>
                      <button
                        className="table-action-btn danger"
                        onClick={() => removeUser(u.id)}
                        disabled={savingId === u.id}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{modal === 'create' ? 'Ajouter un admin' : 'Modifier admin'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>

            <div className="field">
              <label className="label">Nom complet</label>
              <input className="input" value={form.fullName} onChange={setF('fullName')} />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" value={form.email} onChange={setF('email')} />
            </div>
            <div className="field">
              <label className="label">Rôle</label>
              <select className="input" value={form.role} onChange={setF('role')}>
                {ROLE_OPTIONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">{modal === 'create' ? 'Mot de passe' : 'Nouveau mot de passe (optionnel)'}</label>
              <input className="input" type="password" value={form.password} onChange={setF('password')} />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save} disabled={savingId === (modal === 'create' ? 'create' : modal.id)}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


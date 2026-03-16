export default function Toast({ toasts }) {
  return (
    <div className="toast">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}

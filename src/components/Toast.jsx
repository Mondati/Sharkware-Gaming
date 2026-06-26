import { CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Toast = () => {
  const { toast } = useAuth()
  if (!toast) return null
  return (
    <div
      className="flex items-center"
      style={{
        position: 'fixed',
        bottom: '104px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'calc(100vw - 32px)',
        backgroundColor: 'var(--surface)',
        border: '1px solid rgba(var(--success-rgb),0.4)',
        borderRadius: '12px',
        padding: '12px 20px',
        gap: '10px',
        zIndex: 30,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0 }} />
      <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600', lineHeight: 1.35 }}>
        {toast}
      </span>
    </div>
  )
}

export default Toast

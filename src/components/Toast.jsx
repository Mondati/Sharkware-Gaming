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
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'calc(100vw - 32px)',
        backgroundColor: '#1E2232',
        border: '1px solid rgba(34,197,94,0.4)',
        borderRadius: '12px',
        padding: '12px 20px',
        gap: '10px',
        zIndex: 30,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <CheckCircle size={16} color="#22C55E" />
      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
        {toast}
      </span>
    </div>
  )
}

export default Toast

import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmModal = ({
  open,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  loadingLabel = 'Procesando...',
  cancelLabel = 'Cancelar',
  danger = true,
  loading = false,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape' && !loading) onClose?.() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, loading, onClose])

  if (!open) return null

  const confirmBg = danger ? '#EF4444' : '#24A8F5'
  const iconBg = danger ? '#2D1010' : '#0D2035'
  const iconColor = danger ? '#EF4444' : '#24A8F5'

  return (
    <div
      onClick={() => { if (!loading) onClose?.() }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7,6,16,0.85)',
        backdropFilter: 'blur(4px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        style={{
          backgroundColor: '#0E1424',
          border: '1px solid #1B2333',
          borderRadius: '14px',
          padding: '24px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-start" style={{ gap: '14px' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: iconBg,
              borderRadius: '10px',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} color={iconColor} />
          </div>
          <div className="flex flex-col" style={{ flex: 1, gap: '6px', minWidth: 0 }}>
            <span
              id="confirm-modal-title"
              style={{
                color: '#F5F7FA',
                fontFamily: 'Rajdhani, Poppins, sans-serif',
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: 1.2,
              }}
            >
              {title}
            </span>
            <span
              style={{
                color: '#AAB3C5',
                fontFamily: 'Poppins',
                fontSize: '13px',
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}
            >
              {message}
            </span>
          </div>
          <button
            onClick={() => { if (!loading) onClose?.() }}
            disabled={loading}
            aria-label="Cerrar"
            className="flex items-center justify-center border-none cursor-pointer"
            style={{
              width: '28px',
              height: '28px',
              background: 'transparent',
              padding: 0,
              flexShrink: 0,
              opacity: loading ? 0.4 : 1,
            }}
          >
            <X size={18} color="#AAB3C5" />
          </button>
        </div>

        <div
          className="flex items-center"
          style={{ marginTop: '24px', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}
        >
          <button
            onClick={() => { if (!loading) onClose?.() }}
            disabled={loading}
            className="cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid #1B2333',
              color: '#F5F7FA',
              fontFamily: 'Poppins',
              fontSize: '13px',
              fontWeight: '600',
              padding: '10px 18px',
              borderRadius: '8px',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer border-none"
            style={{
              background: confirmBg,
              color: '#FFFFFF',
              fontFamily: 'Poppins',
              fontSize: '13px',
              fontWeight: '700',
              padding: '10px 18px',
              borderRadius: '8px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer',
              minWidth: '110px',
            }}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

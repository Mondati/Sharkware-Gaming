import { ShieldCheck, RefreshCw } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, color: 'var(--accent)', label: 'Compra segura' },
  { icon: RefreshCw,   color: 'var(--warning)', label: '30 días devolución' },
]

const TrustBadges = ({ size = 18, layout = 'row' }) => {
  if (layout === 'column') {
    return (
      <div className="flex justify-around" style={{ width: '100%' }}>
        {badges.map(({ icon: Icon, color, label }) => (
          <div key={label} className="flex flex-col items-center" style={{ gap: '4px' }}>
            <Icon size={size} color={color} />
            <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px' }}>{label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center" style={{ gap: '16px' }}>
      {badges.map(({ icon: Icon, color, label }) => (
        <div key={label} className="flex items-center" style={{ gap: '4px' }}>
          <Icon size={size} color={color} />
          <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default TrustBadges

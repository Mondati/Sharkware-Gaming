import { ShieldCheck, Truck, RefreshCw } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, color: '#24A8F5', label: 'Compra segura' },
  { icon: Truck,       color: '#22C55E', label: 'Envío gratis'  },
  { icon: RefreshCw,   color: '#F59E0B', label: '30 días devolución' },
]

const TrustBadges = ({ size = 18, layout = 'row' }) => {
  if (layout === 'column') {
    return (
      <div className="flex justify-around" style={{ width: '100%' }}>
        {badges.map(({ icon: Icon, color, label }) => (
          <div key={label} className="flex flex-col items-center" style={{ gap: '4px' }}>
            <Icon size={size} color={color} />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>{label}</span>
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
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default TrustBadges

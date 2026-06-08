import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, LineChart, Apple, Sparkles } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/entreno', label: 'Entreno', icon: Dumbbell, end: false },
  { to: '/progreso', label: 'Progreso', icon: LineChart, end: false },
  { to: '/nutricion', label: 'Nutrición', icon: Apple, end: false },
  { to: '/tips', label: 'Tips', icon: Sparkles, end: false },
]

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 bg-white/90 backdrop-blur border-t border-pink-100 px-2 py-1.5 flex items-center justify-around"
         style={{ boxShadow: '0 -4px 20px rgba(255,93,162,0.08)' }}>
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-[var(--rosa-fuerte)]' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-[var(--rosa-suave)]' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

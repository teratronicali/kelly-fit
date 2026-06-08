import { useMemo, useState } from 'react'
import { Heart } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { TIPS, FRASES_MOTIVACION } from '../data/contenido'

const CATEGORIAS = ['Todas', ...Array.from(new Set(TIPS.map(t => t.categoria)))]

export default function TipsPage() {
  const [filtro, setFiltro] = useState('Todas')

  const frase = useMemo(() => {
    const dia = new Date().getDate()
    return FRASES_MOTIVACION[(dia + 3) % FRASES_MOTIVACION.length]
  }, [])

  const tips = filtro === 'Todas' ? TIPS : TIPS.filter(t => t.categoria === filtro)

  return (
    <div className="animate-float-up pb-4">
      <PageHeader titulo="Tu coach 🌷" subtitulo="Tips de nutrición, entreno y mentalidad para ti" />

      <div className="px-5 -mt-1 space-y-4 pb-4">
        <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, var(--rosa-fuerte), var(--rosa))' }}>
          <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
            <Heart size={14} />
            <span className="text-[11px] font-medium uppercase tracking-wide">Recuerda hoy</span>
          </div>
          <p className="text-sm leading-relaxed">{frase}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIAS.map(c => (
            <button
              key={c}
              onClick={() => setFiltro(c)}
              className={`text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                filtro === c ? 'text-white' : 'bg-pink-50 text-[var(--rosa-fuerte)]'
              }`}
              style={filtro === c ? { background: 'var(--rosa-fuerte)' } : undefined}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {tips.map(tip => (
            <div key={tip.titulo} className="rounded-2xl bg-white border border-pink-100 p-4">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--rosa-suave)] text-[var(--rosa-fuerte)]">{tip.categoria}</span>
              <p className="text-sm font-medium text-gray-800 mt-2">{tip.titulo}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tip.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

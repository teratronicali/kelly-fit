import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { CheckCircle2, ChevronRight, Dumbbell } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useEntrenos } from '../lib/useEntrenos'
import { PROGRAMA } from '../data/programa'

export default function Entreno() {
  const navigate = useNavigate()
  const { diasOrden, diaDeHoy, semanaActual, sesiones } = useEntrenos()
  const hoy = format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="animate-float-up">
      <PageHeader titulo="Tu plan de entreno" subtitulo={`Programa de 12 semanas · Semana ${semanaActual}`} />

      <div className="px-5 -mt-1 space-y-2.5 pb-4">
        {diasOrden.map(dia => {
          const programaDia = PROGRAMA.find(p => p.dia === dia)
          const esHoy = dia === diaDeHoy
          const sesionHoy = esHoy ? sesiones.find(s => s.fecha === hoy && s.dia === dia) : undefined
          const completadoHoy = sesionHoy?.completado ?? false
          const vecesCompletado = sesiones.filter(s => s.dia === dia && s.completado).length

          return (
            <button
              key={dia}
              onClick={() => navigate(`/entreno/${encodeURIComponent(dia)}`)}
              className={`w-full text-left rounded-2xl border p-4 flex items-center justify-between active:scale-[0.98] transition-transform ${
                esHoy ? 'border-[var(--rosa)] bg-[var(--rosa-suave)]' : 'border-pink-100 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${completadoHoy ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-[var(--rosa-fuerte)]'}`}>
                  {completadoHoy ? <CheckCircle2 size={20} /> : <Dumbbell size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-800">{dia}</p>
                    {esHoy && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--rosa)] text-white">HOY</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{programaDia?.enfoque}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{programaDia?.ejercicios.length} ejercicios · completado {vecesCompletado}x</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 shrink-0" />
            </button>
          )
        })}

        <div className="rounded-2xl bg-pink-50 p-4 mt-2">
          <p className="text-xs text-gray-500 leading-relaxed">
            🩷 Sábado y domingo son tus días de descanso activo: estiramientos, caminatas suaves o simplemente recuperarte. ¡Te lo ganaste!
          </p>
        </div>
      </div>
    </div>
  )
}

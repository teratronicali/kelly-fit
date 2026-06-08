import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Flame, Dumbbell, Apple, Sparkles, ChevronRight, UserRound } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useEntrenos } from '../lib/useEntrenos'
import { useNutricion } from '../lib/useNutricion'
import { usePerfil } from '../lib/usePerfil'
import { FRASES_MOTIVACION } from '../data/contenido'

export default function Inicio() {
  const navigate = useNavigate()
  const { diaDeHoy, semanaActual, racha, totalCompletadas, sesionDe } = useEntrenos()
  const { totalesHoy, meta } = useNutricion()
  const { perfil } = usePerfil()

  const hoyTexto = format(new Date(), "EEEE d 'de' MMMM", { locale: es })
  const fechaISO = format(new Date(), 'yyyy-MM-dd')

  const frase = useMemo(() => {
    const dia = new Date().getDate()
    return FRASES_MOTIVACION[dia % FRASES_MOTIVACION.length]
  }, [])

  const sesionHoy = diaDeHoy ? sesionDe(fechaISO, diaDeHoy) : undefined
  const entrenoCompletadoHoy = sesionHoy?.completado ?? false

  const pctKcal = Math.min(100, Math.round((totalesHoy.kcal / meta.kcal) * 100))

  return (
    <div className="animate-float-up">
      <PageHeader
        titulo={`¡Hola, ${perfil.nombre}! 🌸`}
        subtitulo={`${hoyTexto.charAt(0).toUpperCase()}${hoyTexto.slice(1)} · Semana ${semanaActual} de 12`}
        accion={
          <button onClick={() => navigate('/perfil')} className="p-2.5 rounded-full bg-white text-[var(--rosa-fuerte)] border border-pink-100 active:scale-95 transition-transform">
            <UserRound size={18} />
          </button>
        }
      />

      <div className="px-5 -mt-1 space-y-4 pb-4">
        {/* Frase motivacional */}
        <div className="rounded-2xl p-4 text-white shadow-md" style={{ background: 'linear-gradient(135deg, var(--rosa), var(--rosa-fuerte))' }}>
          <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
            <Sparkles size={14} />
            <span className="text-[11px] font-medium uppercase tracking-wide">Tu impulso de hoy</span>
          </div>
          <p className="text-sm leading-relaxed">{frase}</p>
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-white border border-pink-100 p-3 text-center">
            <Flame size={18} className="mx-auto mb-1 text-[var(--rosa-fuerte)]" />
            <p className="text-lg font-semibold text-[var(--rosa-fuerte)]">{racha}</p>
            <p className="text-[10px] text-gray-400">Racha (días)</p>
          </div>
          <div className="rounded-2xl bg-white border border-pink-100 p-3 text-center">
            <Dumbbell size={18} className="mx-auto mb-1 text-[var(--rosa-fuerte)]" />
            <p className="text-lg font-semibold text-[var(--rosa-fuerte)]">{totalCompletadas}</p>
            <p className="text-[10px] text-gray-400">Entrenos totales</p>
          </div>
          <div className="rounded-2xl bg-white border border-pink-100 p-3 text-center">
            <Apple size={18} className="mx-auto mb-1 text-[var(--rosa-fuerte)]" />
            <p className="text-lg font-semibold text-[var(--rosa-fuerte)]">{pctKcal}%</p>
            <p className="text-[10px] text-gray-400">Meta calórica hoy</p>
          </div>
        </div>

        {/* Entreno de hoy */}
        <button
          onClick={() => diaDeHoy && navigate(`/entreno/${encodeURIComponent(diaDeHoy)}`)}
          disabled={!diaDeHoy}
          className="w-full text-left rounded-2xl bg-white border border-pink-100 p-4 flex items-center justify-between active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${entrenoCompletadoHoy ? 'bg-emerald-50 text-emerald-600' : 'bg-[var(--rosa-suave)] text-[var(--rosa-fuerte)]'}`}>
              <Dumbbell size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {diaDeHoy ? (entrenoCompletadoHoy ? '¡Entreno completado! 🎉' : `Entreno de hoy: ${diaDeHoy}`) : 'Hoy es día de descanso 🌷'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {diaDeHoy ? (entrenoCompletadoHoy ? 'Toca para revisar tu registro' : 'Toca para empezar a registrar') : 'Aprovecha para estirar e hidratarte'}
              </p>
            </div>
          </div>
          {diaDeHoy && <ChevronRight size={18} className="text-gray-300" />}
        </button>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => navigate('/nutricion')} className="rounded-2xl bg-[var(--rosa-suave)] p-4 text-left active:scale-[0.98] transition-transform">
            <Apple size={20} className="text-[var(--rosa-fuerte)] mb-2" />
            <p className="text-sm font-medium text-gray-800">Registrar comida</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Lleva tus macros del día</p>
          </button>
          <button onClick={() => navigate('/progreso')} className="rounded-2xl bg-pink-50 p-4 text-left active:scale-[0.98] transition-transform">
            <Sparkles size={20} className="text-[var(--rosa-fuerte)] mb-2" />
            <p className="text-sm font-medium text-gray-800">Ver mi progreso</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Medidas y composición</p>
          </button>
        </div>
      </div>
    </div>
  )
}

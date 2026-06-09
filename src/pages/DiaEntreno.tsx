import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Plus, Trash2, CheckCircle2, History, TrendingUp } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useEntrenos } from '../lib/useEntrenos'
import { PROGRAMA } from '../data/programa'
import { parseObjetivoSets } from '../data/programa'
import type { DiaSemana, RegistroEjercicio, SesionEntreno, SetRegistrado } from '../types'

export default function DiaEntreno() {
  const { dia } = useParams<{ dia: string }>()
  const navigate = useNavigate()
  const { semanaActual, sesiones, obtenerOCrearSesion, guardarSesion } = useEntrenos()

  const diaTyped = dia as DiaSemana
  const programaDia = PROGRAMA.find(p => p.dia === diaTyped)
  const hoy = format(new Date(), 'yyyy-MM-dd')

  const [sesion, setSesion] = useState<SesionEntreno | null>(null)
  const cargadoRef = useRef(false)

  useEffect(() => {
    if (!diaTyped) return
    const existente = sesiones.find(s => s.fecha === hoy && s.dia === diaTyped)
    cargadoRef.current = false
    setSesion(existente ?? obtenerOCrearSesion(hoy, diaTyped, semanaActual))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaTyped, hoy])

  // Auto-guardado: cada vez que el usuario modifica la sesión se guarda
  // automáticamente sin necesidad de pulsar "Guardar progreso"
  useEffect(() => {
    if (!cargadoRef.current) { cargadoRef.current = true; return }
    if (!sesion) return
    const t = setTimeout(() => guardarSesion(sesion), 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesion])

  const historial = sesiones
    .filter(s => s.dia === diaTyped && s.fecha !== hoy && s.completado)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    .slice(0, 5)

  const sesionesAnteriores = sesiones
    .filter(s => s.fecha !== hoy)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))

  function ultimoRegistro(ejercicioId: string): { fecha: string; sets: SetRegistrado[] } | null {
    for (const s of sesionesAnteriores) {
      const registro = s.ejercicios.find(r => r.ejercicioId === ejercicioId)
      const setsConDatos = registro?.sets.filter(set => set.peso !== null || set.reps !== null) ?? []
      if (setsConDatos.length > 0) return { fecha: s.fecha, sets: setsConDatos }
    }
    return null
  }

  if (!programaDia || !sesion) return null

  const actual: SesionEntreno = sesion

  function actualizarRegistro(ejercicioId: string, registro: RegistroEjercicio) {
    setSesion(prev => {
      if (!prev) return prev
      const ejercicios = prev.ejercicios.map(r => (r.ejercicioId === ejercicioId ? registro : r))
      return { ...prev, ejercicios }
    })
  }

  function agregarSet(ejercicioId: string) {
    const registro = actual.ejercicios.find(r => r.ejercicioId === ejercicioId)
    if (!registro) return
    actualizarRegistro(ejercicioId, { ...registro, sets: [...registro.sets, { peso: null, reps: null }] })
  }

  function quitarSet(ejercicioId: string, idx: number) {
    const registro = actual.ejercicios.find(r => r.ejercicioId === ejercicioId)
    if (!registro) return
    actualizarRegistro(ejercicioId, { ...registro, sets: registro.sets.filter((_, i) => i !== idx) })
  }

  function actualizarSet(ejercicioId: string, idx: number, campo: keyof SetRegistrado, valor: string) {
    const registro = actual.ejercicios.find(r => r.ejercicioId === ejercicioId)
    if (!registro) return
    const num = valor === '' ? null : Number(valor)
    const sets = registro.sets.map((s, i) => (i === idx ? { ...s, [campo]: num } : s))
    actualizarRegistro(ejercicioId, { ...registro, sets })
  }

  function guardarProgreso(mostrarToast = true) {
    guardarSesion(actual)
    if (mostrarToast) toast.success('Progreso guardado')
  }

  function completarEntreno() {
    const completo: SesionEntreno = { ...actual, completado: true }
    setSesion(completo)
    guardarSesion(completo)
    toast.success('¡Entreno completado! Sigue así 🌸')
  }

  return (
    <div className="animate-float-up pb-4">
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13 } }} />
      <div className="px-5 pt-6 pb-4 bg-gradient-to-br from-[var(--rosa-suave)] to-white rounded-b-3xl">
        <button onClick={() => navigate('/entreno')} className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <ArrowLeft size={14} /> Volver al plan
        </button>
        <h1 className="text-lg font-semibold text-[var(--rosa-fuerte)]">{diaTyped}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{programaDia.enfoque} · Semana {semanaActual} · {format(parseISO(sesion.fecha), "d 'de' MMMM", { locale: es })}</p>
        {sesion.completado && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 size={14} /> Entreno completado hoy
          </div>
        )}
      </div>

      <div className="px-5 mt-4 space-y-3">
        {sesion.ejercicios.map(registro => {
          const ej = programaDia.ejercicios.find(e => e.id === registro.ejercicioId)
          if (!ej) return null
          const setsObjetivo = parseObjetivoSets(ej.objetivo)
          const ultimo = ultimoRegistro(ej.id)

          return (
            <div key={ej.id} className="rounded-2xl bg-white border border-pink-100 p-4">
              <div className="flex items-start justify-between mb-2.5">
                <div>
                  <p className="text-sm font-medium text-gray-800">{ej.nombre}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{ej.grupo} · objetivo {ej.objetivo}</p>
                </div>
              </div>

              {ultimo && (
                <div className="flex items-start gap-1.5 mb-3 px-2.5 py-2 rounded-lg bg-[var(--rosa-suave)]/60 bg-pink-50">
                  <TrendingUp size={13} className="text-[var(--rosa-fuerte)] mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    <span className="font-medium text-[var(--rosa-fuerte)]">Última vez ({format(parseISO(ultimo.fecha), "d MMM", { locale: es })}):</span>{' '}
                    {ultimo.sets.map((s, i) => (
                      <span key={i}>
                        {s.peso !== null ? `${s.peso}kg` : '—'}×{s.reps !== null ? s.reps : '—'}
                        {i < ultimo.sets.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                {registro.sets.map((set, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 w-10 shrink-0">Set {idx + 1}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="kg"
                      value={set.peso ?? ''}
                      onChange={e => actualizarSet(ej.id, idx, 'peso', e.target.value)}
                      className="flex-1 min-w-0 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                    <span className="text-[11px] text-gray-300">×</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="reps"
                      value={set.reps ?? ''}
                      onChange={e => actualizarSet(ej.id, idx, 'reps', e.target.value)}
                      className="flex-1 min-w-0 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                    <button onClick={() => quitarSet(ej.id, idx)} className="text-gray-300 hover:text-[var(--rosa-fuerte)] shrink-0 p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => agregarSet(ej.id)}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[var(--rosa-fuerte)] bg-[var(--rosa-suave)] rounded-lg py-2 active:scale-[0.98] transition-transform"
              >
                <Plus size={14} /> Agregar set {registro.sets.length < setsObjetivo ? `(objetivo: ${setsObjetivo})` : ''}
              </button>
            </div>
          )
        })}

        <div className="grid grid-cols-2 gap-2.5 sticky bottom-16 pt-1">
          <button onClick={() => guardarProgreso()} className="rounded-xl bg-white border border-pink-200 text-[var(--rosa-fuerte)] text-sm font-medium py-3 shadow-sm active:scale-[0.98] transition-transform">
            Guardar progreso
          </button>
          <button
            onClick={completarEntreno}
            disabled={sesion.completado}
            className="rounded-xl text-white text-sm font-medium py-3 shadow-md active:scale-[0.98] transition-transform disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, var(--rosa), var(--rosa-fuerte))' }}
          >
            {sesion.completado ? '¡Completado! 🎉' : 'Marcar como completo'}
          </button>
        </div>

        {historial.length > 0 && (
          <div className="rounded-2xl bg-pink-50 p-4 mt-2">
            <div className="flex items-center gap-1.5 mb-2">
              <History size={14} className="text-[var(--rosa-fuerte)]" />
              <p className="text-xs font-medium text-gray-700">Historial reciente de {diaTyped}</p>
            </div>
            <div className="space-y-1.5">
              {historial.map(s => (
                <div key={s.id} className="text-[11px] text-gray-500 flex items-center justify-between">
                  <span>{format(parseISO(s.fecha), "EEEE d 'de' MMM", { locale: es })} · Semana {s.semana}</span>
                  <CheckCircle2 size={13} className="text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

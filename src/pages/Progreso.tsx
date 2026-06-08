import { useState } from 'react'
import { format } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, X, Trash2, Scale } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import { useMedidas } from '../lib/useMedidas'
import { TOTAL_SEMANAS } from '../data/programa'
import type { MedidaSemanal } from '../types'

const ROSA = '#ff5da2'
const ROSA_FUERTE = '#e0367a'

function CustomTooltip({ active, payload, label, unidad }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-pink-100 rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="text-gray-400">Semana {label}</p>
      <p className="font-medium text-[var(--rosa-fuerte)]">{payload[0].value} {unidad}</p>
    </div>
  )
}

const CAMPOS: { key: keyof MedidaSemanal; label: string; unidad: string }[] = [
  { key: 'peso', label: 'Peso corporal', unidad: 'kg' },
  { key: 'grasaPct', label: 'Grasa corporal', unidad: '%' },
  { key: 'musculoKg', label: 'Músculo', unidad: 'kg' },
  { key: 'bmi', label: 'BMI', unidad: '' },
]

export default function Progreso() {
  const { medidas, agregarMedida, eliminarMedida } = useMedidas()
  const [modal, setModal] = useState(false)

  const datosGrafica = medidas.filter(m => m.peso !== null)

  return (
    <div className="animate-float-up pb-4">
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13 } }} />
      <PageHeader
        titulo="Tu progreso"
        subtitulo="Composición corporal semana a semana"
        accion={
          <button onClick={() => setModal(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-white font-medium" style={{ background: ROSA_FUERTE }}>
            <Plus size={14} /> Medida
          </button>
        }
      />

      <div className="px-5 -mt-1 space-y-4 pb-4">
        {datosGrafica.length === 0 ? (
          <div className="rounded-2xl bg-white border border-pink-100 p-6 text-center">
            <Scale size={28} className="mx-auto text-[var(--rosa)] mb-2" />
            <p className="text-sm text-gray-600">Aún no tienes medidas registradas.</p>
            <p className="text-xs text-gray-400 mt-1">Agrega tu primera medición semanal para empezar a ver tu evolución 🌸</p>
          </div>
        ) : (
          CAMPOS.map(campo => {
            const data = medidas.filter(m => m[campo.key] !== null)
            if (data.length === 0) return null
            return (
              <div key={campo.key} className="rounded-2xl bg-white border border-pink-100 p-4">
                <p className="text-xs font-medium text-gray-600 mb-2">{campo.label} {campo.unidad && `(${campo.unidad})`}</p>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" vertical={false} />
                    <XAxis dataKey="semana" tick={{ fontSize: 10, fill: '#b3aab8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#b3aab8' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip unidad={campo.unidad} />} />
                    <Line type="monotone" dataKey={campo.key as string} stroke={ROSA} strokeWidth={2.5} dot={{ r: 3, fill: ROSA_FUERTE }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )
          })
        )}

        {/* Tabla histórica */}
        <div className="rounded-2xl bg-white border border-pink-100 overflow-hidden">
          <p className="text-xs font-medium text-gray-600 px-4 pt-3 pb-1">Historial de medidas</p>
          <div className="divide-y divide-pink-50">
            {medidas.length === 0 && <p className="text-xs text-gray-400 px-4 py-3">Sin registros aún.</p>}
            {[...medidas].reverse().map(m => (
              <div key={m.id} className="px-4 py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-700">Semana {m.semana} · {format(new Date(m.fecha), 'd MMM')}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {m.peso !== null && `Peso ${m.peso}kg`}{m.grasaPct !== null && ` · Grasa ${m.grasaPct}%`}{m.musculoKg !== null && ` · Músculo ${m.musculoKg}kg`}
                  </p>
                </div>
                <button onClick={() => { eliminarMedida(m.id); toast('Registro eliminado', { icon: '🗑️' }) }} className="text-gray-300 hover:text-[var(--rosa-fuerte)] p-1">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal && <ModalMedida onClose={() => setModal(false)} onGuardar={(m) => { agregarMedida(m); toast.success('Medida guardada'); setModal(false) }} siguienteSemana={Math.min((medidas.at(-1)?.semana ?? 0) + 1, TOTAL_SEMANAS)} />}
    </div>
  )
}

function ModalMedida({ onClose, onGuardar, siguienteSemana }: { onClose: () => void; onGuardar: (m: Omit<MedidaSemanal, 'id'>) => void; siguienteSemana: number }) {
  const [form, setForm] = useState({
    semana: siguienteSemana,
    fecha: format(new Date(), 'yyyy-MM-dd'),
    peso: '',
    bmi: '',
    grasaPct: '',
    pesoGrasoKg: '',
    masaMuscEsqPct: '',
    masaMuscEsqKg: '',
    musculoPct: '',
    musculoKg: '',
  })

  const num = (v: string) => (v === '' ? null : Number(v))

  function guardar() {
    onGuardar({
      fecha: form.fecha,
      semana: form.semana,
      peso: num(form.peso),
      bmi: num(form.bmi),
      grasaPct: num(form.grasaPct),
      pesoGrasoKg: num(form.pesoGrasoKg),
      masaMuscEsqPct: num(form.masaMuscEsqPct),
      masaMuscEsqKg: num(form.masaMuscEsqKg),
      musculoPct: num(form.musculoPct),
      musculoKg: num(form.musculoKg),
    })
  }

  const campo = (label: string, key: keyof typeof form, unidad?: string) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label} {unidad && <span className="text-gray-400">({unidad})</span>}</label>
      <input
        type="number"
        inputMode="decimal"
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-50 sticky top-0 bg-white">
          <h2 className="font-medium text-gray-900 text-sm">Nueva medición · Semana {form.semana}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Semana</label>
              <input type="number" min={1} max={TOTAL_SEMANAS} value={form.semana} onChange={e => setForm(f => ({ ...f, semana: Number(e.target.value) }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
              <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {campo('Peso', 'peso', 'kg')}
            {campo('BMI', 'bmi')}
            {campo('Grasa corporal', 'grasaPct', '%')}
            {campo('Peso graso', 'pesoGrasoKg', 'kg')}
            {campo('Masa musc. esquel.', 'masaMuscEsqPct', '%')}
            {campo('Masa musc. esquel.', 'masaMuscEsqKg', 'kg')}
            {campo('Músculo', 'musculoPct', '%')}
            {campo('Músculo', 'musculoKg', 'kg')}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-pink-50">
          <button onClick={onClose} className="text-xs font-medium text-gray-500 px-4 py-2.5 rounded-xl border border-gray-200">Cancelar</button>
          <button onClick={guardar} className="text-xs font-medium text-white px-4 py-2.5 rounded-xl" style={{ background: ROSA_FUERTE }}>Guardar medida</button>
        </div>
      </div>
    </div>
  )
}

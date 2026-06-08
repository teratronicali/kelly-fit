import { useState } from 'react'
import { Plus, X, Trash2, ScanBarcode, Coffee, Soup, Moon, Cookie } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import BarcodeScanner from '../components/BarcodeScanner'
import { useNutricion } from '../lib/useNutricion'
import { GRUPOS_ALIMENTO_RAPIDO } from '../data/contenido'
import type { Alimento, ComidaRegistrada } from '../types'

const ROSA_FUERTE = '#e0367a'

const TIPOS: { id: ComidaRegistrada['tipo']; label: string; icon: typeof Coffee }[] = [
  { id: 'desayuno', label: 'Desayuno', icon: Coffee },
  { id: 'almuerzo', label: 'Almuerzo', icon: Soup },
  { id: 'cena', label: 'Cena', icon: Moon },
  { id: 'snack', label: 'Snack', icon: Cookie },
]

function Barra({ valor, meta, color }: { valor: number; meta: number; color: string }) {
  const pct = Math.min(100, Math.round((valor / meta) * 100))
  return (
    <div className="h-1.5 rounded-full bg-pink-50 overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export default function Nutricion() {
  const { meta, comidasHoy, totalesHoy, agregarComida, eliminarComida } = useNutricion()
  const [modal, setModal] = useState<ComidaRegistrada['tipo'] | null>(null)
  const [scanner, setScanner] = useState(false)
  const [prellenado, setPrellenado] = useState<Alimento | null>(null)

  function handleEscaneado(alimento: Alimento) {
    setScanner(false)
    setPrellenado(alimento)
    setModal('snack')
    toast.success(`Encontramos: ${alimento.nombre}`)
  }

  return (
    <div className="animate-float-up pb-4">
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13 } }} />
      <PageHeader
        titulo="Nutrición"
        subtitulo="Registra tus comidas y controla tus macros"
        accion={
          <button onClick={() => setScanner(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-white font-medium" style={{ background: ROSA_FUERTE }}>
            <ScanBarcode size={14} /> Escanear
          </button>
        }
      />

      <div className="px-5 -mt-1 space-y-4 pb-4">
        {/* Resumen macros */}
        <div className="rounded-2xl bg-white border border-pink-100 p-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium text-gray-600">Calorías de hoy</p>
            <p className="text-sm"><span className="font-semibold text-[var(--rosa-fuerte)]">{Math.round(totalesHoy.kcal)}</span> <span className="text-gray-400">/ {meta.kcal} kcal</span></p>
          </div>
          <Barra valor={totalesHoy.kcal} meta={meta.kcal} color="var(--rosa-fuerte)" />

          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { label: 'Proteína', valor: totalesHoy.proteina, meta: meta.proteina, color: '#ff5da2' },
              { label: 'Grasa', valor: totalesHoy.grasa, meta: meta.grasa, color: '#f4a6c8' },
              { label: 'Carbos', valor: totalesHoy.carbohidrato, meta: meta.carbohidrato, color: '#e0367a' },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[11px] text-gray-500 mb-1">{m.label}</p>
                <p className="text-xs font-medium text-gray-700 mb-1">{Math.round(m.valor)}<span className="text-gray-400">/{m.meta}g</span></p>
                <Barra valor={m.valor} meta={m.meta} color={m.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Comidas por tipo */}
        {TIPOS.map(({ id, label, icon: Icon }) => {
          const items = comidasHoy.filter(c => c.tipo === id)
          const subtotal = items.reduce((a, c) => a + c.alimento.kcal, 0)
          return (
            <div key={id} className="rounded-2xl bg-white border border-pink-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-pink-50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[var(--rosa-suave)] text-[var(--rosa-fuerte)]"><Icon size={15} /></div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  {subtotal > 0 && <span className="text-[11px] text-gray-400">· {Math.round(subtotal)} kcal</span>}
                </div>
                <button onClick={() => { setPrellenado(null); setModal(id) }} className="text-[var(--rosa-fuerte)] p-1">
                  <Plus size={16} />
                </button>
              </div>
              {items.length === 0 ? (
                <p className="text-xs text-gray-400 px-4 py-3">Sin alimentos registrados</p>
              ) : (
                <div className="divide-y divide-pink-50">
                  {items.map(c => (
                    <div key={c.id} className="px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-700">{c.alimento.nombre}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{c.alimento.cantidad} · {c.alimento.kcal} kcal · P {c.alimento.proteina}g · G {c.alimento.grasa}g · C {c.alimento.carbohidrato}g</p>
                      </div>
                      <button onClick={() => { eliminarComida(c.id); toast('Eliminado', { icon: '🗑️' }) }} className="text-gray-300 hover:text-[var(--rosa-fuerte)] p-1 shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {scanner && <BarcodeScanner onClose={() => setScanner(false)} onEncontrado={handleEscaneado} />}
      {modal && (
        <ModalComida
          tipo={modal}
          prellenado={prellenado}
          onClose={() => { setModal(null); setPrellenado(null) }}
          onGuardar={(alimento) => {
            agregarComida({ tipo: modal, alimento })
            toast.success('Comida registrada')
            setModal(null)
            setPrellenado(null)
          }}
        />
      )}
    </div>
  )
}

function ModalComida({ tipo, prellenado, onClose, onGuardar }: {
  tipo: ComidaRegistrada['tipo']
  prellenado: Alimento | null
  onClose: () => void
  onGuardar: (a: Alimento) => void
}) {
  const [form, setForm] = useState({
    nombre: prellenado?.nombre ?? '',
    cantidad: prellenado?.cantidad ?? '',
    kcal: prellenado ? String(prellenado.kcal) : '',
    proteina: prellenado ? String(prellenado.proteina) : '',
    grasa: prellenado ? String(prellenado.grasa) : '',
    carbohidrato: prellenado ? String(prellenado.carbohidrato) : '',
  })

  function aplicarRapido(a: typeof GRUPOS_ALIMENTO_RAPIDO[number]) {
    setForm({ nombre: a.nombre, cantidad: '', kcal: String(a.kcal), proteina: String(a.proteina), grasa: String(a.grasa), carbohidrato: String(a.carbohidrato) })
  }

  function guardar() {
    if (!form.nombre.trim()) { toast.error('Escribe el nombre del alimento'); return }
    onGuardar({
      nombre: form.nombre.trim(),
      cantidad: form.cantidad.trim() || '1 porción',
      kcal: Number(form.kcal) || 0,
      proteina: Number(form.proteina) || 0,
      grasa: Number(form.grasa) || 0,
      carbohidrato: Number(form.carbohidrato) || 0,
    })
  }

  const TIPO_LABEL: Record<ComidaRegistrada['tipo'], string> = { desayuno: 'desayuno', almuerzo: 'almuerzo', cena: 'cena', snack: 'snack' }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-50 sticky top-0 bg-white z-10">
          <h2 className="font-medium text-gray-900 text-sm">Agregar a {TIPO_LABEL[tipo]}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          {!prellenado && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1.5">Atajos rápidos</p>
              <div className="flex flex-wrap gap-1.5">
                {GRUPOS_ALIMENTO_RAPIDO.map(a => (
                  <button key={a.nombre} onClick={() => aplicarRapido(a)} className="text-[11px] px-2.5 py-1.5 rounded-full bg-[var(--rosa-suave)] text-[var(--rosa-fuerte)] font-medium">
                    {a.nombre.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre del alimento</label>
            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Pechuga de pollo a la plancha" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad / porción</label>
            <input value={form.cantidad} onChange={e => setForm(f => ({ ...f, cantidad: e.target.value }))} placeholder="Ej: 150 g" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Calorías (kcal)</label>
              <input type="number" inputMode="numeric" value={form.kcal} onChange={e => setForm(f => ({ ...f, kcal: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Proteína (g)</label>
              <input type="number" inputMode="decimal" value={form.proteina} onChange={e => setForm(f => ({ ...f, proteina: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Grasa (g)</label>
              <input type="number" inputMode="decimal" value={form.grasa} onChange={e => setForm(f => ({ ...f, grasa: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Carbohidrato (g)</label>
              <input type="number" inputMode="decimal" value={form.carbohidrato} onChange={e => setForm(f => ({ ...f, carbohidrato: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-pink-50">
          <button onClick={onClose} className="text-xs font-medium text-gray-500 px-4 py-2.5 rounded-xl border border-gray-200">Cancelar</button>
          <button onClick={guardar} className="text-xs font-medium text-white px-4 py-2.5 rounded-xl" style={{ background: ROSA_FUERTE }}>Guardar</button>
        </div>
      </div>
    </div>
  )
}

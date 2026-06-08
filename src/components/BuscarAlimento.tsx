import { useState } from 'react'
import { Search, X, Loader2, PackageSearch } from 'lucide-react'
import type { Alimento } from '../types'

interface ResultadoOFF {
  code: string
  product_name?: string
  brands?: string
  serving_size?: string
  nutriments?: Record<string, number>
}

interface Props {
  onClose: () => void
  onSeleccionar: (alimento: Alimento) => void
  consultaInicial?: string
}

function aAlimento(p: ResultadoOFF): Alimento {
  const n = p.nutriments ?? {}
  return {
    nombre: [p.product_name, p.brands].filter(Boolean).join(' · ') || `Producto ${p.code}`,
    cantidad: p.serving_size || '100 g',
    kcal: Math.round(n['energy-kcal_serving'] ?? n['energy-kcal_100g'] ?? 0),
    proteina: Math.round((n['proteins_serving'] ?? n['proteins_100g'] ?? 0) * 10) / 10,
    grasa: Math.round((n['fat_serving'] ?? n['fat_100g'] ?? 0) * 10) / 10,
    carbohidrato: Math.round((n['carbohydrates_serving'] ?? n['carbohydrates_100g'] ?? 0) * 10) / 10,
  }
}

export default function BuscarAlimento({ onClose, onSeleccionar, consultaInicial }: Props) {
  const [consulta, setConsulta] = useState(consultaInicial ?? '')
  const [resultados, setResultados] = useState<ResultadoOFF[]>([])
  const [estado, setEstado] = useState<'inicial' | 'buscando' | 'listo' | 'error'>('inicial')

  async function buscar() {
    const texto = consulta.trim()
    if (!texto) return
    setEstado('buscando')
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(texto)}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,brands,nutriments,serving_size`
    for (let intento = 0; intento < 4; intento++) {
      try {
        const res = await fetch(url)
        const tipo = res.headers.get('content-type') ?? ''
        if (!res.ok || !tipo.includes('json')) throw new Error('respuesta no válida')
        const data = await res.json()
        const productos: ResultadoOFF[] = (data?.products ?? []).filter((p: ResultadoOFF) => p.product_name)
        setResultados(productos)
        setEstado(productos.length > 0 ? 'listo' : 'error')
        return
      } catch {
        if (intento < 3) await new Promise(r => setTimeout(r, 1000))
      }
    }
    setResultados([])
    setEstado('error')
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-50">
          <h2 className="font-medium text-gray-900 text-sm">Buscar alimento por nombre</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              value={consulta}
              onChange={e => setConsulta(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar()}
              placeholder="Ej: yogurt griego, arroz, avena…"
              className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <button
            onClick={buscar}
            disabled={!consulta.trim() || estado === 'buscando'}
            className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-white py-2.5 rounded-lg disabled:opacity-50"
            style={{ background: 'var(--rosa-fuerte)' }}
          >
            {estado === 'buscando' ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Buscar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {estado === 'inicial' && (
            <p className="text-xs text-gray-400 text-center py-8">Escribe el nombre de un alimento o producto y toca buscar 🔎</p>
          )}
          {estado === 'buscando' && (
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs py-8">
              <Loader2 size={15} className="animate-spin" /> Buscando en la base de datos abierta de alimentos…
            </div>
          )}
          {estado === 'error' && (
            <div className="text-center py-8">
              <PackageSearch size={26} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-500">No encontramos resultados para "{consulta}".</p>
              <p className="text-[11px] text-gray-400 mt-1">Intenta con otro nombre o agrégalo manualmente con el formulario.</p>
            </div>
          )}
          {estado === 'listo' && (
            <div className="space-y-1.5 pt-1">
              {resultados.map(p => {
                const alimento = aAlimento(p)
                return (
                  <button
                    key={p.code}
                    onClick={() => onSeleccionar(alimento)}
                    className="w-full text-left rounded-xl border border-pink-100 p-3 hover:bg-pink-50 active:scale-[0.99] transition-transform"
                  >
                    <p className="text-xs font-medium text-gray-800">{alimento.nombre}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {alimento.cantidad} · {alimento.kcal} kcal · P {alimento.proteina}g · G {alimento.grasa}g · C {alimento.carbohidrato}g
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

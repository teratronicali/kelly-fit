import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { X, Loader2, ScanBarcode, Search, Pencil } from 'lucide-react'
import type { Alimento } from '../types'

interface Props {
  onClose: () => void
  onEncontrado: (alimento: Alimento) => void
  onBuscarPorNombre: () => void
  onAgregarManual: () => void
}

interface ProductoOFF {
  product_name?: string
  nutriments?: Record<string, number>
  serving_size?: string
}

export default function BarcodeScanner({ onClose, onEncontrado, onBuscarPorNombre, onAgregarManual }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [estado, setEstado] = useState<'leyendo' | 'buscando' | 'error'>('leyendo')
  const [mensaje, setMensaje] = useState('Apunta la cámara al código de barras del producto')

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    let activo = true
    let controls: { stop: () => void } | undefined

    reader
      .decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        videoRef.current ?? undefined,
        async (result, _err, ctrl) => {
          controls = ctrl
          if (!result || !activo) return
          activo = false
          ctrl.stop()
          setEstado('buscando')
          await buscarProducto(result.getText())
        }
      )
      .catch(() => {
        setEstado('error')
        setMensaje('No se pudo acceder a la cámara. Revisa los permisos del navegador.')
      })

    return () => {
      activo = false
      controls?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function buscarProducto(codigo: string) {
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${codigo}.json`)
      const data = await res.json()
      const producto: ProductoOFF | undefined = data?.product
      if (data?.status !== 1 || !producto) {
        setEstado('error')
        setMensaje('Leímos el código, pero este producto no está en la base de datos internacional (pasa seguido con marcas locales). Búscalo por nombre o regístralo a mano con los datos del empaque.')
        return
      }
      const n = producto.nutriments ?? {}
      const alimento: Alimento = {
        nombre: producto.product_name || `Producto ${codigo}`,
        cantidad: producto.serving_size || '100 g',
        kcal: Math.round(n['energy-kcal_serving'] ?? n['energy-kcal_100g'] ?? 0),
        proteina: Math.round((n['proteins_serving'] ?? n['proteins_100g'] ?? 0) * 10) / 10,
        grasa: Math.round((n['fat_serving'] ?? n['fat_100g'] ?? 0) * 10) / 10,
        carbohidrato: Math.round((n['carbohydrates_serving'] ?? n['carbohydrates_100g'] ?? 0) * 10) / 10,
      }
      onEncontrado(alimento)
    } catch {
      setEstado('error')
      setMensaje('Hubo un problema buscando el producto. Intenta de nuevo o agrégalo manualmente.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2 text-white">
          <ScanBarcode size={18} />
          <p className="text-sm font-medium">Escanear código de barras</p>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 h-28 border-2 border-[var(--rosa)] rounded-2xl" style={{ boxShadow: '0 0 0 2000px rgba(0,0,0,0.45)' }} />
      </div>

      <div className="px-6 py-5 bg-black">
        {estado === 'buscando' ? (
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <Loader2 size={16} className="animate-spin" /> Buscando información nutricional…
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-white/70 text-xs leading-relaxed">{mensaje}</p>
            {estado === 'error' && (
              <div className="space-y-2">
                <button
                  onClick={onBuscarPorNombre}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-white py-2.5 rounded-lg"
                  style={{ background: 'var(--rosa-fuerte)' }}
                >
                  <Search size={14} /> Buscar el alimento por nombre
                </button>
                <button
                  onClick={onAgregarManual}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-white/90 py-2.5 rounded-lg border border-white/30"
                >
                  <Pencil size={14} /> Registrarlo a mano con los datos del empaque
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

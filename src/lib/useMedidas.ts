import { format } from 'date-fns'
import { useStored } from './storage'
import type { MedidaSemanal } from '../types'

const SEMILLA: MedidaSemanal[] = [
  {
    id: 'semilla-1',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    semana: 1,
    peso: 59.55,
    bmi: 23.3,
    grasaPct: 32,
    pesoGrasoKg: 19.1,
    masaMuscEsqPct: 34.6,
    masaMuscEsqKg: 20.6,
    musculoPct: 62.9,
    musculoKg: 37.5,
  },
]

export function useMedidas() {
  const [medidas, setMedidas] = useStored<MedidaSemanal[]>('medidas', SEMILLA)

  function agregarMedida(medida: Omit<MedidaSemanal, 'id'>) {
    const nueva: MedidaSemanal = { ...medida, id: `${Date.now()}` }
    setMedidas(prev => [...prev, nueva].sort((a, b) => a.semana - b.semana))
  }

  function eliminarMedida(id: string) {
    setMedidas(prev => prev.filter(m => m.id !== id))
  }

  return { medidas, agregarMedida, eliminarMedida }
}

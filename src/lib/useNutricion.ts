import { useMemo } from 'react'
import { format } from 'date-fns'
import { useStored } from './storage'
import type { ComidaRegistrada, MetaNutricional } from '../types'

const META_DEFECTO: MetaNutricional = { kcal: 1950, proteina: 130, grasa: 60, carbohidrato: 220 }

export function useNutricion() {
  const [meta, setMeta] = useStored<MetaNutricional>('metaNutricional', META_DEFECTO)
  const [comidas, setComidas] = useStored<ComidaRegistrada[]>('comidas', [])

  const hoy = format(new Date(), 'yyyy-MM-dd')

  const comidasHoy = useMemo(() => comidas.filter(c => c.fecha === hoy), [comidas, hoy])

  const totalesHoy = useMemo(() => {
    return comidasHoy.reduce(
      (acc, c) => ({
        kcal: acc.kcal + c.alimento.kcal,
        proteina: acc.proteina + c.alimento.proteina,
        grasa: acc.grasa + c.alimento.grasa,
        carbohidrato: acc.carbohidrato + c.alimento.carbohidrato,
      }),
      { kcal: 0, proteina: 0, grasa: 0, carbohidrato: 0 }
    )
  }, [comidasHoy])

  function agregarComida(comida: Omit<ComidaRegistrada, 'id' | 'fecha'>) {
    const nueva: ComidaRegistrada = { ...comida, id: `${Date.now()}`, fecha: hoy }
    setComidas(prev => [nueva, ...prev])
  }

  function eliminarComida(id: string) {
    setComidas(prev => prev.filter(c => c.id !== id))
  }

  return { meta, setMeta, comidas, comidasHoy, totalesHoy, agregarComida, eliminarComida, hoy }
}

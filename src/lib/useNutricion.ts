import { useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { useStored } from './storage'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'
import type { ComidaRegistrada, MetaNutricional } from '../types'

const META_DEFECTO: MetaNutricional = { kcal: 1950, proteina: 130, grasa: 60, carbohidrato: 220 }

export function useNutricion() {
  const { user } = useAuth()
  const [meta, setMetaLocal] = useStored<MetaNutricional>('metaNutricional', META_DEFECTO)
  const [comidas, setComidas] = useStored<ComidaRegistrada[]>('comidas', [])

  const hoy = format(new Date(), 'yyyy-MM-dd')

  // Cargar desde Supabase cuando hay sesión activa
  useEffect(() => {
    if (!user) return

    // Metas nutricionales
    supabase.from('kf_meta_nutricional').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) setMetaLocal({ kcal: data.kcal, proteina: data.proteina, grasa: data.grasa, carbohidrato: data.carbohidrato })
      })

    // Comidas (últimos 60 días)
    const hace60 = format(new Date(Date.now() - 60 * 86400000), 'yyyy-MM-dd')
    supabase.from('kf_comidas').select('*').eq('user_id', user.id).gte('fecha', hace60).order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setComidas(data.map(row => ({
            id: row.id,
            fecha: row.fecha,
            tipo: row.tipo as ComidaRegistrada['tipo'],
            alimento: row.alimento,
          })))
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

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

  async function agregarComida(comida: Omit<ComidaRegistrada, 'id' | 'fecha'>) {
    const id = crypto.randomUUID()
    const nueva: ComidaRegistrada = { ...comida, id, fecha: hoy }
    setComidas(prev => [nueva, ...prev]) // inmediato
    if (user) {
      await supabase.from('kf_comidas').insert({
        id,
        user_id: user.id,
        fecha: hoy,
        tipo: comida.tipo,
        alimento: comida.alimento,
      })
    }
  }

  async function eliminarComida(id: string) {
    setComidas(prev => prev.filter(c => c.id !== id)) // inmediato
    if (user) {
      await supabase.from('kf_comidas').delete().eq('id', id).eq('user_id', user.id)
    }
  }

  async function setMeta(m: MetaNutricional) {
    setMetaLocal(m) // inmediato
    if (user) {
      await supabase.from('kf_meta_nutricional').upsert({
        id: user.id,
        kcal: m.kcal,
        proteina: m.proteina,
        grasa: m.grasa,
        carbohidrato: m.carbohidrato,
        updated_at: new Date().toISOString(),
      })
    }
  }

  return { meta, setMeta, comidas, comidasHoy, totalesHoy, agregarComida, eliminarComida, hoy }
}

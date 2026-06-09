import { useEffect } from 'react'
import { format } from 'date-fns'
import { useStored } from './storage'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'
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
  const { user } = useAuth()
  const [medidas, setMedidas] = useStored<MedidaSemanal[]>('medidas', SEMILLA)

  // Cargar desde Supabase cuando hay sesión activa
  useEffect(() => {
    if (!user) return
    supabase.from('kf_medidas').select('*').eq('user_id', user.id).order('semana', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMedidas(data.map(row => ({
            id: row.id,
            fecha: row.fecha,
            semana: row.semana,
            peso: row.peso,
            bmi: row.bmi,
            grasaPct: row.grasa_pct,
            pesoGrasoKg: row.peso_graso_kg,
            masaMuscEsqPct: row.masa_musc_esq_pct,
            masaMuscEsqKg: row.masa_musc_esq_kg,
            musculoPct: row.musculo_pct,
            musculoKg: row.musculo_kg,
          })))
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function agregarMedida(medida: Omit<MedidaSemanal, 'id'>) {
    const id = crypto.randomUUID()
    const nueva: MedidaSemanal = { ...medida, id }
    setMedidas(prev => [...prev, nueva].sort((a, b) => a.semana - b.semana)) // inmediato
    if (user) {
      await supabase.from('kf_medidas').upsert({
        id,
        user_id: user.id,
        fecha: medida.fecha,
        semana: medida.semana,
        peso: medida.peso,
        bmi: medida.bmi,
        grasa_pct: medida.grasaPct,
        peso_graso_kg: medida.pesoGrasoKg,
        masa_musc_esq_pct: medida.masaMuscEsqPct,
        masa_musc_esq_kg: medida.masaMuscEsqKg,
        musculo_pct: medida.musculoPct,
        musculo_kg: medida.musculoKg,
      })
    }
  }

  async function eliminarMedida(id: string) {
    setMedidas(prev => prev.filter(m => m.id !== id)) // inmediato
    if (user) {
      await supabase.from('kf_medidas').delete().eq('id', id).eq('user_id', user.id)
    }
  }

  return { medidas, agregarMedida, eliminarMedida }
}

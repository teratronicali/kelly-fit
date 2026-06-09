import { useEffect } from 'react'
import { useStored } from './storage'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'
import type { Perfil } from '../types'

const PERFIL_DEFECTO: Perfil = { nombre: 'Kelly', pesoActual: 59.55, pesoObjetivo: null, estatura: null }

export function usePerfil() {
  const { user } = useAuth()
  const [perfil, setPerfilLocal] = useStored<Perfil>('perfil', PERFIL_DEFECTO)

  // Al autenticarse: cargar datos reales desde Supabase
  useEffect(() => {
    if (!user) return
    supabase.from('kf_perfil').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setPerfilLocal({
            nombre: data.nombre ?? PERFIL_DEFECTO.nombre,
            pesoActual: data.peso_actual ?? null,
            pesoObjetivo: data.peso_objetivo ?? null,
            estatura: data.estatura ?? null,
          })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function setPerfil(p: Perfil) {
    setPerfilLocal(p) // inmediato en pantalla
    if (user) {
      await supabase.from('kf_perfil').upsert({
        id: user.id,
        nombre: p.nombre,
        peso_actual: p.pesoActual,
        peso_objetivo: p.pesoObjetivo,
        estatura: p.estatura,
        updated_at: new Date().toISOString(),
      })
    }
  }

  return { perfil, setPerfil }
}

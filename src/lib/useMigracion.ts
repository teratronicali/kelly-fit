/**
 * Migración automática de datos locales → Supabase
 *
 * Se ejecuta una sola vez por usuario al iniciar sesión:
 * si Supabase está vacío pero localStorage tiene datos, los sube todos.
 */
import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from './supabase'
import type { SesionEntreno, ComidaRegistrada, MedidaSemanal, Perfil, MetaNutricional } from '../types'

const P = 'fitkelly:'
const MIGRADO_KEY = P + 'cloud_migrated'

function leer<T>(key: string, def: T): T {
  try {
    const raw = localStorage.getItem(P + key)
    return raw ? (JSON.parse(raw) as T) : def
  } catch { return def }
}

function esUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
}

export function useMigracion() {
  const { user } = useAuth()
  const [estado, setEstado] = useState<'idle' | 'migrando' | 'listo'>('idle')

  useEffect(() => {
    if (!user) return
    if (localStorage.getItem(MIGRADO_KEY)) return // ya migrado antes

    async function intentarMigrar() {
      // 1. ¿Ya hay sesiones en Supabase? (significa que este dispositivo ya subió datos)
      const { count } = await supabase
        .from('kf_sesiones')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user!.id)

      if (count && count > 0) {
        // Datos ya en la nube — marcar como migrado y salir
        localStorage.setItem(MIGRADO_KEY, '1')
        return
      }

      // 2. ¿Hay datos locales para rescatar?
      const sesiones   = leer<SesionEntreno[]>('sesiones', [])
      const comidas    = leer<ComidaRegistrada[]>('comidas', [])
      const medidasAll = leer<MedidaSemanal[]>('medidas', [])
      const perfil     = leer<Perfil | null>('perfil', null)
      const meta       = leer<MetaNutricional | null>('metaNutricional', null)
      const medidas    = medidasAll.filter(m => m.id !== 'semilla-1') // ignorar datos de ejemplo

      const hayDatos = sesiones.length > 0 || comidas.length > 0 || medidas.length > 0 || perfil !== null
      if (!hayDatos) {
        localStorage.setItem(MIGRADO_KEY, '1')
        return
      }

      // 3. Migrar todo a Supabase
      setEstado('migrando')

      try {
        // Perfil
        if (perfil) {
          await supabase.from('kf_perfil').upsert({
            id: user!.id,
            nombre: perfil.nombre,
            peso_actual: perfil.pesoActual,
            peso_objetivo: perfil.pesoObjetivo,
            estatura: perfil.estatura,
          })
        }

        // Meta nutricional
        if (meta) {
          await supabase.from('kf_meta_nutricional').upsert({
            id: user!.id,
            kcal: meta.kcal,
            proteina: meta.proteina,
            grasa: meta.grasa,
            carbohidrato: meta.carbohidrato,
          })
        }

        // Sesiones de entreno
        if (sesiones.length > 0) {
          await supabase.from('kf_sesiones').upsert(
            sesiones.map(s => ({
              id: s.id,
              user_id: user!.id,
              fecha: s.fecha,
              dia: s.dia,
              semana: s.semana,
              completado: s.completado,
              ejercicios: s.ejercicios,
            }))
          )
        }

        // Comidas
        if (comidas.length > 0) {
          await supabase.from('kf_comidas').upsert(
            comidas.map(c => ({
              id: esUUID(c.id) ? c.id : crypto.randomUUID(),
              user_id: user!.id,
              fecha: c.fecha,
              tipo: c.tipo,
              alimento: c.alimento,
            }))
          )
        }

        // Medidas corporales
        if (medidas.length > 0) {
          for (const m of medidas) {
            await supabase.from('kf_medidas').upsert({
              id: esUUID(m.id) ? m.id : crypto.randomUUID(),
              user_id: user!.id,
              semana: m.semana,
              fecha: m.fecha,
              peso: m.peso,
              bmi: m.bmi,
              grasa_pct: m.grasaPct,
              peso_graso_kg: m.pesoGrasoKg,
              masa_musc_esq_pct: m.masaMuscEsqPct,
              masa_musc_esq_kg: m.masaMuscEsqKg,
              musculo_pct: m.musculoPct,
              musculo_kg: m.musculoKg,
            })
          }
        }

        localStorage.setItem(MIGRADO_KEY, '1')
        setEstado('listo')
      } catch {
        setEstado('idle') // fallo silencioso, reintentará la próxima vez
      }
    }

    intentarMigrar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return { migrando: estado === 'migrando', migradoExitoso: estado === 'listo' }
}

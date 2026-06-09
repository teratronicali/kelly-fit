import { useEffect, useMemo } from 'react'
import { differenceInCalendarWeeks, format, parseISO } from 'date-fns'
import { useStored } from './storage'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'
import { PROGRAMA, TOTAL_SEMANAS } from '../data/programa'
import type { DiaSemana, SesionEntreno } from '../types'

const DIAS_ORDEN: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

const NOMBRES_DIA: Record<number, DiaSemana | null> = {
  0: null, // domingo
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: null, // sábado
}

export function useEntrenos() {
  const { user } = useAuth()
  const [fechaInicio, setFechaInicio] = useStored<string>('fechaInicio', format(new Date(), 'yyyy-MM-dd'))
  const [sesiones, setSesiones] = useStored<SesionEntreno[]>('sesiones', [])

  // Al autenticarse: cargar sesiones desde Supabase
  useEffect(() => {
    if (!user) return
    supabase.from('kf_sesiones').select('*').eq('user_id', user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSesiones(data.map(row => ({
            id: row.id,
            fecha: row.fecha,
            dia: row.dia as DiaSemana,
            semana: row.semana,
            completado: row.completado,
            ejercicios: row.ejercicios ?? [],
          })))
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const semanaActual = useMemo(() => {
    const semanas = differenceInCalendarWeeks(new Date(), parseISO(fechaInicio), { weekStartsOn: 1 }) + 1
    return Math.min(Math.max(semanas, 1), TOTAL_SEMANAS)
  }, [fechaInicio])

  const diaDeHoy: DiaSemana | null = NOMBRES_DIA[new Date().getDay()]

  const sesionDe = (fecha: string, dia: DiaSemana) => sesiones.find(s => s.fecha === fecha && s.dia === dia)

  function obtenerOCrearSesion(fecha: string, dia: DiaSemana, semana: number): SesionEntreno {
    const existente = sesionDe(fecha, dia)
    if (existente) return existente
    const programaDia = PROGRAMA.find(p => p.dia === dia)
    const nueva: SesionEntreno = {
      id: `${fecha}-${dia}`,
      fecha,
      dia,
      semana,
      completado: false,
      ejercicios: (programaDia?.ejercicios ?? []).map(ej => ({
        ejercicioId: ej.id,
        nombre: ej.nombre,
        sets: [],
      })),
    }
    return nueva
  }

  async function guardarSesion(sesion: SesionEntreno) {
    // Actualización local inmediata
    setSesiones(prev => {
      const idx = prev.findIndex(s => s.id === sesion.id)
      if (idx === -1) return [...prev, sesion]
      const copia = [...prev]
      copia[idx] = sesion
      return copia
    })
    // Sincronizar con Supabase
    if (user) {
      await supabase.from('kf_sesiones').upsert({
        id: sesion.id,
        user_id: user.id,
        fecha: sesion.fecha,
        dia: sesion.dia,
        semana: sesion.semana,
        completado: sesion.completado,
        ejercicios: sesion.ejercicios,
        updated_at: new Date().toISOString(),
      })
    }
  }

  const racha = useMemo(() => {
    const completadas = sesiones.filter(s => s.completado).map(s => s.fecha).sort().reverse()
    if (completadas.length === 0) return 0
    let contador = 0
    let cursor = new Date()
    for (let i = 0; i < 60; i++) {
      const f = format(cursor, 'yyyy-MM-dd')
      const dia = NOMBRES_DIA[cursor.getDay()]
      if (dia) {
        if (completadas.includes(f)) contador++
        else if (f !== format(new Date(), 'yyyy-MM-dd')) break
      }
      cursor = new Date(cursor.getTime() - 86400000)
    }
    return contador
  }, [sesiones])

  const totalCompletadas = sesiones.filter(s => s.completado).length

  return {
    fechaInicio,
    setFechaInicio,
    sesiones,
    semanaActual,
    diaDeHoy,
    diasOrden: DIAS_ORDEN,
    obtenerOCrearSesion,
    guardarSesion,
    racha,
    totalCompletadas,
    sesionDe,
  }
}

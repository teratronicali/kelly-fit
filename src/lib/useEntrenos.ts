import { useMemo } from 'react'
import { differenceInCalendarWeeks, format, parseISO } from 'date-fns'
import { useStored } from './storage'
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
  const [fechaInicio, setFechaInicio] = useStored<string>('fechaInicio', format(new Date(), 'yyyy-MM-dd'))
  const [sesiones, setSesiones] = useStored<SesionEntreno[]>('sesiones', [])

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

  function guardarSesion(sesion: SesionEntreno) {
    setSesiones(prev => {
      const idx = prev.findIndex(s => s.id === sesion.id)
      if (idx === -1) return [...prev, sesion]
      const copia = [...prev]
      copia[idx] = sesion
      return copia
    })
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

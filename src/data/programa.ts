import type { DiaPrograma } from '../types'

let _id = 0
const eid = () => `ej-${++_id}`

export const PROGRAMA: DiaPrograma[] = [
  {
    dia: 'Lunes',
    enfoque: 'Pierna pesada (cuádriceps + glúteo)',
    ejercicios: [
      { id: eid(), nombre: 'Sentadilla libre', objetivo: '4x5-6', grupo: 'Cuádriceps/Glúteo' },
      { id: eid(), nombre: 'Hip Thrust', objetivo: '4x6-8', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Prensa inclinada pies medios', objetivo: '4x8', grupo: 'Cuádriceps' },
      { id: eid(), nombre: 'Sentadilla búlgara', objetivo: '3x8 c/pierna', grupo: 'Cuádriceps/Glúteo' },
      { id: eid(), nombre: 'Extensión cuádriceps', objetivo: '3x10-12', grupo: 'Cuádriceps' },
      { id: eid(), nombre: 'Abducción máquina', objetivo: '4x15-20', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Pantorrilla Smith', objetivo: '5x15', grupo: 'Pantorrilla' },
      { id: eid(), nombre: 'Dead bug', objetivo: '3x12', grupo: 'Core' },
      { id: eid(), nombre: 'Pallof Press', objetivo: '3x12', grupo: 'Core' },
    ],
  },
  {
    dia: 'Martes',
    enfoque: 'Espalda y hombro',
    ejercicios: [
      { id: eid(), nombre: 'Remo barra', objetivo: '4x8', grupo: 'Espalda' },
      { id: eid(), nombre: 'Remo máquina', objetivo: '3x10', grupo: 'Espalda' },
      { id: eid(), nombre: 'Press militar', objetivo: '4x8', grupo: 'Hombro' },
      { id: eid(), nombre: 'Elevaciones laterales', objetivo: '4x15', grupo: 'Hombro' },
      { id: eid(), nombre: 'Face Pull', objetivo: '3x15', grupo: 'Espalda/Hombro' },
      { id: eid(), nombre: 'Curl bíceps barra', objetivo: '3x10', grupo: 'Bíceps' },
      { id: eid(), nombre: 'Martillo', objetivo: '3x12', grupo: 'Bíceps' },
      { id: eid(), nombre: 'Plancha frontal', objetivo: '3x30-45 seg', grupo: 'Core' },
      { id: eid(), nombre: 'Heel Slides', objetivo: '3x12', grupo: 'Core' },
    ],
  },
  {
    dia: 'Miércoles',
    enfoque: 'Pierna intermedia (femoral + glúteo)',
    ejercicios: [
      { id: eid(), nombre: 'Peso muerto rumano', objetivo: '4x8', grupo: 'Femoral' },
      { id: eid(), nombre: 'Curl femoral acostado', objetivo: '4x10', grupo: 'Femoral' },
      { id: eid(), nombre: 'Hip Thrust', objetivo: '3x10', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Step Up alto', objetivo: '3x10', grupo: 'Cuádriceps/Glúteo' },
      { id: eid(), nombre: 'Pull Through polea', objetivo: '3x12', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Abducción inclinada', objetivo: '3x20', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Caminata lateral banda', objetivo: '2x20', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Bird Dog', objetivo: '3x12', grupo: 'Core' },
      { id: eid(), nombre: 'Vacuum abdominal', objetivo: '3 series', grupo: 'Core' },
    ],
  },
  {
    dia: 'Jueves',
    enfoque: 'Pecho y espalda',
    ejercicios: [
      { id: eid(), nombre: 'Dominadas asistidas o jalón', objetivo: '4x8', grupo: 'Espalda' },
      { id: eid(), nombre: 'Remo unilateral', objetivo: '3x10', grupo: 'Espalda' },
      { id: eid(), nombre: 'Press pecho máquina', objetivo: '4x8-10', grupo: 'Pecho' },
      { id: eid(), nombre: 'Fondos asistidos', objetivo: '3x10', grupo: 'Pecho/Tríceps' },
      { id: eid(), nombre: 'Aperturas en máquina', objetivo: '3x12', grupo: 'Pecho' },
      { id: eid(), nombre: 'Elevaciones laterales', objetivo: '3x15', grupo: 'Hombro' },
      { id: eid(), nombre: 'Curl inclinado', objetivo: '3x12', grupo: 'Bíceps' },
      { id: eid(), nombre: 'Extensión tríceps cuerda', objetivo: '3x12', grupo: 'Tríceps' },
      { id: eid(), nombre: 'Wood Chop', objetivo: '3x12', grupo: 'Core' },
      { id: eid(), nombre: 'Plancha lateral', objetivo: '3x30 seg', grupo: 'Core' },
    ],
  },
  {
    dia: 'Viernes',
    enfoque: 'Pierna suave (glúteo completo)',
    ejercicios: [
      { id: eid(), nombre: 'Hip Thrust', objetivo: '4x12', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Sentadilla Sumo', objetivo: '3x12', grupo: 'Cuádriceps/Glúteo' },
      { id: eid(), nombre: 'Prensa pies altos', objetivo: '3x15', grupo: 'Glúteo/Femoral' },
      { id: eid(), nombre: 'Patada de glúteo polea', objetivo: '4x15', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Hiperextensiones glúteo', objetivo: '3x15', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Abducción máquina', objetivo: '4x20', grupo: 'Glúteo' },
      { id: eid(), nombre: 'Pantorrillas', objetivo: '4x20', grupo: 'Pantorrilla' },
      { id: eid(), nombre: 'Reverse crunch', objetivo: '3x15', grupo: 'Core' },
    ],
  },
]

export const TOTAL_SEMANAS = 12

export function parseObjetivoSets(objetivo: string): number {
  const match = objetivo.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 3
}

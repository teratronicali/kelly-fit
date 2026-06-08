export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes'

export interface Ejercicio {
  id: string
  nombre: string
  objetivo: string // ej "4x6-8"
  grupo: string
}

export interface DiaPrograma {
  dia: DiaSemana
  enfoque: string
  ejercicios: Ejercicio[]
}

export interface SetRegistrado {
  peso: number | null
  reps: number | null
}

export interface RegistroEjercicio {
  ejercicioId: string
  nombre: string
  sets: SetRegistrado[]
  notas?: string
}

export interface SesionEntreno {
  id: string
  fecha: string // ISO yyyy-MM-dd
  dia: DiaSemana
  semana: number
  completado: boolean
  ejercicios: RegistroEjercicio[]
}

export interface MedidaSemanal {
  id: string
  fecha: string
  semana: number
  peso: number | null
  bmi: number | null
  grasaPct: number | null
  pesoGrasoKg: number | null
  masaMuscEsqPct: number | null
  masaMuscEsqKg: number | null
  musculoPct: number | null
  musculoKg: number | null
}

export interface Alimento {
  nombre: string
  cantidad: string
  kcal: number
  proteina: number
  grasa: number
  carbohidrato: number
}

export interface ComidaRegistrada {
  id: string
  fecha: string
  tipo: 'desayuno' | 'almuerzo' | 'cena' | 'snack'
  alimento: Alimento
}

export interface MetaNutricional {
  kcal: number
  proteina: number
  grasa: number
  carbohidrato: number
}

export interface Perfil {
  nombre: string
  pesoActual: number | null
  pesoObjetivo: number | null
  estatura: number | null
}

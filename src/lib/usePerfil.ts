import { useStored } from './storage'
import type { Perfil } from '../types'

const PERFIL_DEFECTO: Perfil = {
  nombre: 'Kelly',
  pesoActual: 59.55,
  pesoObjetivo: null,
  estatura: null,
}

export function usePerfil() {
  const [perfil, setPerfil] = useStored<Perfil>('perfil', PERFIL_DEFECTO)
  return { perfil, setPerfil }
}

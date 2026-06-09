import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, LogOut } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { usePerfil } from '../lib/usePerfil'
import { useNutricion } from '../lib/useNutricion'
import { useAuth } from '../lib/AuthContext'

const ROSA_FUERTE = '#e0367a'

export default function Perfil() {
  const navigate = useNavigate()
  const { perfil, setPerfil } = usePerfil()
  const { meta, setMeta } = useNutricion()
  const { signOut, user } = useAuth()

  const [form, setForm] = useState({
    nombre: perfil.nombre,
    pesoActual: perfil.pesoActual !== null ? String(perfil.pesoActual) : '',
    pesoObjetivo: perfil.pesoObjetivo !== null ? String(perfil.pesoObjetivo) : '',
    estatura: perfil.estatura !== null ? String(perfil.estatura) : '',
    kcal: String(meta.kcal),
    proteina: String(meta.proteina),
    grasa: String(meta.grasa),
    carbohidrato: String(meta.carbohidrato),
  })

  const num = (v: string) => (v.trim() === '' ? null : Number(v))

  function guardar() {
    if (!form.nombre.trim()) { toast.error('Escribe tu nombre'); return }
    setPerfil({
      nombre: form.nombre.trim(),
      pesoActual: num(form.pesoActual),
      pesoObjetivo: num(form.pesoObjetivo),
      estatura: num(form.estatura),
    })
    setMeta({
      kcal: Number(form.kcal) || 0,
      proteina: Number(form.proteina) || 0,
      grasa: Number(form.grasa) || 0,
      carbohidrato: Number(form.carbohidrato) || 0,
    })
    toast.success('Perfil actualizado 🌸')
    navigate('/')
  }

  const campo = (label: string, key: keyof typeof form, opts?: { unidad?: string; tipo?: string }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label} {opts?.unidad && <span className="text-gray-400">({opts.unidad})</span>}</label>
      <input
        type={opts?.tipo ?? 'number'}
        inputMode={opts?.tipo === 'text' ? 'text' : 'decimal'}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
      />
    </div>
  )

  return (
    <div className="animate-float-up pb-6">
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13 } }} />
      <div className="px-5 pt-6 pb-4 bg-gradient-to-br from-[var(--rosa-suave)] to-white rounded-b-3xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <ArrowLeft size={14} /> Volver al inicio
        </button>
        <h1 className="text-lg font-semibold text-[var(--rosa-fuerte)]">Mi perfil</h1>
        <p className="text-xs text-gray-500 mt-0.5">Ajusta tus datos y tus metas personales</p>
      </div>

      <div className="px-5 mt-4 space-y-4">
        <div className="rounded-2xl bg-white border border-pink-100 p-4 space-y-3">
          <p className="text-xs font-medium text-[var(--rosa-fuerte)] uppercase tracking-wide">Datos personales</p>
          {campo('Nombre', 'nombre', { tipo: 'text' })}
          <div className="grid grid-cols-2 gap-3">
            {campo('Peso actual', 'pesoActual', { unidad: 'kg' })}
            {campo('Peso objetivo', 'pesoObjetivo', { unidad: 'kg' })}
          </div>
          {campo('Estatura', 'estatura', { unidad: 'cm' })}
        </div>

        <div className="rounded-2xl bg-white border border-pink-100 p-4 space-y-3">
          <p className="text-xs font-medium text-[var(--rosa-fuerte)] uppercase tracking-wide">Metas nutricionales diarias</p>
          {campo('Calorías objetivo', 'kcal', { unidad: 'kcal' })}
          <div className="grid grid-cols-3 gap-3">
            {campo('Proteína', 'proteina', { unidad: 'g' })}
            {campo('Grasa', 'grasa', { unidad: 'g' })}
            {campo('Carbohidrato', 'carbohidrato', { unidad: 'g' })}
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Estas metas se usan para calcular tu progreso diario en la sección de Nutrición. Ajusta los valores según lo que te indique tu nutricionista.
          </p>
        </div>

        <button
          onClick={guardar}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3 rounded-xl shadow-md active:scale-[0.98] transition-transform"
          style={{ background: ROSA_FUERTE }}
        >
          <Check size={16} /> Guardar cambios
        </button>

        {/* Cuenta */}
        <div className="rounded-2xl bg-white border border-pink-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Cuenta</p>
          <p className="text-xs text-gray-400 mb-3">{user?.email}</p>
          <button
            onClick={async () => { await signOut(); navigate('/') }}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-500 py-2.5 rounded-xl border border-red-100 bg-red-50 active:scale-[0.98] transition-transform"
          >
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

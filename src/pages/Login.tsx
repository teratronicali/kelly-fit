'use client'
import { useState } from 'react'
import { Loader2, Heart, Dumbbell } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modo, setModo] = useState<'login' | 'registro'>('login')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || password.length < 6) {
      toast.error(password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : 'Completa todos los campos')
      return
    }
    setCargando(true)
    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) {
        toast.error('Email o contraseña incorrectos')
        setCargando(false)
      }
      // Si no hay error, AuthContext detecta el cambio y App redirige automáticamente
    } else {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password })
      if (error) {
        toast.error(error.message)
        setCargando(false)
      } else {
        toast.success('¡Cuenta creada! Ahora inicia sesión 🌸')
        setModo('login')
        setCargando(false)
      }
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: 'linear-gradient(160deg, var(--rosa-suave) 0%, #fff 60%)' }}
    >
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13 } }} />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--rosa), var(--rosa-fuerte))' }}
          >
            <Dumbbell size={34} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kelly Fit</h1>
          <p className="text-sm text-gray-500 mt-1">Tu entrenamiento y nutrición 🌸</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-5 text-center">
            {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta nueva'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                autoComplete="email"
                autoCapitalize="none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white py-3.5 rounded-xl mt-2 active:scale-[0.98] transition-transform disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, var(--rosa), var(--rosa-fuerte))' }}
            >
              {cargando && <Loader2 size={16} className="animate-spin" />}
              {modo === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            {modo === 'login' ? '¿No tienes cuenta aún?' : '¿Ya tienes una cuenta?'}{' '}
            <button
              onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
              className="font-semibold"
              style={{ color: 'var(--rosa-fuerte)' }}
            >
              {modo === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </p>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6 flex items-center justify-center gap-1">
          Hecho con <Heart size={10} className="inline" style={{ color: 'var(--rosa-fuerte)', fill: 'var(--rosa-fuerte)' }} /> para Kelly
        </p>
      </div>
    </div>
  )
}

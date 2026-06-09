import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2, CloudUpload } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from './lib/AuthContext'
import { useMigracion } from './lib/useMigracion'
import Layout from './components/Layout'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Entreno from './pages/Entreno'
import DiaEntreno from './pages/DiaEntreno'
import Progreso from './pages/Progreso'
import Nutricion from './pages/Nutricion'
import Tips from './pages/Tips'
import Perfil from './pages/Perfil'

function MigracionBanner() {
  const { migrando, migradoExitoso } = useMigracion()

  useEffect(() => {
    if (migradoExitoso) toast.success('¡Tus datos del celular ya están en la nube! ☁️🌸', { duration: 4000 })
  }, [migradoExitoso])

  if (!migrando) return null

  return (
    <div className="fixed top-0 inset-x-0 z-[100] flex items-center justify-center gap-2 py-2.5 px-4 text-white text-xs font-medium"
         style={{ background: 'var(--rosa-fuerte)' }}>
      <CloudUpload size={14} className="shrink-0" />
      Subiendo tus datos guardados a la nube…
      <Loader2 size={13} className="animate-spin shrink-0" />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--rosa-suave)' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--rosa-fuerte)' }} />
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13 } }} />
      <MigracionBanner />
      <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/entreno" element={<Entreno />} />
        <Route path="/entreno/:dia" element={<DiaEntreno />} />
        <Route path="/progreso" element={<Progreso />} />
        <Route path="/nutricion" element={<Nutricion />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>
    </Routes>
    </>
  )
}

import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from './lib/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Entreno from './pages/Entreno'
import DiaEntreno from './pages/DiaEntreno'
import Progreso from './pages/Progreso'
import Nutricion from './pages/Nutricion'
import Tips from './pages/Tips'
import Perfil from './pages/Perfil'

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
  )
}

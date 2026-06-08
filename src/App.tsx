import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Entreno from './pages/Entreno'
import DiaEntreno from './pages/DiaEntreno'
import Progreso from './pages/Progreso'
import Nutricion from './pages/Nutricion'
import Tips from './pages/Tips'
import Perfil from './pages/Perfil'

export default function App() {
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

import type { ReactNode } from 'react'

export default function PageHeader({ titulo, subtitulo, accion }: { titulo: string; subtitulo?: string; accion?: ReactNode }) {
  return (
    <div className="px-5 pt-6 pb-4 flex items-center justify-between bg-gradient-to-br from-[var(--rosa-suave)] to-white rounded-b-3xl">
      <div>
        <h1 className="text-lg font-semibold text-[var(--rosa-fuerte)]">{titulo}</h1>
        {subtitulo && <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>}
      </div>
      {accion}
    </div>
  )
}

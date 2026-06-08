import { useEffect, useState } from 'react'

const PREFIX = 'fitkelly:'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // almacenamiento lleno o no disponible
  }
}

export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial))

  useEffect(() => {
    write(key, value)
  }, [key, value])

  return [value, setValue] as const
}

import { createContext, useContext } from 'react'

export const AudioContext = createContext(null)

export function useAudio() {
  const audio = useContext(AudioContext)
  if (!audio) throw new Error('useAudio debe utilizarse dentro de AudioProvider')
  return audio
}

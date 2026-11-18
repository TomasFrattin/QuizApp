import { useAudio } from '../audio/audioContext'

function AudioControlBar() {
  const { muted, volume, toggleMuted, updateVolume } = useAudio()
  return <div className="audio-control" aria-label="Controles de audio">
    <span className="audio-control__label">AUDIO</span>
    <button type="button" onClick={toggleMuted} aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}>{muted ? '[ MUTE ]' : '[ ON ]'}</button>
    <input type="range" min="0" max="100" value={muted ? 0 : Math.round(volume * 100)} onChange={(event) => updateVolume(Number(event.target.value) / 100)} aria-label="Volumen" />
  </div>
}
export default AudioControlBar

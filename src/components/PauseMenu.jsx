import { AnimatePresence, motion } from 'motion/react'
import { useAudio } from '../audio/audioContext'

const effectLabels = {
  scanlines: 'Scanlines',
  flicker: 'Parpadeo de fósforo',
  aberration: 'Aberración cromática',
  glow: 'Resplandor de texto',
  grain: 'Ruido / grano',
  curvature: 'Curvatura de pantalla',
  vignette: 'Viñeta',
}

function PauseMenu({ open, visualEffects, onToggleEffect, onClose }) {
  const { muted, volume, toggleMuted, updateVolume } = useAudio()

  return <AnimatePresence>
    {open && <motion.div className="pause-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <motion.section className="pause-menu" role="dialog" aria-modal="true" aria-labelledby="pause-title" initial={{ opacity: 0, scale: .94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 8 }} transition={{ duration: .22 }}>
        <div className="pause-menu__header"><span className="eyebrow">SISTEMA // PAUSA</span><button className="pause-menu__close" type="button" onClick={onClose}>ESC CERRAR</button></div>
        <h2 id="pause-title">CONTROLES DE LA SALA</h2>
        <div className="pause-menu__section"><span className="pause-menu__section-label">EFECTOS VISUALES</span><div className="pause-menu__options">{Object.entries(effectLabels).map(([key, label]) => <button className={`pause-option ${visualEffects[key] ? 'is-active' : ''}`} type="button" aria-pressed={visualEffects[key]} key={key} onClick={() => onToggleEffect(key)}><span>{visualEffects[key] ? '[ ON ]' : '[ OFF ]'}</span>{label}</button>)}</div></div>
        <div className="pause-menu__section"><span className="pause-menu__section-label">AUDIO</span><div className="pause-menu__audio"><button className="pause-option is-active" type="button" onClick={toggleMuted}>{muted ? '[ MUTE ]' : '[ ON ]'} SONIDO GLOBAL</button><label htmlFor="pause-volume">VOLUMEN <input id="pause-volume" type="range" min="0" max="100" value={Math.round(volume * 100)} onChange={(event) => updateVolume(Number(event.target.value) / 100)} /></label></div></div>
        <p className="pause-menu__hint">Presioná ESC en cualquier momento para volver a la experiencia.</p>
      </motion.section>
    </motion.div>}
  </AnimatePresence>
}

export default PauseMenu

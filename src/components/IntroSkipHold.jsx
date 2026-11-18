import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

const HOLD_DURATION = .9
const FRAME_SIZE = 40

function IntroSkipHold({ onSkip }) {
  const [holding, setHolding] = useState(false)
  const skipRef = useRef(onSkip)
  useEffect(() => { skipRef.current = onSkip }, [onSkip])

  useEffect(() => {
    if (!holding) return undefined
    const timer = window.setTimeout(() => skipRef.current(), HOLD_DURATION * 1000)
    return () => window.clearTimeout(timer)
  }, [holding])

  useEffect(() => {
    function keyDown(event) {
      if (event.key.toLowerCase() !== 's' || event.repeat) return
      if (event.target instanceof HTMLElement && event.target.matches('input, textarea')) return
      setHolding(true)
    }
    function keyUp(event) { if (event.key.toLowerCase() === 's') setHolding(false) }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    return () => { window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp) }
  }, [])

  return <div className="intro-skip-hold"><div className="intro-skip-hold__dial"><motion.svg className="intro-skip-hold__ring" width="50" height="50" viewBox="0 0 50 50" aria-hidden="true"><motion.rect className="intro-skip-hold__progress" x="5" y="5" width={FRAME_SIZE} height={FRAME_SIZE} rx="6" pathLength="1" strokeDasharray="1" initial={false} animate={holding ? 'holding' : 'rest'} variants={{ rest: { strokeDashoffset: 1, opacity: .42 }, holding: { strokeDashoffset: 0, opacity: 1, transition: { strokeDashoffset: { duration: HOLD_DURATION, ease: 'linear' }, opacity: { duration: .12 } } } }} /></motion.svg><motion.button className="intro-skip-hold__key" type="button" aria-label="Mantener para omitir la intro" onPointerDown={() => setHolding(true)} onPointerUp={() => setHolding(false)} onPointerCancel={() => setHolding(false)} onPointerLeave={() => setHolding(false)} whileTap={{ scale: .9 }} animate={{ scale: holding ? .94 : 1 }} transition={{ type: 'spring', stiffness: 480, damping: 26 }}>S</motion.button></div><motion.span className="intro-skip-hold__label" animate={{ opacity: holding ? 1 : .62 }}>MANTENER [S] PARA OMITIR</motion.span></div>
}

export default IntroSkipHold

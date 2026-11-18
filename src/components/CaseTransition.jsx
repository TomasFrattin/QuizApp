import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

const TRANSITION_DURATION = 7000

function CaseTransition({ caseFile, onComplete }) {
  const completionRef = useRef(onComplete)
  useEffect(() => { completionRef.current = onComplete }, [onComplete])

  useEffect(() => {
    const timer = window.setTimeout(() => completionRef.current(), TRANSITION_DURATION)
    return () => window.clearTimeout(timer)
  }, [])

  return <section className="case-transition" aria-live="polite">
    <motion.div className="case-transition__noise" aria-hidden="true" initial={{ scale: .86, opacity: 0 }} animate={{ scale: 1.12, opacity: .5 }} transition={{ duration: 2.2, ease: 'easeOut' }} />
    <motion.div className="case-transition__content" initial={{ opacity: 0, scale: .92, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .8, delay: .15, ease: 'easeOut' }}>
      <span className="eyebrow">CONECTANDO CON ARCHIVO SEGURO</span>
      <motion.h1 initial={{ letterSpacing: '.2em', filter: 'blur(8px)' }} animate={{ letterSpacing: '-.07em', filter: 'blur(0px)' }} transition={{ duration: 1.1, delay: .25 }}>{caseFile.title}</motion.h1>
      <div className="case-transition__progress" aria-hidden="true"><span /></div>
      <p>DESCIFRANDO REGISTROS // PREPARANDO ENTORNO</p>
    </motion.div>
  </section>
}

export default CaseTransition

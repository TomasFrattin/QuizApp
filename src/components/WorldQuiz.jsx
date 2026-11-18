import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useScroll, useTransform } from 'motion/react'
import { useAudio } from '../audio/audioContext'

const layerPlacements = [
  { left: '4%', top: '10%', width: '92%', height: '44%' },
  { left: '52%', top: '18%', width: '42%', height: '52%' },
  { left: '8%', top: '38%', width: '54%', height: '42%' },
  { left: '48%', top: '52%', width: '48%', height: '45%' },
  { left: '12%', top: '64%', width: '72%', height: '30%' },
]

function VisualLayer({ layer, layerIndex, scrollProgress }) {
  const offset = `${layer.parallax * 100}%`
  const y = useTransform(scrollProgress, [0, 1], [`-${offset}`, offset])
  const placement = layerPlacements[layerIndex % layerPlacements.length]

  return <motion.div className="world__visual-layer" style={{ ...placement, y, background: layer.color, zIndex: layer.level }} initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, ease: 'easeOut' }}>
    <span className="world__visual-label">{layer.label} // P:{layer.parallax.toFixed(2)}</span>
  </motion.div>
}

function WorldQuiz({ caseFile, completedLevels, onSolveLevel, onClose }) {
  const { playEffect, playRandomOceanCreature } = useAudio()
  const [denied, setDenied] = useState({})
  const screenControls = useAnimation()
  const levelRefs = useRef([])
  const worldRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: worldRef, offset: ['start start', 'end end'] })
  const solvedLevels = new Set(completedLevels)
  const visibleCount = Math.min(completedLevels.length + 1, caseFile.levels.length)
  const complete = completedLevels.length === caseFile.levels.length
  const unlockedLevel = completedLevels.length

  useEffect(() => {
    screenControls.start({ opacity: 1, transition: { duration: .7 } })
  }, [screenControls])

  function chooseAnswer(levelIndex, answerIndex) {
    if (solvedLevels.has(levelIndex)) return
    if (answerIndex === caseFile.levels[levelIndex].correctIndex) {
      playEffect('success', 0.75)
      onSolveLevel(caseFile.id, levelIndex)
    } else {
      playEffect('error', 0.7)
      if (caseFile.theme === 'ocean' && Math.random() < 0.35) playRandomOceanCreature(0.68)
      setDenied((current) => ({ ...current, [levelIndex]: answerIndex }))
      screenControls.start({
        x: [0, -7, 7, -5, 5, -2, 2, 0],
        y: [0, 2, -2, 1, -1, 0],
        transition: { duration: .42, ease: 'easeOut' },
      })
    }
  }

  function goToNext(levelIndex) { levelRefs.current[levelIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }

  return <motion.section ref={worldRef} className="world" initial={{ opacity: 0 }} animate={screenControls} transition={{ duration: .7 }}>
    <div className="world__layers" aria-hidden="true">{(caseFile.visualLayers ?? []).filter((layer) => layer.level <= unlockedLevel).map((layer, layerIndex) => <VisualLayer key={layer.id} layer={layer} layerIndex={layerIndex} scrollProgress={scrollYProgress} />)}</div>
    <header className="world__topbar"><span className="world__title">{caseFile.title}</span><button className="close-case" type="button" onClick={onClose}>CERRAR EXPEDIENTE</button></header>
    <div className="world__content">{caseFile.levels.slice(0, visibleCount).map((level, levelIndex) => {
      const solved = solvedLevels.has(levelIndex); const wrong = denied[levelIndex]
      return <motion.article className="level" key={level.question} ref={(element) => { levelRefs.current[levelIndex] = element }} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .12 }}><div className="level__card">
        <span className="level-marker">NIVEL {String(levelIndex + 1).padStart(2, '0')} // {solved ? 'ANALIZADO' : 'PENDIENTE'}</span><h2>{level.question}</h2>
        <div className="answer-list">{level.options.map((option, answerIndex) => <motion.button type="button" className={`answer ${solved && answerIndex === level.correctIndex ? 'is-correct' : ''} ${wrong === answerIndex ? 'is-wrong' : ''}`} key={option} disabled={solved} onClick={() => chooseAnswer(levelIndex, answerIndex)} whileHover={!solved ? { x: [0, -1, 1, 0], filter: ['none', 'contrast(1.25) saturate(1.35)', 'none'], transition: { duration: .28, repeat: Infinity, repeatDelay: 1.1 } } : undefined} whileTap={!solved ? { scale: .985 } : undefined}><span className="answer__letter">{String.fromCharCode(65 + answerIndex)}.</span>{option}</motion.button>)}</div>
        {wrong !== undefined && !solved && <motion.p className="denied" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .25 }}>ACCESO DENEGADO // ERROR DE ANÁLISIS. INTENTE DE NUEVO.</motion.p>}
        {solved && <div className="classified-report"><span>INFORME CLASIFICADO // DATO CONFIRMADO</span><p>{level.fact}</p></div>}
        {solved && levelIndex < caseFile.levels.length - 1 && <button className="next-level" type="button" onClick={() => goToNext(levelIndex)}>IR AL SIGUIENTE NIVEL ↓</button>}
      </div></motion.article>
    })}{complete && <div className="completion"><span className="eyebrow">EXPEDIENTE COMPLETADO</span><h2>Análisis finalizado.</h2><button className="next-level" type="button" onClick={onClose}>VOLVER A LA SALA</button></div>}</div>
  </motion.section>
}
export default WorldQuiz

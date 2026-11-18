import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useAudio } from '../audio/audioContext'
import IncomingMailModal from './IncomingMailModal'

const messages = [
  {
    id: 'central-sector-04',
    from: 'DIRECCIÓN CENTRAL // SECTOR 04',
    to: 'ANALISTA EN TURNO',
    date: '14/09/1996 - 02:14 AM',
    subject: 'PROTOCOLO DE CONTENCIÓN - ANOMALÍAS ACTIVAS',
    body: 'Los registros del sector están siendo alterados desde una fuente no identificada.\n\nLa validación automática ha fallado. A partir de este momento, toda clasificación deberá ser confirmada por criterio humano.\n\nNo confíe en los datos que parezcan demasiado coherentes. La anomalía aprende de nuestros informes.\n\n— DIRECCIÓN CENTRAL',
  },
]

function DeskHub({ caseFiles, progress, onOpenCase }) {
  const { playEffect } = useAudio()
  const [unreadCount, setUnreadCount] = useState(0)
  const [pulseOn, setPulseOn] = useState(false)
  const [openMessage, setOpenMessage] = useState(null)
  const notificationCycleRef = useRef({ interval: null, off: null })

  useEffect(() => {
    let pulseInterval
    let pulseOffTimeout
    const triggerPulse = () => {
      setPulseOn(true)
      playEffect('mailAlert', 0.28)
      window.clearTimeout(pulseOffTimeout)
      pulseOffTimeout = window.setTimeout(() => setPulseOn(false), 2000)
      notificationCycleRef.current.off = pulseOffTimeout
    }
    const timer = window.setTimeout(() => {
      setUnreadCount(1)
      triggerPulse()
      pulseInterval = window.setInterval(triggerPulse, 4000)
      notificationCycleRef.current.interval = pulseInterval
    }, 5000)
    return () => {
      window.clearTimeout(timer)
      window.clearInterval(pulseInterval)
      window.clearTimeout(pulseOffTimeout)
      notificationCycleRef.current = { interval: null, off: null }
    }
  }, [playEffect])

  function openIncomingMail() {
    if (!unreadCount) return
    setOpenMessage(messages[0])
    setUnreadCount(0)
    setPulseOn(false)
    window.clearInterval(notificationCycleRef.current.interval)
    window.clearTimeout(notificationCycleRef.current.off)
    notificationCycleRef.current = { interval: null, off: null }
  }

  return <section className="desk">
    <div className="desk__topbar"><span className="desk__system-status">ARCHIVO CENTRAL // ENLACE ACTIVO</span><button className={`communications-led ${unreadCount ? 'is-active' : ''}`} type="button" onClick={openIncomingMail} aria-label={unreadCount ? 'Abrir mensaje nuevo' : 'Sin mensajes nuevos'}><motion.span className="communications-led__dot" animate={pulseOn ? { scale: [1, 1.18, 1.5, 1.16, 1], backgroundColor: ['#17231a', '#00ff41', '#00ff41', '#3dba52', '#17231a'], opacity: [.35, .78, 1, .68, .35], boxShadow: ['0 0 0 transparent', '0 0 4px #00ff41, 0 0 10px rgba(0,255,65,.45)', '0 0 6px #00ff41, 0 0 16px rgba(0,255,65,.72)', '0 0 3px #3dba52, 0 0 8px rgba(61,186,82,.38)', '0 0 0 transparent'] } : { scale: 1, backgroundColor: '#17231a', opacity: .35, boxShadow: '0 0 0 transparent' }} transition={{ duration: pulseOn ? 2 : .24, ease: 'easeInOut' }} />{unreadCount ? `[ MENSAJE ENTRANTE (${unreadCount}) ]` : '[ COMUNICACIONES ]'}</button></div>
    <motion.header className="desk__header" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}><span className="eyebrow">ARCHIVO CENTRAL // DIRECTORIO ACTIVO</span><h1>SALA DE EXPEDIENTES</h1><p>Seleccione un caso. Los datos contenidos a continuación requieren criterio, precisión y una buena dosis de curiosidad.</p></motion.header>
    <div className="case-grid">{caseFiles.map((caseFile, index) => { const solved = progress[caseFile.id]?.completedLevels?.length ?? 0; const complete = solved === caseFile.levels.length; return <motion.button className="case-card" type="button" key={caseFile.id} onClick={() => onOpenCase(caseFile)} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .15 + index * .12, ease: 'easeOut' }} whileHover={{ y: -6, scale: 1.015 }} whileTap={{ scale: .985 }}><span className="case-card__number">ARCHIVO {String(index + 1).padStart(2, '0')}</span><h2>{caseFile.title}</h2><p>{caseFile.summary}</p><span className="case-card__status">{complete ? 'CASO RESUELTO' : `${solved}/${caseFile.levels.length} NIVELES ANALIZADOS`}</span></motion.button> })}</div>
    <IncomingMailModal message={openMessage} onClose={() => setOpenMessage(null)} />
  </section>
}

export default DeskHub

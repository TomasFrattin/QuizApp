import { useCallback, useEffect, useRef, useState } from 'react'
import { useAudio } from '../audio/audioContext'

const loreLines = [
  'CONEXIÓN ESTABLECIDA // DIVISIÓN DE ANOMALÍAS HISTÓRICAS',
  'ADVERTENCIA: Corrupción masiva detectada en los registros del sector.',
  'La realidad local ha comenzado a desdibujarse. Los datos históricos están mutando.',
  'OPERADOR DESIGNADO: Se requiere validación de criterio humano inmediato.',
  'Cualquier error de análisis provocará la pérdida definitiva del archivo.',
  'Cargando interfaz de expedientes...',
]

const message = loreLines.map((line) => `> ${line}`).join('\n\n')
const timeline = {
  doorClose: 11000,
  switchOn: 17000,
  keyDrop: 17500,
  jacketRustling: 18000,
  insideSteps: 25000,
  boot: 35000,
  folderFall: 37000,
  folderSliding: 38000,
  maleSigh: 40000,
  terminalLoading: 43000,
  typing: 45000,
}
const TYPING_DURATION = 6000

function IntroTerminal({ onComplete }) {
  const { enableAudio, playEffect, playIntroEffect, playIntroCue, startIntroBoot, fadeOutIntroBoot, startTyping, stopTyping, stopIntroAudio } = useAudio()
  const [started, setStarted] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [crtTurningOn, setCrtTurningOn] = useState(false)
  const [typing, setTyping] = useState(false)
  const [awaitingAccess, setAwaitingAccess] = useState(false)
  const [skipHeld, setSkipHeld] = useState(false)
  const [characters, setCharacters] = useState(0)
  const completionRef = useRef(onComplete)
  const timersRef = useRef([])
  const skipTimerRef = useRef(null)
  const skipHeldRef = useRef(false)

  useEffect(() => { completionRef.current = onComplete }, [onComplete])
  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    stopTyping()
    window.clearTimeout(skipTimerRef.current)
  }, [stopTyping])

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined
    function handleKeyDown(event) {
      if (event.key.toLowerCase() !== 's' || event.repeat || skipHeldRef.current) return
      skipHeldRef.current = true
      setSkipHeld(true)
      skipTimerRef.current = window.setTimeout(() => {
        enableAudio()
        stopIntroAudio()
        skipHeldRef.current = false
        setSkipHeld(false)
        completionRef.current()
      }, 900)
    }
    function handleKeyUp(event) {
      if (event.key.toLowerCase() !== 's') return
      window.clearTimeout(skipTimerRef.current)
      skipTimerRef.current = null
      skipHeldRef.current = false
      setSkipHeld(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.clearTimeout(skipTimerRef.current)
    }
  }, [enableAudio, stopIntroAudio])

  const enterDesk = useCallback(() => {
    if (!awaitingAccess) return
    playEffect('click', 0.5)
    fadeOutIntroBoot()
    setAwaitingAccess(false)
    completionRef.current()
  }, [awaitingAccess, fadeOutIntroBoot, playEffect])

  useEffect(() => {
    if (!typing || characters >= message.length) return undefined
    const delay = Math.max(10, Math.floor(TYPING_DURATION / message.length))
    const timer = window.setTimeout(() => setCharacters((value) => value + 1), delay)
    return () => window.clearTimeout(timer)
  }, [typing, characters])

  useEffect(() => {
    if (!awaitingAccess) return undefined
    function handleKeyDown(event) {
      if (event.repeat || !['Enter', ' '].includes(event.key)) return
      event.preventDefault()
      enterDesk()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [awaitingAccess, enterDesk])

  function queue(callback, delay) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function initializeSequence() {
    enableAudio()
    setStarted(true)
    playIntroCue('stepsOutside', 0.72)
    queue(() => playIntroCue('doorClose', 0.82), timeline.doorClose)
    queue(() => playIntroCue('switchOn', 0.72), timeline.switchOn)
    queue(() => playIntroCue('keyDrop', 0.74), timeline.keyDrop)
    queue(() => playIntroCue('jacketRustling', 0.62), timeline.jacketRustling)
    queue(() => playIntroCue('stepsInside', 0.56), timeline.insideSteps)
    queue(() => startIntroBoot(), timeline.boot)
    queue(() => playIntroCue('folderFall', 1), timeline.folderFall)
    queue(() => playIntroCue('folderSliding', 0.62), timeline.folderSliding)
    queue(() => playIntroEffect('maleSigh', 0.38), timeline.maleSigh)
    queue(() => { setCrtTurningOn(true); setTerminalVisible(true) }, timeline.terminalLoading)
    queue(() => { setTyping(true); startTyping() }, timeline.typing)
    queue(() => {
      setCharacters(message.length)
      setTyping(false)
      stopTyping()
      setAwaitingAccess(true)
    }, timeline.typing + TYPING_DURATION)
  }

  return <section className={`intro ${started ? 'intro--sequence' : 'intro--idle'} ${terminalVisible ? 'intro--terminal-online' : ''} ${crtTurningOn ? 'intro--crt-turning-on' : ''}`}>
    {import.meta.env.DEV && skipHeld && <div className="intro__skip-indicator" role="status">MANTÉN [S] // OMITIENDO INTRO <span /></div>}
    <div className="terminal">
      {!started && <button className="terminal__button terminal__button--init" type="button" data-silent-click onClick={initializeSequence}>&gt; INICIALIZAR SECUENCIA DE ACCESO</button>}
      {terminalVisible && <>
        <span className="terminal__label">CANAL SEGURO // NIVEL DE ACCESO: OPERADOR</span>
        <h1>DIVISIÓN_AH</h1>
        <p className="terminal__story">{typing || characters > 0 ? message.slice(0, characters) : '/// TERMINAL SIN CONEXIÓN // REINTENTANDO ENLACE ///'}<span className="cursor">_</span></p>
        {awaitingAccess && <button className="terminal__access-prompt" type="button" onClick={enterDesk} autoFocus>&gt; PRESIONE ENTER PARA ACCEDER A LA SALA</button>}
      </>}
    </div>
  </section>
}

export default IntroTerminal

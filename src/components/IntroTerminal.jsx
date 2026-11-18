import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAudio } from '../audio/audioContext'
import IntroSkipHold from './IntroSkipHold'

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
}
const TYPING_DURATION = 6000
const RECOVERY_TOKEN = '96-DELTA'
const ACCESS_DENIED = '[ERROR 0x41: ACCESO DENEGADO. CREDENCIALES EXPIRADAS EN ESTE SECTOR TEMPORAL]'

function IntroTerminal({ onComplete }) {
  const { enableAudio, playEffect, playIntroEffect, playIntroCue, playKeyClick, startIntroBoot, fadeOutIntroBoot, startTyping, stopTyping, stopIntroAudio } = useAudio()
  const [started, setStarted] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [crtTurningOn, setCrtTurningOn] = useState(false)
  const [typing, setTyping] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [authStep, setAuthStep] = useState('username')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [loginError, setLoginError] = useState('')
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryToken, setRecoveryToken] = useState('')
  const [recoveryError, setRecoveryError] = useState('')
  const [qrLoading, setQrLoading] = useState(true)
  const [recoveryProcessing, setRecoveryProcessing] = useState(false)
  const [recoveryStage, setRecoveryStage] = useState('VALIDANDO CREDENCIAL')
  const [awaitingAccess, setAwaitingAccess] = useState(false)
  const [characters, setCharacters] = useState(0)
  const completionRef = useRef(onComplete)
  const timersRef = useRef([])

  useEffect(() => { completionRef.current = onComplete }, [onComplete])
  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    stopTyping()
  }, [stopTyping])

  function skipIntro() {
    enableAudio()
    stopIntroAudio()
    completionRef.current()
  }

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
    const timer = window.setTimeout(() => {
      const nextCharacters = characters + 1
      setCharacters(nextCharacters)
      if (nextCharacters >= message.length) {
        setTyping(false)
        stopTyping()
        setAwaitingAccess(true)
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [characters, stopTyping, typing])

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
    queue(() => playIntroCue('stepsInside', 0.16), timeline.insideSteps)
    queue(() => startIntroBoot(), timeline.boot)
    queue(() => playIntroCue('folderFall', 1), timeline.folderFall)
    queue(() => playIntroCue('folderSliding', 0.42), timeline.folderSliding)
    queue(() => playIntroEffect('maleSigh', 0.28), timeline.maleSigh)
    queue(() => { setCrtTurningOn(true); setTerminalVisible(true) }, timeline.terminalLoading)
  }

  function handleLoginKeyDown(event) {
    if (event.key.length === 1 || ['Backspace', 'Enter', 'Tab'].includes(event.key)) playKeyClick()
  }

  function handleLoginSubmit(event) {
    event.preventDefault()
    if (authStep === 'username') {
      if (!username.trim()) return
      setAuthStep('password')
      return
    }
    if (!password.trim()) return
    if (failedAttempts < 2) {
      setFailedAttempts((current) => current + 1)
      setLoginError(ACCESS_DENIED)
      setPassword('')
      setUsername('')
      setAuthStep('username')
      playEffect('error', 0.62)
    }
  }

  function startAuthenticatedSequence() {
    fadeOutIntroBoot()
    setRecoveryOpen(false)
    setRecoveryError('')
    setRecoveryProcessing(false)
    setAuthenticated(true)
    setTyping(true)
    startTyping()
  }

  function handleRecoverySubmit(event) {
    event.preventDefault()
    if (recoveryToken.trim().toUpperCase() !== RECOVERY_TOKEN) {
      setRecoveryError('[ERROR 0x96: TOKEN DE RECUPERACIÓN INVÁLIDO]')
      playEffect('error', 0.52)
      return
    }
    playEffect('success', 0.72)
    setRecoveryError('')
    setRecoveryStage('VALIDANDO CREDENCIAL TEMPORAL')
    setRecoveryProcessing(true)
    queue(() => setRecoveryStage('RECUPERANDO FRAGMENTOS DE OPERADOR...'), 650)
    queue(startAuthenticatedSequence, 3000)
  }

  const archiveUrl = `${window.location.origin}/archives`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=00ff41&bgcolor=031722&data=${encodeURIComponent(archiveUrl)}`

  return <section className={`intro ${started ? 'intro--sequence' : 'intro--idle'} ${terminalVisible ? 'intro--terminal-online' : ''} ${crtTurningOn ? 'intro--crt-turning-on' : ''}`}>
    <IntroSkipHold onSkip={skipIntro} />
    <div className="terminal">
      {!started && <button className="terminal__button terminal__button--init" type="button" data-silent-click onClick={initializeSequence}>&gt; INICIALIZAR SECUENCIA DE ACCESO</button>}
      {terminalVisible && !authenticated && <motion.form key={failedAttempts} className="terminal-login" onSubmit={handleLoginSubmit} animate={loginError ? { x: [0, -12, 12, -8, 8, 0] } : { x: 0 }} transition={{ duration: .42 }}>
        <span className="terminal__label">CANAL SEGURO // AUTENTICACIÓN LOCAL</span>
        <h1>DIVISIÓN_AH</h1>
        <p className="terminal-login__copy">/// TERMINAL SIN CONEXIÓN ///<br />Se requiere identificación del operador.</p>
        <label htmlFor="operator-name">{authStep === 'username' ? 'USUARIO:' : 'CONTRASEÑA:'}</label>
        <input id={authStep === 'username' ? 'operator-name' : 'operator-password'} type={authStep === 'username' ? 'text' : 'password'} value={authStep === 'username' ? username : password} onChange={(event) => authStep === 'username' ? setUsername(event.target.value) : setPassword(event.target.value)} onKeyDown={handleLoginKeyDown} autoFocus autoComplete="off" />
        <button className="terminal__button" type="submit" disabled={failedAttempts >= 2}>&gt; {failedAttempts >= 2 ? 'ACCESO BLOQUEADO' : authStep === 'username' ? 'CONTINUAR' : 'VALIDAR ACCESO'}</button>
        <AnimatePresence>
          {loginError && <motion.p className="terminal-login__error" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{loginError}</motion.p>}
        </AnimatePresence>
        {failedAttempts >= 2 && <button className="terminal__recovery-link" type="button" onClick={() => { setQrLoading(true); setRecoveryOpen(true) }}>[ ¿OLVIDÓ SU TOKEN? INICIAR PROTOCOLO DE RECUPERACIÓN ]</button>}
      </motion.form>}
      {terminalVisible && authenticated && <>
        <span className="terminal__label">CANAL SEGURO // NIVEL DE ACCESO: OPERADOR</span>
        <h1>DIVISIÓN_AH</h1>
        <p className="terminal__story">{typing || characters > 0 ? message.slice(0, characters) : '/// TERMINAL SIN CONEXIÓN // REINTENTANDO ENLACE ///'}<span className="cursor">_</span></p>
        {awaitingAccess && <button className="terminal__access-prompt" type="button" onClick={enterDesk} autoFocus>&gt; PRESIONE ENTER PARA ACCEDER A LA SALA</button>}
      </>}
    </div>
    <AnimatePresence>
      {recoveryOpen && <motion.div className="recovery-overlay" role="dialog" aria-modal="true" aria-labelledby="recovery-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.form className="recovery-panel" onSubmit={handleRecoverySubmit} initial={{ scale: .96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .96, y: 14 }}>
          {!recoveryProcessing && <button className="recovery-panel__close" type="button" onClick={() => setRecoveryOpen(false)} aria-label="Cerrar recuperación">×</button>}
          <span className="terminal__label">ALERTA // BRECHA TEMPORAL DETECTADA</span>
          <h2 id="recovery-title">SERVIDOR DE RESPALDO</h2>
          {recoveryProcessing ? <motion.div className="recovery-panel__validation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p>{recoveryStage}</p>
            <div className="recovery-panel__progress"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3, ease: 'linear' }} /></div>
            <small>RECONSTRUYENDO ENLACE CON EL SECTOR TEMPORAL...</small>
          </motion.div> : <>
            <p>El canal primario fue sellado. Un dispositivo externo puede consultar los registros sobrevivientes.</p>
            <div className="recovery-panel__qr-frame" aria-busy={qrLoading}>
              <AnimatePresence>{qrLoading && <motion.div className="recovery-panel__qr-loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><span>COMPILANDO MATRIZ</span><i /></motion.div>}</AnimatePresence>
              <img className={`recovery-panel__qr ${qrLoading ? 'is-loading' : ''}`} src={qrUrl} alt={`Código QR para abrir ${archiveUrl}`} onLoad={() => setQrLoading(false)} onError={() => setQrLoading(false)} />
            </div>
            <p className="recovery-panel__instruction">ESCANEE DESDE UN DISPOSITIVO EXTERNO PARA ACCEDER AL SERVIDOR DE RESPALDO</p>
            <label htmlFor="recovery-token">TOKEN DE RECUPERACIÓN:</label>
            <input id="recovery-token" value={recoveryToken} onChange={(event) => setRecoveryToken(event.target.value)} onKeyDown={handleLoginKeyDown} autoComplete="off" autoFocus />
            {recoveryError && <p className="terminal-login__error" role="alert">{recoveryError}</p>}
            <button className="terminal__button" type="submit">&gt; VALIDAR TOKEN</button>
          </>}
        </motion.form>
      </motion.div>}
    </AnimatePresence>
  </section>
}

export default IntroTerminal

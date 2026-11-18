import { useEffect, useMemo, useState } from 'react'
import DeskHub from './components/DeskHub'
import IntroTerminal from './components/IntroTerminal'
import WorldQuiz from './components/WorldQuiz'
import CaseTransition from './components/CaseTransition'
import PauseMenu from './components/PauseMenu'
import ArchiveExplorer from './components/ArchiveExplorer'
import AudioProvider from './audio/AudioProvider'
import { useAudio } from './audio/audioContext'
import { caseFiles } from './data/caseFiles'
import { visualEffectDefaults, visualEffectsClassName } from './visual/visualEffects'
import './styles/themes.css'
import './styles/crt-effects.css'
import './App.css'

function Game() {
  const [view, setView] = useState('intro')
  const [activeCaseId, setActiveCaseId] = useState(null)
  const [progress, setProgress] = useState({})
  const [visualEffects, setVisualEffects] = useState(visualEffectDefaults)
  const [pauseOpen, setPauseOpen] = useState(false)
  const activeCase = useMemo(() => caseFiles.find((item) => item.id === activeCaseId), [activeCaseId])
  const theme = activeCase?.theme ?? 'terminal'

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const { enabled, setScene } = useAudio()

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') setPauseOpen((open) => !open)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (!enabled || view === 'intro') return
    setScene(activeCase?.theme ?? 'terminal', Boolean(activeCase))
  }, [activeCase, enabled, setScene, view])

  function openCase(caseFile) { setActiveCaseId(caseFile.id); setView('opening') }
  function closeCase() { setActiveCaseId(null); setView('desk') }
  function toggleVisualEffect(key) {
    setVisualEffects((current) => ({ ...current, [key]: !current[key] }))
  }
  function markLevelSolved(caseId, levelIndex) {
    setProgress((current) => {
      const completedLevels = new Set(current[caseId]?.completedLevels ?? [])
      completedLevels.add(levelIndex)
      return { ...current, [caseId]: { completedLevels: [...completedLevels] } }
    })
  }

  return <main className={`app-shell app-shell--${view} ${visualEffectsClassName(visualEffects)}`}>
    {view === 'intro' && <IntroTerminal onComplete={() => setView('desk')} />}
    {view === 'desk' && <DeskHub caseFiles={caseFiles} progress={progress} onOpenCase={openCase} />}
    {view === 'opening' && activeCase && <CaseTransition caseFile={activeCase} onComplete={() => setView('world')} />}
    {view === 'world' && activeCase && <WorldQuiz key={activeCase.id} caseFile={activeCase} completedLevels={progress[activeCase.id]?.completedLevels ?? []} onSolveLevel={markLevelSolved} onClose={closeCase} />}
    <PauseMenu open={pauseOpen} visualEffects={visualEffects} onToggleEffect={toggleVisualEffect} onClose={() => setPauseOpen(false)} />
  </main>
}

function App() {
  if (window.location.pathname === '/archives') return <ArchiveExplorer />
  return <AudioProvider><Game /></AudioProvider>
}

export default App

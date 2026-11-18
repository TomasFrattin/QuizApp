import { useEffect, useMemo, useState } from 'react'
import AudioControlBar from './components/AudioControlBar'
import DeskHub from './components/DeskHub'
import IntroTerminal from './components/IntroTerminal'
import WorldQuiz from './components/WorldQuiz'
import CaseTransition from './components/CaseTransition'
import VisualFiltersControl from './components/VisualFiltersControl'
import AudioProvider from './audio/AudioProvider'
import { useAudio } from './audio/audioContext'
import { caseFiles } from './data/caseFiles'
import { crtEffectKeys, visualEffectDefaults, visualEffectsClassName } from './visual/visualEffects'
import './styles/themes.css'
import './styles/crt-effects.css'
import './App.css'

function Game() {
  const [view, setView] = useState('intro')
  const [activeCaseId, setActiveCaseId] = useState(null)
  const [progress, setProgress] = useState({})
  const [visualEffects, setVisualEffects] = useState(visualEffectDefaults)
  const activeCase = useMemo(() => caseFiles.find((item) => item.id === activeCaseId), [activeCaseId])
  const theme = activeCase?.theme ?? 'terminal'

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const { enabled, setScene } = useAudio()

  useEffect(() => {
    if (!enabled || view === 'intro') return
    setScene(activeCase?.theme ?? 'terminal', Boolean(activeCase))
  }, [activeCase, enabled, setScene, view])

  function openCase(caseFile) { setActiveCaseId(caseFile.id); setView('opening') }
  function closeCase() { setActiveCaseId(null); setView('desk') }
  function toggleCrtEffects() {
    setVisualEffects((current) => {
      const enabled = !crtEffectKeys.every((key) => current[key])
      return { ...current, ...Object.fromEntries(crtEffectKeys.map((key) => [key, enabled])) }
    })
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
    <AudioControlBar />
    <VisualFiltersControl crtEnabled={crtEffectKeys.every((key) => visualEffects[key])} vignetteEnabled={visualEffects.vignette} onToggleCrt={toggleCrtEffects} onToggleVignette={() => setVisualEffects((current) => ({ ...current, vignette: !current.vignette }))} />
  </main>
}

function App() {
  return <AudioProvider><Game /></AudioProvider>
}

export default App

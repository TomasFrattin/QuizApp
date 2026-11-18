import { useCallback, useEffect, useRef, useState } from 'react'
import { ambienceByScene, effects, introEffects, oceanCreatureCalls, systemAudio } from './audioManifest'
import { AudioContext } from './audioContext'

const clamp = (value) => Math.max(0, Math.min(1, value))

function AudioProvider({ children }) {
  const [enabled, setEnabled] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.65)
  const ambienceRef = useRef(null)
  const typingRef = useRef(null)
  const introCueRef = useRef(null)
  const bootRef = useRef(null)
  const systemHumRef = useRef(null)
  const effectsRef = useRef(new Map())
  const fadeTimersRef = useRef(new Set())
  const sceneRef = useRef(null)
  const lastCreatureRef = useRef(null)
  const creatureTimerRef = useRef(null)
  const scheduleCreatureRef = useRef(null)
  const mutedRef = useRef(muted)
  const volumeRef = useRef(volume)
  const enabledRef = useRef(enabled)

  useEffect(() => { mutedRef.current = muted }, [muted])
  useEffect(() => { volumeRef.current = volume }, [volume])
  useEffect(() => { enabledRef.current = enabled }, [enabled])
  useEffect(() => () => {
    ambienceRef.current?.pause()
    typingRef.current?.pause()
    introCueRef.current?.pause()
    bootRef.current?.audio.pause()
    systemHumRef.current?.audio.pause()
    effectsRef.current.forEach((_, sound) => sound.pause())
    fadeTimersRef.current.forEach((timer) => window.clearInterval(timer))
    window.clearTimeout(creatureTimerRef.current)
  }, [])

  const playFile = useCallback((source, level = 1) => {
    if (!enabledRef.current || mutedRef.current) return
    const sound = new Audio(source)
    sound.volume = clamp(volumeRef.current * level)
    effectsRef.current.set(sound, level)
    sound.addEventListener('ended', () => effectsRef.current.delete(sound), { once: true })
    sound.play().catch(() => effectsRef.current.delete(sound))
    return sound
  }, [])

  const playEffect = useCallback((name, level) => {
    const source = effects[name]
    if (source) playFile(source, level)
  }, [playFile])

  const playIntroEffect = useCallback((name, level) => {
    const source = introEffects[name]
    if (source) playFile(source, level)
  }, [playFile])

  const playIntroCue = useCallback((name, level) => {
    introCueRef.current?.pause()
    introCueRef.current = null
    const source = introEffects[name]
    if (source) introCueRef.current = playFile(source, level)
  }, [playFile])

  const fadeAudio = useCallback((audio, from, to, duration, onComplete) => {
    if (!audio) return
    const startedAt = performance.now()
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / duration)
      const level = from + (to - from) * progress
      audio.volume = mutedRef.current ? 0 : clamp(volumeRef.current * level)
      if (progress === 1) {
        window.clearInterval(timer)
        fadeTimersRef.current.delete(timer)
        onComplete?.()
      }
    }, 40)
    fadeTimersRef.current.add(timer)
  }, [])

  const startIntroBoot = useCallback((level = 0.54) => {
    bootRef.current?.audio.pause()
    const audio = new Audio(introEffects.pcBooting)
    audio.volume = mutedRef.current ? 0 : volumeRef.current * level
    audio.play().catch(() => {})
    bootRef.current = { audio, level }
  }, [])

  const fadeOutIntroBoot = useCallback((duration = 1800) => {
    const boot = bootRef.current
    if (!boot) return
    fadeAudio(boot.audio, boot.level, 0, duration, () => {
      boot.audio.pause()
      if (bootRef.current?.audio === boot.audio) bootRef.current = null
    })
  }, [fadeAudio])

  const startSystemHum = useCallback(() => {
    if (!enabledRef.current || systemHumRef.current) return
    const level = 0.15
    const audio = new Audio(systemAudio.crtHum)
    audio.loop = true
    audio.volume = 0
    audio.play().catch(() => {})
    systemHumRef.current = { audio, level }
    fadeAudio(audio, 0, level, 1800)
  }, [fadeAudio])

  const startTyping = useCallback(() => {
    if (!enabledRef.current || typingRef.current) return
    const typing = new Audio(introEffects.typing)
    typing.loop = true
    typing.volume = mutedRef.current ? 0 : volumeRef.current * 0.32
    typing.play().catch(() => {})
    typingRef.current = typing
  }, [])

  const stopTyping = useCallback(() => {
    typingRef.current?.pause()
    typingRef.current = null
  }, [])

  const stopIntroAudio = useCallback(() => {
    typingRef.current?.pause()
    typingRef.current = null
    introCueRef.current?.pause()
    introCueRef.current = null
    bootRef.current?.audio.pause()
    bootRef.current = null
    fadeTimersRef.current.forEach((timer) => window.clearInterval(timer))
    fadeTimersRef.current.clear()
  }, [])

  const playRandomOceanCreature = useCallback((level = 0.42) => {
    const options = oceanCreatureCalls.filter((call) => call !== lastCreatureRef.current)
    const nextCall = options[Math.floor(Math.random() * options.length)]
    lastCreatureRef.current = nextCall
    playFile(nextCall, level)
  }, [playFile])

  const scheduleCreature = useCallback(() => {
    window.clearTimeout(creatureTimerRef.current)
    if (sceneRef.current !== 'ocean' || !enabledRef.current) return
    const delay = 12000 + Math.random() * 14000
    creatureTimerRef.current = window.setTimeout(() => {
      playRandomOceanCreature(0.42)
      scheduleCreatureRef.current?.()
    }, delay)
  }, [playRandomOceanCreature])
  useEffect(() => { scheduleCreatureRef.current = scheduleCreature }, [scheduleCreature])

  const setScene = useCallback((scene, withTransition = false) => {
    if (sceneRef.current === scene) return
    sceneRef.current = scene
    window.clearTimeout(creatureTimerRef.current)
    const source = ambienceByScene[scene]
    if (!source || !enabledRef.current) return
    startSystemHum()
    const previous = ambienceRef.current
    if (previous) {
      previous.pause()
      previous.currentTime = 0
    }
    const ambience = new Audio(source)
    ambience.loop = true
    ambience.volume = mutedRef.current ? 0 : volumeRef.current * 0.52
    ambience.play().catch(() => {})
    ambienceRef.current = ambience
    if (withTransition) playEffect(scene === 'ocean' ? 'oceanTransition' : 'ballisticsTransition', 0.7)
    if (scene === 'ocean') scheduleCreature()
  }, [playEffect, scheduleCreature, startSystemHum])

  const enableAudio = useCallback(() => {
    // La intro nunca hereda un ambiente de una sesión anterior de HMR.
    ambienceRef.current?.pause()
    ambienceRef.current = null
    typingRef.current?.pause()
    typingRef.current = null
    introCueRef.current?.pause()
    introCueRef.current = null
    bootRef.current?.audio.pause()
    bootRef.current = null
    systemHumRef.current?.audio.pause()
    systemHumRef.current = null
    effectsRef.current.forEach((_, sound) => sound.pause())
    effectsRef.current.clear()
    sceneRef.current = null
    setEnabled(true)
    enabledRef.current = true
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current
      mutedRef.current = next
      if (ambienceRef.current) ambienceRef.current.volume = next ? 0 : volumeRef.current * 0.52
      if (typingRef.current) typingRef.current.volume = next ? 0 : volumeRef.current * 0.32
      if (bootRef.current) bootRef.current.audio.volume = next ? 0 : volumeRef.current * bootRef.current.level
      if (systemHumRef.current) systemHumRef.current.audio.volume = next ? 0 : volumeRef.current * systemHumRef.current.level
      effectsRef.current.forEach((level, sound) => { sound.volume = next ? 0 : volumeRef.current * level })
      return next
    })
  }, [])

  const updateVolume = useCallback((nextVolume) => {
    const normalized = clamp(nextVolume)
    volumeRef.current = normalized
    setVolume(normalized)
    if (ambienceRef.current && !mutedRef.current) ambienceRef.current.volume = normalized * 0.52
    if (typingRef.current && !mutedRef.current) typingRef.current.volume = normalized * 0.32
    if (bootRef.current && !mutedRef.current) bootRef.current.audio.volume = normalized * bootRef.current.level
    if (systemHumRef.current && !mutedRef.current) systemHumRef.current.audio.volume = normalized * systemHumRef.current.level
    if (!mutedRef.current) effectsRef.current.forEach((level, sound) => { sound.volume = normalized * level })
  }, [])

  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.closest('[data-silent-click]')) return
      if (event.target.closest('button, input, [data-audio-click]')) playEffect('click', 0.3)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [playEffect])

  return <AudioContext.Provider value={{ enabled, muted, volume, enableAudio, toggleMuted, updateVolume, setScene, playEffect, playIntroEffect, playIntroCue, playRandomOceanCreature, startTyping, stopTyping, stopIntroAudio, startIntroBoot, fadeOutIntroBoot }}>{children}</AudioContext.Provider>
}

export default AudioProvider

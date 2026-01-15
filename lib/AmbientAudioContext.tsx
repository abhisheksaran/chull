'use client'

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

interface AmbientAudioContextType {
  fadeToSilence: () => void
  fadeToNormal: () => void
  fadeToScene2: () => void
  toggleAudio: () => void
  isInitialized: boolean
  isPlaying: boolean
  isMuted: boolean
}

const AmbientAudioContext = createContext<AmbientAudioContextType | null>(null)

interface AmbientAudioProviderProps {
  children: ReactNode
  audioSrc: string
  baseVolume?: number
  scene2Volume?: number
  silenceVolume?: number
  fadeInDuration?: number
  fadeOutDuration?: number
}

/**
 * Global ambient audio provider using HTMLAudioElement
 * Simple, reliable, works on all browsers
 */
export function AmbientAudioProvider({
  children,
  audioSrc,
  baseVolume = 0.08,
  scene2Volume = 0.12,
  silenceVolume = 0.015,
  fadeInDuration = 7000,
  fadeOutDuration = 3000,
}: AmbientAudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted, user enables with toggle
  const currentVolumeRef = useRef(0)
  const targetVolumeRef = useRef(baseVolume)
  const fadeAnimationFrameRef = useRef<number | null>(null)

  // Smooth easing functions
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  // Initialize audio element
  useEffect(() => {
    if (isInitialized) return

    const audio = new Audio(audioSrc)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0

    audio.addEventListener('error', () => {
      console.warn('Ambient audio: Failed to load', audioSrc)
    })

    audioRef.current = audio
    setIsInitialized(true)

    return () => {
      if (fadeAnimationFrameRef.current) {
        cancelAnimationFrame(fadeAnimationFrameRef.current)
      }
    }
  }, [audioSrc, isInitialized])

  // Smooth volume fade using requestAnimationFrame
  const fadeToVolume = (targetVolume: number, duration: number, useExponential = false) => {
    if (!audioRef.current) return

    const startTime = performance.now()
    const startVolume = currentVolumeRef.current

    if (fadeAnimationFrameRef.current) {
      cancelAnimationFrame(fadeAnimationFrameRef.current)
    }

    const easing = useExponential ? easeOutExpo : easeInOutCubic

    const animate = () => {
      if (!audioRef.current) return

      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easing(progress)
      const newVolume = startVolume + (targetVolume - startVolume) * eased

      audioRef.current.volume = newVolume
      currentVolumeRef.current = newVolume

      if (progress < 1) {
        fadeAnimationFrameRef.current = requestAnimationFrame(animate)
      } else {
        fadeAnimationFrameRef.current = null
      }
    }

    animate()
  }

  // Toggle audio on/off (called by user via toggle button)
  const toggleAudio = () => {
    if (!audioRef.current || !isInitialized) return

    if (isMuted) {
      // Unmute: start playing and fade in
      audioRef.current.play()
        .then(() => {
          setHasStarted(true)
          setIsMuted(false)
          fadeToVolume(targetVolumeRef.current, fadeInDuration)
        })
        .catch(() => {
          // Silently handle
        })
    } else {
      // Mute: fade out to silence then pause
      setIsMuted(true)
      fadeToVolume(0, 1000)
      setTimeout(() => {
        if (audioRef.current && isMuted) {
          audioRef.current.pause()
        }
      }, 1000)
    }
  }

  // Public methods - only apply if not muted
  const fadeToSilence = () => {
    targetVolumeRef.current = silenceVolume
    if (!hasStarted || isMuted) return
    fadeToVolume(silenceVolume, fadeOutDuration, true)
  }

  const fadeToNormal = () => {
    targetVolumeRef.current = baseVolume
    if (!hasStarted || isMuted) return
    fadeToVolume(baseVolume, fadeInDuration)
  }

  const fadeToScene2 = () => {
    targetVolumeRef.current = scene2Volume
    if (!hasStarted || isMuted) return
    fadeToVolume(scene2Volume, 2000)
  }

  return (
    <AmbientAudioContext.Provider
      value={{
        fadeToSilence,
        fadeToNormal,
        fadeToScene2,
        toggleAudio,
        isInitialized,
        isPlaying: hasStarted && !isMuted,
        isMuted,
      }}
    >
      {children}
    </AmbientAudioContext.Provider>
  )
}

export function useAmbientAudioControls() {
  const context = useContext(AmbientAudioContext)
  if (!context) {
    throw new Error('useAmbientAudioControls must be used within AmbientAudioProvider')
  }
  return context
}

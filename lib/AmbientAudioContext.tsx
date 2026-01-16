'use client'

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react'
import { ROOMS } from './rooms'

interface AmbientAudioContextType {
  /** Switch to a specific room's audio with crossfade */
  switchToRoom: (roomId: string | null) => void
  /** Fade to silence (for story pages) */
  fadeToSilence: () => void
  /** Toggle audio on/off */
  toggleAudio: () => void
  /** Current room being played */
  currentRoom: string | null
  isInitialized: boolean
  isPlaying: boolean
  isMuted: boolean
}

const AmbientAudioContext = createContext<AmbientAudioContextType | null>(null)

interface AudioTrack {
  audio: HTMLAudioElement
  roomId: string
  currentVolume: number
}

interface AmbientAudioProviderProps {
  children: ReactNode
  /** Default audio for intro scenes (before entering rooms) */
  defaultAudioSrc?: string
  /** Target volume for room audio (0-1) */
  roomVolume?: number
  /** Crossfade duration in milliseconds */
  crossfadeDuration?: number
  /** Silence volume for story pages */
  silenceVolume?: number
  /** Fade in duration for first play */
  fadeInDuration?: number
}

/**
 * Multi-track ambient audio provider with crossfade support
 * Each room can have its own ambient audio that crossfades when switching rooms
 */
export function AmbientAudioProvider({
  children,
  defaultAudioSrc = '/audio/room-tone.mp3',
  roomVolume = 0.08,
  crossfadeDuration = 3000,
  silenceVolume = 0.015,
  fadeInDuration = 5000,
}: AmbientAudioProviderProps) {
  // Track all loaded audio elements
  const tracksRef = useRef<Map<string, AudioTrack>>(new Map())
  const activeTrackRef = useRef<string | null>(null)
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  
  // Animation frame refs for each track
  const fadeAnimationsRef = useRef<Map<string, number>>(new Map())
  const targetVolumeRef = useRef(roomVolume)

  // Easing function for smooth fades
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Get or create an audio track
  const getOrCreateTrack = useCallback((roomId: string, audioSrc: string): AudioTrack | null => {
    const tracks = tracksRef.current
    
    if (tracks.has(roomId)) {
      return tracks.get(roomId)!
    }

    // Create new track
    try {
      const audio = new Audio(audioSrc)
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0

      audio.addEventListener('error', () => {
        console.warn(`Room audio failed to load: ${audioSrc}`)
      })

      const track: AudioTrack = {
        audio,
        roomId,
        currentVolume: 0,
      }

      tracks.set(roomId, track)
      return track
    } catch (error) {
      console.warn(`Failed to create audio track for ${roomId}:`, error)
      return null
    }
  }, [])

  // Fade a single track to a target volume
  const fadeTrack = useCallback((
    track: AudioTrack,
    targetVolume: number,
    duration: number,
    onComplete?: () => void
  ) => {
    const trackId = track.roomId
    
    // Cancel any existing animation for this track
    const existingAnimation = fadeAnimationsRef.current.get(trackId)
    if (existingAnimation) {
      cancelAnimationFrame(existingAnimation)
    }

    const startTime = performance.now()
    const startVolume = track.currentVolume

    const animate = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeInOutCubic(progress)
      const newVolume = startVolume + (targetVolume - startVolume) * eased

      track.audio.volume = newVolume
      track.currentVolume = newVolume

      if (progress < 1) {
        const frameId = requestAnimationFrame(animate)
        fadeAnimationsRef.current.set(trackId, frameId)
      } else {
        fadeAnimationsRef.current.delete(trackId)
        onComplete?.()
      }
    }

    animate()
  }, [])

  // Initialize with default audio
  useEffect(() => {
    if (isInitialized) return

    // Pre-create the default track
    getOrCreateTrack('_default', defaultAudioSrc)
    setIsInitialized(true)

    return () => {
      // Cleanup all tracks
      fadeAnimationsRef.current.forEach((frameId) => {
        cancelAnimationFrame(frameId)
      })
      tracksRef.current.forEach((track) => {
        track.audio.pause()
      })
    }
  }, [defaultAudioSrc, getOrCreateTrack, isInitialized])

  // Switch to a room's audio with crossfade
  const switchToRoom = useCallback((roomId: string | null) => {
    if (!isInitialized || isMuted) {
      // Just track the room for when audio is enabled
      setCurrentRoom(roomId)
      return
    }

    const trackId = roomId || '_default'
    const room = roomId ? ROOMS[roomId] : null
    const audioSrc = room?.audioSrc || defaultAudioSrc

    // If already on this track, do nothing
    if (activeTrackRef.current === trackId) {
      return
    }

    // Get or create the new track
    const newTrack = getOrCreateTrack(trackId, audioSrc)
    if (!newTrack) return

    // Start playing the new track at volume 0
    newTrack.audio.play().catch(() => {
      // Silently handle autoplay issues
    })

    // Crossfade: fade out current, fade in new
    const currentTrackId = activeTrackRef.current
    if (currentTrackId) {
      const currentTrack = tracksRef.current.get(currentTrackId)
      if (currentTrack) {
        fadeTrack(currentTrack, 0, crossfadeDuration, () => {
          // Pause the old track after fade out
          currentTrack.audio.pause()
        })
      }
    }

    // Fade in the new track
    fadeTrack(newTrack, targetVolumeRef.current, crossfadeDuration)
    
    activeTrackRef.current = trackId
    setCurrentRoom(roomId)
  }, [isInitialized, isMuted, getOrCreateTrack, fadeTrack, crossfadeDuration, defaultAudioSrc])

  // Fade to silence (for story pages)
  const fadeToSilence = useCallback(() => {
    targetVolumeRef.current = silenceVolume
    
    if (!hasStarted || isMuted) return

    const activeTrackId = activeTrackRef.current
    if (activeTrackId) {
      const track = tracksRef.current.get(activeTrackId)
      if (track) {
        fadeTrack(track, silenceVolume, 2000)
      }
    }
  }, [hasStarted, isMuted, fadeTrack, silenceVolume])

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    if (!isInitialized) return

    if (isMuted) {
      // Unmute: start playing the current room's audio
      setIsMuted(false)
      setHasStarted(true)
      targetVolumeRef.current = roomVolume

      const trackId = currentRoom || '_default'
      const room = currentRoom ? ROOMS[currentRoom] : null
      const audioSrc = room?.audioSrc || defaultAudioSrc

      const track = getOrCreateTrack(trackId, audioSrc)
      if (track) {
        track.audio.play()
          .then(() => {
            fadeTrack(track, roomVolume, fadeInDuration)
            activeTrackRef.current = trackId
          })
          .catch(() => {
            // Handle autoplay restriction
          })
      }
    } else {
      // Mute: fade out and pause all tracks
      setIsMuted(true)
      
      tracksRef.current.forEach((track) => {
        fadeTrack(track, 0, 1000, () => {
          track.audio.pause()
        })
      })
      
      activeTrackRef.current = null
    }
  }, [isInitialized, isMuted, currentRoom, getOrCreateTrack, fadeTrack, roomVolume, fadeInDuration, defaultAudioSrc])

  return (
    <AmbientAudioContext.Provider
      value={{
        switchToRoom,
        fadeToSilence,
        toggleAudio,
        currentRoom,
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

// Legacy API compatibility - these map to room switching
export function useLegacyAudioControls() {
  const { switchToRoom, fadeToSilence, toggleAudio, isInitialized, isPlaying, isMuted } = useAmbientAudioControls()
  
  return {
    fadeToNormal: () => switchToRoom(null),
    fadeToScene2: () => switchToRoom(null), // Scene 2 uses default audio
    fadeToSilence,
    toggleAudio,
    isInitialized,
    isPlaying,
    isMuted,
  }
}

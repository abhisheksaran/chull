'use client'

import { useEffect, useRef, useState } from 'react'

interface UseAmbientAudioOptions {
  audioSrc: string
  baseVolume?: number // 0-1, very low for ambient (default: 0.08)
  scene2Volume?: number // Slightly higher for scene 2 (default: 0.12)
  fadeInDuration?: number // milliseconds (default: 7000)
  isScene2Visible?: boolean
}

/**
 * Custom hook for ambient audio with smooth fades and Web Audio API
 * 
 * Features:
 * - Starts silently, waits for user interaction
 * - Smooth fade-in (6-8 seconds) with easing curve
 * - Slightly increases presence in Scene 2
 * - Seamless looping
 * - Mobile-friendly with fallback
 */
export function useAmbientAudio({
  audioSrc,
  baseVolume = 0.08, // Very subtle base volume
  scene2Volume = 0.12, // Slightly more presence in scene 2
  fadeInDuration = 7000, // 7 seconds fade-in
  isScene2Visible = false,
}: UseAmbientAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const targetVolumeRef = useRef(baseVolume)
  const fadeAnimationFrameRef = useRef<number | null>(null)

  // Smooth easing function for natural fade curves
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Initialize Web Audio API
  useEffect(() => {
    if (isInitialized) return

    const initAudio = async () => {
      try {
        // Create audio element
        const audio = new Audio(audioSrc)
        audio.loop = true
        audio.preload = 'auto'
        audio.volume = 0 // Start at zero, we'll control via Web Audio API
        
        // Handle audio loading errors gracefully
        audio.addEventListener('error', (e) => {
          console.warn('Ambient audio file failed to load. Please ensure /audio/ambient.mp3 exists.', e)
        })
        
        // Try to initialize Web Audio API
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
          try {
            const audioContext = new AudioContextClass()
            
            // Resume context if suspended (required for autoplay policies)
            if (audioContext.state === 'suspended') {
              await audioContext.resume()
            }

            const source = audioContext.createMediaElementSource(audio)
            const gainNode = audioContext.createGain()
            
            // Connect: source -> gain -> destination
            source.connect(gainNode)
            gainNode.connect(audioContext.destination)
            
            // Set initial gain to 0 (silent)
            gainNode.gain.value = 0
            
            audioContextRef.current = audioContext
            gainNodeRef.current = gainNode
            sourceNodeRef.current = source
          } catch (webAudioError) {
            // Web Audio API failed, fall back to HTMLAudioElement
            console.warn('Web Audio API unavailable, using HTMLAudioElement fallback:', webAudioError)
          }
        }
        
        audioRef.current = audio
        setIsInitialized(true)
      } catch (error) {
        console.warn('Ambient audio initialization failed:', error)
        setIsInitialized(true) // Mark as initialized even if setup fails
      }
    }

    initAudio()

    return () => {
      // Cleanup
      if (fadeAnimationFrameRef.current) {
        cancelAnimationFrame(fadeAnimationFrameRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [audioSrc, isInitialized])

  // Smooth volume transition function with easing curve
  const fadeToVolume = (targetVolume: number, duration: number) => {
    if (!gainNodeRef.current && !audioRef.current) return

    const startTime = performance.now()
    const startVolume = gainNodeRef.current 
      ? gainNodeRef.current.gain.value 
      : (audioRef.current?.volume || 0)

    // Cancel any ongoing fade
    if (fadeAnimationFrameRef.current) {
      cancelAnimationFrame(fadeAnimationFrameRef.current)
      fadeAnimationFrameRef.current = null
    }

    // For Web Audio API, we use requestAnimationFrame with easing for precise curve control
    // This gives us better control over the fade curve than linear/exponential ramps
    const animate = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeInOutCubic(progress)
      
      const currentVolume = startVolume + (targetVolume - startVolume) * eased

      if (gainNodeRef.current && audioContextRef.current) {
        // Use Web Audio API gain node with precise timing
        // setValueAtTime ensures no clicks or pops
        const currentAudioTime = audioContextRef.current.currentTime
        gainNodeRef.current.gain.setValueAtTime(currentVolume, currentAudioTime)
      } else if (audioRef.current) {
        // Fallback to HTMLAudioElement volume
        audioRef.current.volume = currentVolume
      }

      if (progress < 1) {
        fadeAnimationFrameRef.current = requestAnimationFrame(animate)
      } else {
        fadeAnimationFrameRef.current = null
        targetVolumeRef.current = targetVolume
      }
    }

    animate()
  }

  // Handle user interaction to start audio
  useEffect(() => {
    if (!isInitialized || hasStarted) return

    const handleUserInteraction = async () => {
      if (!audioRef.current || hasStarted) return

      try {
        // Resume audio context if suspended
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume()
        }

        // Start playback
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          await playPromise
        }
        
        setHasStarted(true)

        // Begin slow fade-in
        fadeToVolume(baseVolume, fadeInDuration)
      } catch (error) {
        // Silently handle autoplay restrictions - user can interact again
        console.warn('Ambient audio autoplay blocked (this is normal):', error)
      }
    }

    // Listen for first user interaction
    // Use capture phase for touchstart to catch it early on mobile
    const events = ['scroll', 'touchstart', 'click', 'keydown', 'mousedown']
    const options = { once: true, passive: true, capture: false }
    
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, options)
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [isInitialized, hasStarted, baseVolume, fadeInDuration])

  // Adjust volume based on scene visibility
  useEffect(() => {
    if (!hasStarted) return

    const targetVolume = isScene2Visible ? scene2Volume : baseVolume
    
    // Only fade if target has changed significantly (avoid micro-adjustments)
    if (Math.abs(targetVolume - targetVolumeRef.current) > 0.01) {
      // Smooth transition between scenes (2 seconds)
      fadeToVolume(targetVolume, 2000)
    }
  }, [isScene2Visible, hasStarted, baseVolume, scene2Volume])

  return {
    isPlaying: hasStarted,
    isInitialized,
  }
}


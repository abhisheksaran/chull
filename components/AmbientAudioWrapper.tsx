'use client'

import { AmbientAudioProvider } from '@/lib/AmbientAudioContext'
import { AudioToggle } from '@/components/AudioToggle'
import { ReactNode } from 'react'

export function AmbientAudioWrapper({ children }: { children: ReactNode }) {
  return (
    <AmbientAudioProvider
      defaultAudioSrc="/audio/room-tone.mp3" // Fallback for intro scenes
      roomVolume={0.06} // Room ambient volume (6%)
      silenceVolume={0.01} // Barely audible noise floor for story pages (1%)
      fadeInDuration={5000} // 5 seconds - smooth fade-in when starting
      crossfadeDuration={3000} // 3 seconds - crossfade between rooms
    >
      {children}
      <AudioToggle />
    </AmbientAudioProvider>
  )
}


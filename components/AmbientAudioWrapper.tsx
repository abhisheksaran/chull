'use client'

import { AmbientAudioProvider } from '@/lib/AmbientAudioContext'
import { AudioToggle } from '@/components/AudioToggle'
import { ReactNode } from 'react'

export function AmbientAudioWrapper({ children }: { children: ReactNode }) {
  return (
    <AmbientAudioProvider
      audioSrc="/audio/room-tone.mp3"
      baseVolume={0.04} // Very subtle gallery presence (4%)
      scene2Volume={0.06} // Slightly more presence in "Enter the quiet" (6%)
      silenceVolume={0.01} // Barely audible noise floor for story pages (1%)
      fadeInDuration={7000} // 7 seconds - slow, meditative fade-in
      fadeOutDuration={3000} // 3 seconds - gentle fade to silence
    >
      {children}
      <AudioToggle />
    </AmbientAudioProvider>
  )
}


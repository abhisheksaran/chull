'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAmbientAudioControls } from '@/lib/AmbientAudioContext'
import { useState, useEffect } from 'react'

/**
 * Minimal, poetic audio toggle for the gallery experience
 * Appears in the bottom-right corner with initial label for discoverability
 */
export function AudioToggle() {
  const { toggleAudio, isMuted, isInitialized } = useAmbientAudioControls()
  const [showLabel, setShowLabel] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Hide the label after 6 seconds or on first interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLabel(false)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    toggleAudio()
    setHasInteracted(true)
    setShowLabel(false)
  }

  if (!isInitialized) return null

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 1, ease: 'easeOut' }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
      aria-label={isMuted ? 'Enable ambient sound' : 'Disable ambient sound'}
      style={{ cursor: 'pointer' }}
    >
      {/* Text label - fades out after initial display */}
      <AnimatePresence>
        {showLabel && !hasInteracted && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs tracking-widest uppercase"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.15em',
            }}
          >
            {isMuted ? 'Enable Sound' : 'Sound On'}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        className="relative w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        whileHover={{
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Sound waves icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-opacity duration-500"
          style={{
            color: isMuted ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Speaker base */}
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          
          {/* Sound waves - animate based on state */}
          <motion.path
            d="M15.54 8.46a5 5 0 0 1 0 7.07"
            initial={false}
            animate={{
              opacity: isMuted ? 0 : 1,
              pathLength: isMuted ? 0 : 1,
            }}
            transition={{ duration: 0.4 }}
          />
          <motion.path
            d="M19.07 4.93a10 10 0 0 1 0 14.14"
            initial={false}
            animate={{
              opacity: isMuted ? 0 : 0.6,
              pathLength: isMuted ? 0 : 1,
            }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          
          {/* Mute line */}
          <motion.path
            d="M1 1l22 22"
            initial={false}
            animate={{
              opacity: isMuted ? 0.5 : 0,
              pathLength: isMuted ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
          />
        </svg>

        {/* Subtle pulse when playing */}
        {!isMuted && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Tooltip on hover */}
      <motion.span
        className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs rounded whitespace-nowrap pointer-events-none"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '10px',
          letterSpacing: '0.05em',
        }}
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isMuted ? 'Enable ambient' : 'Mute'}
      </motion.span>
    </motion.button>
  )
}


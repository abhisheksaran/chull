'use client'

import { motion } from 'framer-motion'
import { useAmbientAudioControls } from '@/lib/AmbientAudioContext'

/**
 * Minimal, poetic audio toggle for the gallery experience
 * Appears in the bottom-right corner
 */
export function AudioToggle() {
  const { toggleAudio, isMuted, isInitialized } = useAmbientAudioControls()

  if (!isInitialized) return null

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1.5 }}
      onClick={toggleAudio}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={isMuted ? 'Enable ambient sound' : 'Disable ambient sound'}
      style={{ cursor: 'pointer' }}
    >
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


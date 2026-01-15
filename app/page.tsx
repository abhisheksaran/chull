'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getEmotionColors } from '@/lib/emotionColors'

interface StoryMetadata {
  id: string
  title: string
  subtitle?: string
  emotion: string
  excerpt: string
  excerptHindi?: string
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scene1Ref = useRef<HTMLDivElement>(null)
  const scene2Ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentEmotion, setCurrentEmotion] = useState(0)
  const [stories, setStories] = useState<StoryMetadata[]>([])

  // Intersection Observer for crisp appearance
  const [scene1Visible, setScene1Visible] = useState(true)
  const [scene2Visible, setScene2Visible] = useState(false)

  // Load stories from API
  useEffect(() => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStories(data)
        }
      })
      .catch((error) => {
        console.error('Error loading stories:', error)
      })
  }, [])


  // Intersection Observer for snap-based visibility
  useEffect(() => {
    // Scene 1 is visible by default (first section)
    if (scene1Ref.current) {
      const rect = scene1Ref.current.getBoundingClientRect()
      const isInView = rect.top >= 0 && rect.top < window.innerHeight * 0.2
      setScene1Visible(isInView)
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: [0.8], // Trigger when 80% visible
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target === scene1Ref.current) {
          setScene1Visible(entry.isIntersecting && entry.intersectionRatio >= 0.8)
        }
        if (entry.target === scene2Ref.current) {
          setScene2Visible(entry.isIntersecting && entry.intersectionRatio >= 0.8)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (scene1Ref.current) observer.observe(scene1Ref.current)
    if (scene2Ref.current) observer.observe(scene2Ref.current)

    return () => {
      if (scene1Ref.current) observer.unobserve(scene1Ref.current)
      if (scene2Ref.current) observer.unobserve(scene2Ref.current)
    }
  }, [])


  const emotions = ['melancholy', 'nostalgia', 'introspection', 'passion', 'serenity', 'longing']
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const mouseX = useSpring(mousePosition.x, springConfig)
  const mouseY = useSpring(mousePosition.y, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      })
    }

    // Rotate through emotions on scroll
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const emotionIndex = Math.floor(latest * emotions.length * 2) % emotions.length
      setCurrentEmotion(emotionIndex)
    })

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      unsubscribe()
    }
  }, [scrollYProgress, emotions.length])

  const currentColors = getEmotionColors(emotions[currentEmotion])
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100])

  return (
    <div 
      ref={containerRef} 
      className="relative"
    >
      {/* Grain overlay */}
      <div className="fixed inset-0 grain-overlay pointer-events-none z-50" />

      {/* Phase 1: Deep charcoal background with subtle gradient */}
      <motion.div
        className="fixed inset-0"
        style={{
          background: 'radial-gradient(circle at top, #161822, #0E0F13 70%)',
        }}
      />


      {/* Phase 1: Opening Experience - Snap-to-Center Sections */}
      <div className="relative z-10">
        {/* Scene 1 - SILENCE */}
        <div 
          ref={scene1Ref}
          className="h-screen flex items-center justify-center snap-center"
        >
          <motion.div
            className="text-center px-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: scene1Visible ? 1 : 0,
              scale: scene1Visible ? [1, 1.01, 1] : 1,
            }}
            transition={{
              opacity: { duration: 0.6, ease: 'easeOut' },
              scale: {
                duration: 10,
                repeat: scene1Visible ? Infinity : 0,
                ease: 'easeInOut',
              },
            }}
          >
            {/* Hindi text - fades in with upward drift */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ 
                opacity: scene1Visible ? 1 : 0,
                y: scene1Visible ? 0 : 8,
              }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              <p
                className="hindi-text leading-relaxed mb-4"
                style={{
                  color: '#E8E6E3',
                  letterSpacing: '0.02em',
                  fontSize: 'clamp(21px, 3.5vw, 39px)',
                  fontWeight: 500,
                }}
              >
                यह कोई वेबसाइट नहीं है।
              </p>
              <p
                className="hindi-text leading-relaxed"
                style={{
                  color: '#E8E6E3',
                  letterSpacing: '0.02em',
                  fontSize: 'clamp(21px, 3.5vw, 39px)',
                  fontWeight: 500,
                }}
              >
                यह ठहराव है।
              </p>
            </motion.div>

            {/* English text - fades in after delay, softer whisper */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: scene1Visible ? 1 : 0 }}
              transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
              style={{ marginTop: '0.6em' }}
            >
              <p
                className="font-primary mb-2"
                style={{
                  color: '#E8E6E3',
                  letterSpacing: '0.15em',
                  fontSize: 'clamp(20px, 3.3vw, 36px)',
                  fontWeight: 400,
                  lineHeight: 1.4,
                  opacity: 0.6,
                }}
              >
                This is not a website.
              </p>
              <p
                className="font-primary"
                style={{
                  color: '#E8E6E3',
                  letterSpacing: '0.15em',
                  fontSize: 'clamp(20px, 3.3vw, 36px)',
                  fontWeight: 400,
                  lineHeight: 1.4,
                  opacity: 0.6,
                }}
              >
                This is a pause.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scene 2 - INVITATION (snaps to center) */}
        <div 
          ref={scene2Ref}
          className="h-screen flex items-center justify-center snap-center"
        >
          <motion.div
            className="text-center px-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ 
              opacity: scene2Visible ? 1 : 0,
              y: scene2Visible ? 0 : 12,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
            style={{
              filter: scene2Visible ? 'blur(0px)' : 'blur(8px)',
            }}
          >
            {/* Hindi - slightly bolder */}
            <motion.p
              className="hindi-text mb-6"
              style={{
                color: '#E8E6E3',
                letterSpacing: '0.02em',
                fontWeight: 600,
                fontSize: 'clamp(21px, 3.5vw, 39px)',
                lineHeight: 1.4,
              }}
            >
              चलिए, अंदर चलें।
            </motion.p>

            {/* English - very small, whisper-like */}
            <motion.p
              className="font-primary mb-8"
              style={{
                color: '#E8E6E3',
                letterSpacing: '0.15em',
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontWeight: 400,
                lineHeight: 1.4,
                opacity: 0.6,
              }}
            >
              Enter the quiet.
            </motion.p>

            {/* Blinking cursor indicator with glow */}
            <motion.div
              className="w-px h-12 mx-auto relative"
              style={{
                backgroundColor: '#7B2E3A',
                boxShadow: '0 0 12px rgba(123, 46, 58, 0.2)',
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Stories Section - More Visual */}
      <section className="relative min-h-screen py-32 px-6 z-10 snap-start">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 1 }}
            className="mb-24"
          >
            <motion.h2
              className="display-text text-fluid-3xl md:text-fluid-4xl font-bold text-center mb-6 text-white"
              style={{
                textShadow: `0 0 30px ${currentColors.text}30`,
              }}
            >
              Exhibitions
            </motion.h2>
            <motion.div
              className="h-px w-32 mx-auto"
              style={{
                background: `linear-gradient(to right, transparent, ${currentColors.text}, transparent)`,
              }}
            />
          </motion.div>

          {/* Masonry layout - 3 columns, fills from bottom like water */}
          <MasonryGrid stories={stories} />

          {/* Coming soon placeholder */}
          {stories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="english-text text-fluid-lg text-gray-500 mb-4">
                Stories will appear here
              </p>
              <p className="hindi-text text-fluid-base text-gray-600">
                कहानियाँ यहाँ दिखाई देंगी
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-24 px-6 text-center z-10 border-t border-white/5">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="english-text text-sm text-gray-600 tracking-wide"
        >
          © {new Date().getFullYear()}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="english-text text-xs text-gray-700 mt-2"
        >
          A digital literary art installation
        </motion.p>
      </footer>
    </div>
  )
}

function MasonryGrid({ stories }: { stories: StoryMetadata[] }) {
  const [columns, setColumns] = useState<StoryMetadata[][]>([[], [], []])

  useEffect(() => {
    // Distribute stories to columns based on index (round-robin for 3 columns)
    const cols: StoryMetadata[][] = [[], [], []]
    stories.forEach((story, index) => {
      cols[index % 3].push(story)
    })
    setColumns(cols)
  }, [stories])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {columns.map((columnStories, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6 lg:gap-8">
          {columnStories.map((story) => {
            const globalIndex = stories.findIndex(s => s.id === story.id)
            return (
              <StoryCard 
                key={story.id} 
                story={story} 
                index={globalIndex} 
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function StoryCard({
  story,
  index,
}: {
  story: StoryMetadata
  index: number
}) {
  const colors = getEmotionColors(story.emotion)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        type: 'spring',
        stiffness: 100,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="perspective-1000"
    >
      <Link
        href={`/stories/${story.id}`}
        aria-label={`Read story: ${story.title}`}
        className="block focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-dark-studio rounded-lg"
        style={{
          '--tw-ring-color': colors.text,
        } as React.CSSProperties & { '--tw-ring-color': string }}
      >
        <motion.div
          animate={{
            rotateY: isHovered ? 2 : 0,
            rotateX: isHovered ? -2 : 0,
            scale: isHovered ? 1.03 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative min-h-[400px] rounded-lg overflow-hidden border cursor-pointer group flex flex-col"
          style={{
            background: `linear-gradient(135deg, ${colors.base} 0%, ${colors.accent} 50%, ${colors.base} 100%)`,
            borderColor: `${colors.glow}40`,
            boxShadow: isHovered
              ? `0 20px 60px ${colors.glow}30, 0 0 40px ${colors.glow}20`
              : `0 10px 30px ${colors.glow}10`,
          }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `linear-gradient(135deg, ${colors.glow}20 0%, transparent 50%, ${colors.glow}10 100%)`,
            }}
            animate={{
              backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />

          {/* Content */}
          <div className="relative flex-1 flex flex-col justify-between p-8 md:p-10 z-10">
            <div className="flex-1 flex flex-col justify-start">
              <motion.h2
                className="display-text text-fluid-lg md:text-fluid-xl lg:text-fluid-2xl font-bold mb-2 md:mb-3 leading-tight break-words"
                style={{ color: colors.text }}
                animate={{
                  textShadow: isHovered
                    ? `0 0 30px ${colors.text}60, 0 0 60px ${colors.text}30`
                    : `0 0 10px ${colors.text}30`,
                }}
              >
                {story.title}
              </motion.h2>
              {story.subtitle && (
                <motion.p
                  className="display-text text-fluid-sm md:text-fluid-base font-light mb-4 md:mb-6 break-words italic"
                  style={{ color: `${colors.text}AA` }}
                >
                  {story.subtitle}
                </motion.p>
              )}
            </div>

            {/* Decorative corner element */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32"
              style={{
                background: `radial-gradient(circle at top right, ${colors.glow}20, transparent 70%)`,
              }}
              animate={{
                scale: isHovered ? [1, 1.5, 1] : 1,
                opacity: isHovered ? [0.5, 0.8, 0.5] : 0.3,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.text}60, transparent)`,
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getEmotionColors } from '@/lib/emotionColors'
import { useAmbientAudioControls } from '@/lib/AmbientAudioContext'
import { ROOMS, type Room } from '@/lib/rooms'

interface StoryMetadata {
  id: string
  title: string
  subtitle?: string
  room?: string
  emotion: string
  excerpt: string
  excerptHindi?: string
}

interface RoomWithStories {
  room: Room
  stories: StoryMetadata[]
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
  const [roomsWithStories, setRoomsWithStories] = useState<RoomWithStories[]>([])

  // Intersection Observer for crisp appearance
  const [scene1Visible, setScene1Visible] = useState(true)
  const [scene2Visible, setScene2Visible] = useState(false)

  // Ambient audio controls - fade to scene 2 volume when entering "Enter the quiet"
  const { fadeToNormal, fadeToScene2 } = useAmbientAudioControls()

  // Adjust audio based on scene visibility
  // This also handles fading back to normal when returning from story pages
  useEffect(() => {
    if (scene2Visible) {
      fadeToScene2()
    } else {
      fadeToNormal()
    }
  }, [scene2Visible, fadeToScene2, fadeToNormal])

  // Load stories from API
  useEffect(() => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStories(data)
          
          // Group stories by room
          const roomsMap = new Map<string, StoryMetadata[]>()
          
          data.forEach((story: StoryMetadata) => {
            const roomId = story.room || 'uncategorized'
            if (!roomsMap.has(roomId)) {
              roomsMap.set(roomId, [])
            }
            roomsMap.get(roomId)!.push(story)
          })
          
          // Convert to array and sort by room order
          const roomsList: RoomWithStories[] = []
          Object.values(ROOMS)
            .sort((a, b) => a.order - b.order)
            .forEach((room) => {
              const roomStories = roomsMap.get(room.id) || []
              if (roomStories.length > 0) {
                roomsList.push({ room, stories: roomStories })
              }
            })
          
          setRoomsWithStories(roomsList)
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

      {/* Gallery Rooms Section */}
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

          {/* Render each room */}
          {roomsWithStories.map((roomData, roomIndex) => (
            <RoomSection 
              key={roomData.room.id} 
              roomData={roomData} 
              roomIndex={roomIndex}
              allStories={stories}
            />
          ))}

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

function RoomSection({ 
  roomData, 
  roomIndex,
  allStories 
}: { 
  roomData: RoomWithStories
  roomIndex: number
  allStories: StoryMetadata[]
}) {
  const { room, stories } = roomData
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Update scroll indicators
  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      
      // Calculate active index based on scroll position
      const cardWidth = 400 + 32 // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(newIndex, stories.length - 1))
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollState)
      updateScrollState()
      return () => container.removeEventListener('scroll', updateScrollState)
    }
  }, [stories.length])

  const scrollTo = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 400 + 32
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 400 + 32
      scrollContainerRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: roomIndex * 0.1 }}
      className="mb-40"
    >
      {/* Room Header */}
      <motion.div 
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Room number indicator */}
        <motion.span
          className="inline-block text-xs tracking-[0.3em] text-gray-600 mb-4 uppercase"
          style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
        >
          Room {roomIndex + 1}
        </motion.span>
        
        {/* Hindi name - larger */}
        <h3 
          className="hindi-text text-3xl md:text-4xl lg:text-5xl font-medium mb-2"
          style={{ color: '#E8E6E3' }}
        >
          {room.nameHindi}
        </h3>
        
        {/* English name - smaller, muted */}
        <p 
          className="font-primary text-lg md:text-xl tracking-wide"
          style={{ color: '#E8E6E3', opacity: 0.5 }}
        >
          {room.nameEnglish}
        </p>
        
        {/* Description */}
        {room.description && (
          <p 
            className="font-primary text-sm mt-4 max-w-md mx-auto italic"
            style={{ color: '#E8E6E3', opacity: 0.35 }}
          >
            {room.description}
          </p>
        )}
      </motion.div>

      {/* Horizontal Scroll Gallery */}
      <div className="relative group">
        {/* Left Arrow */}
        <motion.button
          onClick={() => scrollTo('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: 'rgba(20, 20, 25, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: canScrollLeft ? 1 : 0,
            x: canScrollLeft ? 0 : -20,
            pointerEvents: canScrollLeft ? 'auto' : 'none',
          }}
          whileHover={{ scale: 1.1, background: 'rgba(40, 40, 50, 0.9)' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>

        {/* Right Arrow */}
        <motion.button
          onClick={() => scrollTo('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: 'rgba(20, 20, 25, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: canScrollRight ? 1 : 0,
            x: canScrollRight ? 0 : 20,
            pointerEvents: canScrollRight ? 'auto' : 'none',
          }}
          whileHover={{ scale: 1.1, background: 'rgba(40, 40, 50, 0.9)' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>

        {/* Fade edges */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(14, 15, 19, 1), transparent)',
          }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(14, 15, 19, 1), transparent)',
          }}
        />

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide px-12 md:px-24 py-4"
          style={{
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '3rem',
            scrollPaddingRight: '3rem',
          }}
        >
          {stories.map((story, index) => {
            const globalIndex = allStories.findIndex(s => s.id === story.id)
            return (
              <StoryCard 
                key={story.id} 
                story={story} 
                index={globalIndex >= 0 ? globalIndex : index} 
                localIndex={index}
                isActive={index === activeIndex}
              />
            )
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className="w-2 h-2 rounded-full transition-all duration-300 focus:outline-none"
              style={{
                background: index === activeIndex 
                  ? 'rgba(255, 255, 255, 0.8)' 
                  : 'rgba(255, 255, 255, 0.2)',
                transform: index === activeIndex ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Go to story ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function StoryCard({
  story,
  index,
  localIndex,
  isActive = false,
}: {
  story: StoryMetadata
  index: number
  localIndex: number
  isActive?: boolean
}) {
  const colors = getEmotionColors(story.emotion)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: localIndex * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex-shrink-0 perspective-1000"
      style={{
        scrollSnapAlign: 'center',
        width: '400px',
        maxWidth: '85vw',
      }}
    >
      <Link
        href={`/stories/${story.id}`}
        aria-label={`Read story: ${story.title}`}
        className="block focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-dark-studio rounded-xl"
        style={{
          '--tw-ring-color': colors.text,
        } as React.CSSProperties & { '--tw-ring-color': string }}
      >
        <motion.div
          animate={{
            rotateY: isHovered ? 3 : 0,
            rotateX: isHovered ? -3 : 0,
            scale: isHovered ? 1.02 : isActive ? 1 : 0.98,
            opacity: isActive || isHovered ? 1 : 0.7,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative h-[500px] rounded-xl overflow-hidden border cursor-pointer group flex flex-col"
          style={{
            background: `linear-gradient(145deg, ${colors.base} 0%, ${colors.accent} 60%, ${colors.base} 100%)`,
            borderColor: isActive || isHovered ? `${colors.glow}60` : `${colors.glow}30`,
            boxShadow: isHovered
              ? `0 25px 80px ${colors.glow}40, 0 0 60px ${colors.glow}25`
              : isActive 
                ? `0 15px 50px ${colors.glow}25, 0 0 30px ${colors.glow}15`
                : `0 8px 30px ${colors.glow}10`,
          }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `linear-gradient(145deg, ${colors.glow}25 0%, transparent 40%, ${colors.glow}15 100%)`,
            }}
          />

          {/* Content */}
          <div className="relative flex-1 flex flex-col justify-center p-10 md:p-12 z-10">
            <div className="flex-1 flex flex-col justify-center">
              <motion.h2
                className="display-text text-2xl md:text-3xl font-bold mb-4 leading-snug"
                style={{ color: colors.text }}
                animate={{
                  textShadow: isHovered
                    ? `0 0 40px ${colors.text}70, 0 0 80px ${colors.text}40`
                    : `0 0 20px ${colors.text}40`,
                }}
              >
                {story.title}
              </motion.h2>
              {story.subtitle && (
                <motion.p
                  className="display-text text-sm md:text-base font-light italic leading-relaxed"
                  style={{ color: `${colors.text}99` }}
                >
                  {story.subtitle}
                </motion.p>
              )}
            </div>

            {/* Read indicator */}
            <motion.div 
              className="mt-8 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <span 
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: `${colors.text}80` }}
              >
                Read
              </span>
              <motion.div
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={`${colors.text}80`}
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative corner glow */}
          <motion.div
            className="absolute top-0 right-0 w-40 h-40"
            style={{
              background: `radial-gradient(circle at top right, ${colors.glow}30, transparent 70%)`,
            }}
            animate={{
              scale: isHovered ? [1, 1.3, 1] : 1,
              opacity: isHovered ? [0.6, 1, 0.6] : 0.4,
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.text}50, transparent)`,
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

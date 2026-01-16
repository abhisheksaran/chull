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

  // Ambient audio controls - switch audio based on visible room
  const { switchToRoom } = useAmbientAudioControls()

  // Reset to default audio when intro scenes are visible
  useEffect(() => {
    if (scene1Visible || scene2Visible) {
      switchToRoom(null) // Use default ambient for intro
    }
  }, [scene1Visible, scene2Visible, switchToRoom])

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

  // Scroll restoration - scroll to last viewed room when returning from a story
  useEffect(() => {
    if (roomsWithStories.length > 0 && typeof window !== 'undefined') {
      const lastRoom = sessionStorage.getItem('chull-last-room')
      if (lastRoom) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const roomElement = document.getElementById(`room-${lastRoom}`)
          if (roomElement) {
            roomElement.scrollIntoView({ behavior: 'instant' })
          }
          // Clear the saved room after scrolling
          sessionStorage.removeItem('chull-last-room')
        }, 100)
      }
    }
  }, [roomsWithStories])

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

      {/* Gallery Rooms - Each room is a full-screen snap section */}
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
        <div className="h-screen flex items-center justify-center snap-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="english-text text-fluid-lg text-gray-500 mb-4">
              Stories will appear here
            </p>
            <p className="hindi-text text-fluid-base text-gray-600">
              कहानियाँ यहाँ दिखाई देंगी
            </p>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative h-screen flex flex-col items-center justify-center snap-center z-10 border-t border-white/5">
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
  const [isVisible, setIsVisible] = useState(false)
  const [hasRestoredPosition, setHasRestoredPosition] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Audio controls for room-specific ambient sound
  const { switchToRoom } = useAmbientAudioControls()

  // Restore last viewed story position when returning to this room
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasRestoredPosition) {
      const lastRoom = sessionStorage.getItem('chull-last-room')
      const savedIndex = sessionStorage.getItem(`chull-last-story-${room.id}`)
      
      if (lastRoom === room.id && savedIndex !== null) {
        const indexToRestore = parseInt(savedIndex, 10)
        if (!isNaN(indexToRestore) && indexToRestore >= 0 && indexToRestore < stories.length) {
          setActiveIndex(indexToRestore)
          setHasRestoredPosition(true)
          
          // Scroll to the saved position after a brief delay for DOM to be ready
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const container = scrollContainerRef.current
              const cardElement = container.children[indexToRestore + 1] as HTMLElement
              if (cardElement) {
                const containerWidth = container.clientWidth
                const cardWidth = cardElement.offsetWidth
                const scrollPosition = cardElement.offsetLeft - (containerWidth - cardWidth) / 2
                container.scrollTo({ left: scrollPosition, behavior: 'instant' })
              }
            }
          }, 100)
        }
      }
    }
  }, [room.id, stories.length, hasRestoredPosition])

  // Navigate to specific index
  const navigateToIndex = (index: number) => {
    if (index >= 0 && index < stories.length) {
      setActiveIndex(index)
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        // +1 to account for the left spacer element
        const cardElement = container.children[index + 1] as HTMLElement
        if (cardElement) {
          const containerWidth = container.clientWidth
          const cardWidth = cardElement.offsetWidth
          const scrollPosition = cardElement.offsetLeft - (containerWidth - cardWidth) / 2
          container.scrollTo({ left: scrollPosition, behavior: 'smooth' })
        }
      }
    }
  }

  // Handle scroll to detect active card
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const containerCenter = container.scrollLeft + container.clientWidth / 2
      
      let closestIndex = 0
      let closestDistance = Infinity
      
      // Skip first child (left spacer) and last child (right spacer)
      const children = Array.from(container.children)
      children.slice(1, -1).forEach((child, index) => {
        const cardElement = child as HTMLElement
        const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2
        const distance = Math.abs(containerCenter - cardCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })
      
      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex)
      }
    }
  }

  // Keyboard navigation when room is visible
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        navigateToIndex(Math.min(activeIndex + 1, stories.length - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        navigateToIndex(Math.max(activeIndex - 1, 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, activeIndex, stories.length])

  // Scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [activeIndex])

  // Intersection observer for visibility + room audio switching
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setIsVisible(true)
            switchToRoom(room.id)
          } else {
            setIsVisible(false)
          }
        })
      },
      { threshold: [0.5] }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [room.id, switchToRoom])
  
  const canScrollLeft = activeIndex > 0
  const canScrollRight = activeIndex < stories.length - 1

  return (
    <div
      ref={sectionRef}
      id={`room-${room.id}`}
      className="h-screen flex flex-col justify-center snap-center relative z-10"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col h-full justify-center"
      >
        {/* Room Header - Compact */}
        <motion.div 
          className="mb-4 md:mb-6 text-center flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 20,
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Room number indicator */}
          <motion.span
            className="inline-block text-xs tracking-[0.3em] text-gray-600 mb-2 uppercase"
            style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            Room {roomIndex + 1}
          </motion.span>
          
          {/* Hindi name */}
          <h3 
            className="hindi-text text-2xl md:text-3xl lg:text-4xl font-medium mb-1"
            style={{ color: '#E8E6E3' }}
          >
            {room.nameHindi}
          </h3>
          
          {/* English name - smaller, muted */}
          <p 
            className="font-primary text-base md:text-lg tracking-wide"
            style={{ color: '#E8E6E3', opacity: 0.5 }}
          >
            {room.nameEnglish}
          </p>
          
          {/* Description */}
          {room.description && (
            <p 
              className="font-primary text-xs mt-2 max-w-md mx-auto italic"
              style={{ color: '#E8E6E3', opacity: 0.35 }}
            >
              {room.description}
            </p>
          )}
        </motion.div>

        {/* Single Focus Canvas Gallery - Optical center (slightly above mathematical center) */}
        <div className="relative flex-1 flex items-center" style={{ paddingBottom: '5vh' }}>
          {/* Left Arrow - Subtle */}
          <motion.button
            onClick={() => navigateToIndex(activeIndex - 1)}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(20, 20, 25, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: canScrollLeft ? 0.6 : 0,
              pointerEvents: canScrollLeft ? 'auto' : 'none',
            }}
            whileHover={{ opacity: 1, scale: 1.1, background: 'rgba(40, 40, 50, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous artwork"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>

          {/* Right Arrow - Subtle */}
          <motion.button
            onClick={() => navigateToIndex(activeIndex + 1)}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(20, 20, 25, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: canScrollRight ? 0.6 : 0,
              pointerEvents: canScrollRight ? 'auto' : 'none',
            }}
            whileHover={{ opacity: 1, scale: 1.1, background: 'rgba(40, 40, 50, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next artwork"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>

          {/* Deep fade edges for immersion - wider for larger cards */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-20 md:w-40 lg:w-48 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(14, 15, 19, 1) 0%, rgba(14, 15, 19, 0.85) 35%, transparent 100%)',
            }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-20 md:w-40 lg:w-48 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, rgba(14, 15, 19, 1) 0%, rgba(14, 15, 19, 0.85) 35%, transparent 100%)',
            }}
          />

          {/* Single Focus Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-8 md:gap-16 lg:gap-20 overflow-x-auto scrollbar-hide w-full"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Left spacer - allows first card to center (no snap) */}
            <div 
              className="flex-shrink-0" 
              style={{ 
                width: 'calc(50vw - min(42.5vw, 390px))',
                scrollSnapAlign: 'none',
              }}
              aria-hidden="true"
            />
            
            {stories.map((story, index) => {
              const globalIndex = allStories.findIndex(s => s.id === story.id)
              const distanceFromActive = Math.abs(index - activeIndex)
              
              return (
                <FocusedStoryCard 
                  key={story.id} 
                  story={story} 
                  index={globalIndex >= 0 ? globalIndex : index} 
                  localIndex={index}
                  isActive={index === activeIndex}
                  distanceFromActive={distanceFromActive}
                  roomId={room.id}
                  onClick={() => navigateToIndex(index)}
                />
              )
            })}
            
            {/* Right spacer - allows last card to center (no snap) */}
            <div 
              className="flex-shrink-0" 
              style={{ 
                width: 'calc(50vw - min(42.5vw, 390px))',
                scrollSnapAlign: 'none',
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Progress Indicator - Minimal */}
        <div className="flex items-center justify-center gap-3 mt-4 md:mt-6 flex-shrink-0">
          {/* Counter */}
          <span 
            className="text-xs tracking-widest"
            style={{ 
              fontFamily: 'var(--font-geist-mono, monospace)',
              color: 'rgba(255,255,255,0.4)'
            }}
          >
            {activeIndex + 1} / {stories.length}
          </span>
          
          {/* Dots */}
          <div className="flex gap-1.5">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToIndex(index)}
                className="transition-all duration-500 focus:outline-none"
                style={{
                  width: index === activeIndex ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: index === activeIndex 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : 'rgba(255, 255, 255, 0.15)',
                }}
                aria-label={`Go to artwork ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// New focused single-artwork card component
function FocusedStoryCard({
  story,
  index,
  localIndex,
  isActive,
  distanceFromActive,
  roomId,
  onClick,
}: {
  story: StoryMetadata
  index: number
  localIndex: number
  isActive: boolean
  distanceFromActive: number
  roomId: string
  onClick: () => void
}) {
  const colors = getEmotionColors(story.emotion)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('chull-last-room', roomId)
      sessionStorage.setItem(`chull-last-story-${roomId}`, String(localIndex))
    }
  }

  // Calculate visual properties based on distance from active
  // Cinematic depth-of-field: exponential blur for more natural falloff
  const scale = isActive ? 1 : Math.max(0.6, 1 - distanceFromActive * 0.12)
  const opacity = isActive ? 1 : Math.max(0.15, 1 - distanceFromActive * 0.35)
  // Exponential blur curve for cinematic depth-of-field effect
  const blur = isActive ? 0 : Math.min(Math.pow(distanceFromActive, 1.4) * 2.5, 8)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: opacity,
        scale: isHovered && isActive ? 1.02 : scale,
        filter: `blur(${blur}px)`,
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={!isActive ? onClick : undefined}
      className="flex-shrink-0"
      style={{
        scrollSnapAlign: 'center',
        scrollSnapStop: 'always',
        width: 'min(85vw, 780px)',
        cursor: isActive ? 'default' : 'pointer',
      }}
    >
      <Link
        href={isActive ? `/stories/${story.id}` : '#'}
        aria-label={`Read story: ${story.title}`}
        onClick={(e) => {
          if (!isActive) {
            e.preventDefault()
            onClick()
          } else {
            handleClick()
          }
        }}
        className="block focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-dark-studio rounded-2xl"
        style={{
          '--tw-ring-color': colors.text,
          pointerEvents: isActive ? 'auto' : 'none',
        } as React.CSSProperties & { '--tw-ring-color': string }}
      >
        <motion.div
          animate={{
            rotateY: isHovered && isActive ? 2 : 0,
            rotateX: isHovered && isActive ? -2 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative rounded-2xl overflow-hidden border cursor-pointer group"
          style={{
            height: 'min(68vh, 650px)',
            background: `linear-gradient(155deg, ${colors.base} 0%, ${colors.accent} 50%, ${colors.base} 100%)`,
            borderColor: isActive 
              ? `${colors.glow}45` 
              : `${colors.glow}10`,
            boxShadow: isActive
              ? `0 40px 120px ${colors.glow}40, 0 0 100px ${colors.glow}25, inset 0 0 80px ${colors.glow}06`
              : `0 15px 50px ${colors.glow}08`,
          }}
        >
          {/* Ambient glow overlay for active card - enhanced presence */}
          {isActive && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                background: `radial-gradient(ellipse 80% 60% at center 40%, ${colors.glow}10 0%, transparent 70%)`,
              }}
            />
          )}

          {/* Hover gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `linear-gradient(155deg, ${colors.glow}20 0%, transparent 40%, ${colors.glow}10 100%)`,
            }}
          />

          {/* Content - with typographic breathing room */}
          <div className="relative flex flex-col justify-center h-full p-10 md:p-14 lg:p-16 z-10">
            <div className="flex-1 flex flex-col justify-center">
              {/* Title - content-aware typography */}
              <motion.h2
                className={`card-title font-medium mb-6 md:mb-8 ${
                  story.title.length < 80 
                    ? 'card-title--short' 
                    : story.title.length < 200 
                      ? 'card-title--medium' 
                      : 'card-title--long'
                }`}
                style={{ 
                  color: colors.text,
                  textShadow: isActive ? `0 0 50px ${colors.text}35` : 'none',
                }}
              >
                {story.title}
              </motion.h2>
              
              {/* Subtitle - with proper spacing */}
              {story.subtitle && (
                <motion.p
                  className="display-text text-sm md:text-base lg:text-lg font-light italic leading-relaxed max-w-[32ch]"
                  style={{ 
                    color: `${colors.text}75`,
                    lineHeight: 1.7,
                  }}
                >
                  {story.subtitle}
                </motion.p>
              )}
            </div>

            {/* Read indicator - only on active, positioned at bottom */}
            {isActive && (
              <motion.div 
                className="mt-auto pt-8 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0.4 }}
                transition={{ duration: 0.4 }}
              >
                <span 
                  className="text-xs tracking-[0.35em] uppercase"
                  style={{ color: `${colors.text}70` }}
                >
                  Enter
                </span>
                <motion.div
                  animate={{ x: isHovered ? 8 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={`${colors.text}70`}
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Corner glow - larger for enhanced presence */}
          <motion.div
            className="absolute top-0 right-0 w-56 h-56 md:w-80 md:h-80"
            style={{
              background: `radial-gradient(circle at top right, ${colors.glow}20, transparent 70%)`,
            }}
            animate={{
              scale: isHovered && isActive ? [1, 1.15, 1] : 1,
              opacity: isActive ? 0.5 : 0.15,
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Bottom accent */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.text}40, transparent)`,
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}


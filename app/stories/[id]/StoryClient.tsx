'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getEmotionColors } from '@/lib/emotionColors'

export interface StorySection {
  type: 'text' | 'image'
  content?: string
  contentHindi?: string
  image?: string
  alignment?: 'left' | 'right' | 'center'
}

export interface Story {
  id: string
  title: string
  subtitle?: string
  emotion: string
  sections: StorySection[]
}

export default function StoryClient({ story }: { story: Story }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const colors = getEmotionColors(story.emotion)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${colors.base}, #0a0a0a, ${colors.base})`,
      }}
    >
      {/* Grain overlay */}
      <div className="fixed inset-0 grain-overlay pointer-events-none z-50" />

      {/* Parallax background glow */}
      <motion.div
        className="fixed top-1/2 left-1/2 w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
          backgroundColor: `${colors.glow}1A`,
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-8 left-8 z-40"
      >
        <Link href="/" aria-label="Back to gallery">
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full backdrop-blur-studio border transition-all duration-300 english-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-studio"
            style={{
              backgroundColor: `${colors.accent}4D`,
              borderColor: `${colors.glow}4D`,
              color: colors.text,
              '--tw-ring-color': colors.text,
            } as React.CSSProperties & { '--tw-ring-color': string }}
            onHoverStart={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.backgroundColor = `${colors.accent}80`
              }
            }}
            onHoverEnd={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.backgroundColor = `${colors.accent}4D`
              }
            }}
          >
            ← Back
          </motion.button>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            className="display-text text-fluid-2xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            {story.title}
          </motion.h1>
          {story.subtitle && (
            <motion.p
              className="display-text text-fluid-lg font-light mb-12 italic"
              style={{ color: `${colors.text}AA` }}
            >
              {story.subtitle}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* Story Sections */}
      <section className="relative py-32 px-6 z-10">
        <div className="max-w-5xl mx-auto space-y-32">
          {story.sections.map((section, index) => (
            <StorySection
              key={index}
              section={section}
              index={index}
              colors={colors}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 text-center z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="english-text text-sm"
          style={{ color: `${colors.text}80` }}
        >
          © {new Date().getFullYear()} Chull
        </motion.p>
      </footer>
    </div>
  )
}

function StorySection({
  section,
  index,
  colors,
  scrollProgress,
}: {
  section: StorySection
  index: number
  colors: ReturnType<typeof getEmotionColors>
  scrollProgress: any
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(sectionProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(sectionProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50])

  if (section.type === 'image' && section.image) {
    return (
      <motion.div
        ref={sectionRef}
        style={{ opacity, y }}
        className="relative w-full h-[600px] rounded-lg overflow-hidden"
      >
        {/* Placeholder for image - in production, use next/image */}
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(to bottom right, ${colors.accent}, ${colors.base})`,
          }}
        />
      </motion.div>
    )
  }

  const alignmentClasses = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center mx-auto',
  }

  return (
    <motion.div
      ref={sectionRef}
      style={{ opacity, y }}
      className={`max-w-3xl ${alignmentClasses[section.alignment || 'center']}`}
    >
      {section.content && (
        <motion.p
          className="english-text text-fluid-lg mb-6 leading-relaxed"
          style={{ color: `${colors.text}E6` }}
        >
          {section.content}
        </motion.p>
      )}
      {section.contentHindi && (
        <motion.p
          className="hindi-text text-fluid-lg leading-relaxed"
          style={{ color: `${colors.text}CC` }}
        >
          {section.contentHindi}
        </motion.p>
      )}
    </motion.div>
  )
}


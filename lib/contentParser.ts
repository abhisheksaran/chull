/**
 * Content parser for reading stories from markdown files
 */

import fs from 'fs'
import path from 'path'
import { assignEmotionColor } from './emotionColors'

// Check if we're in a Node.js environment
const isNode = typeof process !== 'undefined' && process.versions?.node

export interface StorySection {
  type: 'text' | 'image'
  content?: string
  contentHindi?: string
  image?: string
  alignment?: 'left' | 'right' | 'center'
}

export interface StoryMetadata {
  id: string
  title: string
  subtitle?: string
  room?: string
  emotion: string
  excerpt: string
  excerptHindi?: string
}

export interface Story {
  id: string
  title: string
  subtitle?: string
  room?: string
  emotion: string
  sections: StorySection[]
}

/**
 * Parse markdown content into story sections
 * Groups English and Hindi text together, creating new sections when we have both and hit an empty line
 */
function parseMarkdown(content: string): StorySection[] {
  const sections: StorySection[] = []
  const lines = content.split('\n')

  let currentContent: string[] = []
  let currentContentHindi: string[] = []
  let lastWasEmpty = false

  const finalizeSection = () => {
    if (currentContent.length || currentContentHindi.length) {
      const section: StorySection = {
        type: 'text',
        alignment: 'center',
        content: currentContent.join('\n').trim() || undefined,
        contentHindi: currentContentHindi.join('\n').trim() || undefined,
      }
      if (section.content || section.contentHindi) {
        sections.push(section)
      }
      currentContent = []
      currentContentHindi = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Image detection
    if (trimmedLine.startsWith('![') && trimmedLine.includes('](')) {
      // Finalize any current text section
      finalizeSection()

      // Extract image path
      const imageMatch = trimmedLine.match(/\]\(([^)]+)\)/)
      if (imageMatch) {
        sections.push({
          type: 'image',
          image: imageMatch[1],
        })
      }
      lastWasEmpty = false
      continue
    }

    // Empty line
    if (!trimmedLine) {
      // If we have content and hit an empty line
      if (currentContent.length || currentContentHindi.length) {
        // If we have both English and Hindi, finalize immediately (they're a pair)
        if (currentContent.length && currentContentHindi.length) {
          finalizeSection()
        } 
        // If last line was also empty (double empty line = section break)
        else if (lastWasEmpty) {
          finalizeSection()
        }
        // For single empty line: peek ahead to see if next non-empty line is different type
        // If next line is same type or empty, we should finalize
        else {
          // Look ahead for next non-empty line
          let nextNonEmptyLine: string | null = null
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j].trim()
            if (nextLine) {
              nextNonEmptyLine = nextLine
              break
            }
          }
          
          if (nextNonEmptyLine) {
            const nextIsHindi = /[\u0900-\u097F]/.test(nextNonEmptyLine)
            const hasEnglish = currentContent.length > 0
            const hasHindi = currentContentHindi.length > 0
            
            // If types match (both English or both Hindi), finalize current section
            // If types don't match, they might be a pair, so keep them together
            if ((hasEnglish && !nextIsHindi) || (hasHindi && nextIsHindi)) {
              finalizeSection()
            }
          } else {
            // No more content, finalize
            finalizeSection()
          }
        }
      }
      lastWasEmpty = true
      continue
    }

    // We have content
    lastWasEmpty = false

    // Check if line is Hindi (contains Devanagari characters)
    const isHindi = /[\u0900-\u097F]/.test(trimmedLine)

    if (isHindi) {
      currentContentHindi.push(trimmedLine)
    } else {
      currentContent.push(trimmedLine)
    }
  }

  // Finalize last section
  finalizeSection()

  return sections.filter((s) => s.content || s.contentHindi || s.image)
}


/**
 * Extract title from content if marked with ==title== syntax
 * Also removes the title text from the content if it appears in the body
 * Returns { title, subtitle, room, remainingContent }
 * Stories are single-language: if Hindi, title is Hindi; if English, title is English
 * Room is specified with == room: roomId == syntax
 */
function extractTitleFromContent(content: string): {
  title: string
  subtitle?: string
  room?: string
  remainingContent: string
} {
  const lines = content.split('\n')
  const firstLine = lines[0]?.trim() || ''
  
  // Check if first line is marked as title with ==text==
  // Allow for spaces around the == markers
  const titleMatch = firstLine.match(/^==\s*(.+?)\s*==$/)
  if (titleMatch) {
    const titleText = titleMatch[1].trim()
    
    let extractedTitle = ''
    let extractedSubtitle: string | undefined = undefined
    let extractedRoom: string | undefined = undefined
    let remainingLines: string[] = []
    
    // Check second line for another title marker (subtitle)
    const secondLine = lines[1]?.trim() || ''
    const secondTitleMatch = secondLine.match(/^==\s*(.+?)\s*==$/)
    
    if (secondTitleMatch) {
      // Both lines are title markers - first is title, second is subtitle
      extractedTitle = titleText
      extractedSubtitle = secondTitleMatch[1].trim()
      
      // Check third line for room marker == room: roomId ==
      const thirdLine = lines[2]?.trim() || ''
      const roomMatch = thirdLine.match(/^==\s*room:\s*(.+?)\s*==$/)
      if (roomMatch) {
        extractedRoom = roomMatch[1].trim().toLowerCase()
        remainingLines = lines.slice(3)
      } else {
        remainingLines = lines.slice(2)
      }
    } else {
      // Only first line is title, check if second line is room
      const roomMatch = secondLine.match(/^==\s*room:\s*(.+?)\s*==$/)
      if (roomMatch) {
        extractedTitle = titleText
        extractedRoom = roomMatch[1].trim().toLowerCase()
        remainingLines = lines.slice(2)
      } else {
        extractedTitle = titleText
        remainingLines = lines.slice(1)
      }
    }
    
    // Remove the title text from the remaining content if it appears
    // This prevents the title from appearing twice (once as title, once in content)
    // Normalize title text for comparison (remove extra spaces, punctuation, case)
    const normalizeText = (text: string) => 
      text.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[.,;:!?]/g, '')
        .trim()
    
    const normalizedTitle = normalizeText(extractedTitle)
    
    // Extract key phrases from title (first 10-15 words) for matching
    const getKeyPhrase = (text: string, wordCount: number = 12) => {
      const words = normalizeText(text).split(' ').filter(w => w.length > 2)
      return words.slice(0, wordCount).join(' ')
    }
    
    const titleKeyPhrase = getKeyPhrase(extractedTitle)
    
    const remainingContent = remainingLines
      .map((line) => {
        const trimmed = line.trim()
        if (!trimmed) return line // Keep empty lines
        
        const normalizedLine = normalizeText(trimmed)
        
        // Remove if the line exactly matches the title
        if (normalizedLine === normalizedTitle) {
          return '' // Remove the line
        }
        
        // Remove if the line contains the title as a complete sentence/phrase
        // Check if the key phrase appears in the line (indicating title repetition)
        if (titleKeyPhrase.length > 20 && normalizedLine.includes(titleKeyPhrase)) {
          // If the title phrase appears and takes up a significant portion of the line
          const phraseRatio = titleKeyPhrase.length / Math.max(normalizedLine.length, 1)
          if (phraseRatio > 0.5) {
            // Title is a major part of this line, remove it
            return ''
          }
          // If title appears, try to remove just that sentence
          // Split by sentence boundaries and remove sentences containing the title
          const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim())
          const filteredSentences = sentences.filter(sentence => {
            const normalizedSentence = normalizeText(sentence)
            return !normalizedSentence.includes(titleKeyPhrase)
          })
          if (filteredSentences.length < sentences.length) {
            // Some sentences were removed, return the remaining ones
            return filteredSentences.join('. ').trim() + (filteredSentences.length > 0 ? '.' : '')
          }
        }
        
        return line
      })
      .filter((line, index, arr) => {
        // Remove empty lines that were created by removing title text
        // But keep intentional empty lines (paragraph breaks)
        if (!line.trim()) {
          // Keep if it's not immediately after another empty line
          return index === 0 || arr[index - 1].trim() !== ''
        }
        return true
      })
      .join('\n')
    
    return {
      title: extractedTitle,
      subtitle: extractedSubtitle,
      room: extractedRoom,
      remainingContent,
    }
  }
  
  // No title marker, use filename as fallback
  return {
    title: '',
    remainingContent: content,
  }
}

/**
 * Parse a simple text file (no frontmatter, just content)
 */
function parseTextFile(filePath: string): Story | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fileName = path.basename(filePath, path.extname(filePath))
    
    // Extract title from content if marked
    const { title: extractedTitle, subtitle: extractedSubtitle, room: extractedRoom, remainingContent } = 
      extractTitleFromContent(content)
    
    // Use extracted title or fallback to filename
    const id = fileName
    const title = extractedTitle || 
      fileName
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    const subtitle = extractedSubtitle
    const room = extractedRoom

    // Parse sections from remaining content (after title is removed)
    const sections = parseMarkdown(remainingContent)

    // Generate excerpt from first section
    const excerpt = sections[0]?.content?.substring(0, 100) + '...' || 
                    sections[0]?.contentHindi?.substring(0, 100) + '...' || ''

    return {
      id,
      title,
      subtitle,
      room,
      emotion: '', // Will be assigned later based on index
      sections,
    }
  } catch (error) {
    console.error(`Error parsing text file ${filePath}:`, error)
    return null
  }
}

/**
 * Get all stories from content directory
 * Only supports .txt files
 */
export function getAllStories(): Story[] {
  // Only run in Node.js environment (server-side)
  if (!isNode) {
    return []
  }

  try {
    const contentDir = path.join(process.cwd(), 'content', 'stories')

    if (!fs.existsSync(contentDir)) {
      return []
    }

    // Get only .txt files
    const txtFiles = fs.readdirSync(contentDir).filter((file) => file.endsWith('.txt'))

    const stories = txtFiles
      .map((file) => parseTextFile(path.join(contentDir, file)))
      .filter((story): story is Story => story !== null)
      .map((story, index) => ({
        ...story,
        emotion: assignEmotionColor(index),
      }))

    return stories
  } catch (error) {
    console.error('Error reading stories directory:', error)
    return []
  }
}

/**
 * Get story metadata for listing
 */
export function getStoryMetadata(story: Story): StoryMetadata {
  // Generate excerpt from first section if not provided
  const firstSection = story.sections[0]
  let excerpt = ''
  let excerptHindi = ''
  
  if (firstSection) {
    if (firstSection.content && firstSection.content.trim()) {
      excerpt = firstSection.content.substring(0, 100) + '...'
    } else if (firstSection.contentHindi && firstSection.contentHindi.trim()) {
      excerpt = firstSection.contentHindi.substring(0, 100) + '...'
    }
    
    if (firstSection.contentHindi && firstSection.contentHindi.trim()) {
      excerptHindi = firstSection.contentHindi.substring(0, 100) + '...'
    }
  }

  return {
    id: story.id,
    title: story.title,
    subtitle: story.subtitle,
    room: story.room,
    emotion: story.emotion,
    excerpt,
    excerptHindi,
  }
}


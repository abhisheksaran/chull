/**
 * Emotion detection using sentiment analysis
 * Analyzes text to determine emotional tone
 */

export type EmotionType =
  | 'melancholy'
  | 'nostalgia'
  | 'introspection'
  | 'passion'
  | 'serenity'
  | 'longing'

interface EmotionScore {
  emotion: EmotionType
  score: number
}

/**
 * Simple keyword-based emotion detection
 * In production, you could use an API like:
 * - Google Cloud Natural Language API
 * - AWS Comprehend
 * - MeaningCloud Sentiment Analysis
 * - Or a local ML model
 */
export function detectEmotion(text: string): EmotionType {
  const lowerText = text.toLowerCase()

  // Emotion keywords with weights
  const emotionKeywords: Record<EmotionType, string[]> = {
    melancholy: [
      'loss', 'empty', 'fade', 'disappear', 'gone', 'alone', 'silence',
      'dark', 'sad', 'lonely', 'abandon', 'end', 'final', 'last', 'never',
      'हानि', 'खाली', 'गायब', 'अकेला', 'चुप्पी', 'अंधेरा', 'दुख',
    ],
    nostalgia: [
      'remember', 'memory', 'past', 'once', 'used to', 'recall', 'reminisce',
      'old', 'childhood', 'yesterday', 'ago', 'before', 'then',
      'याद', 'पुराना', 'बचपन', 'पहले', 'कभी',
    ],
    introspection: [
      'question', 'wonder', 'think', 'reflect', 'contemplate', 'consider',
      'meaning', 'purpose', 'truth', 'realize', 'understand', 'philosophy',
      'सोच', 'प्रश्न', 'अर्थ', 'सच', 'समझ',
    ],
    passion: [
      'intense', 'fire', 'burn', 'desire', 'crave', 'yearn', 'love', 'hate',
      'strong', 'powerful', 'fierce', 'wild', 'urgent', 'desperate',
      'इच्छा', 'आग', 'प्रेम', 'तीव्र', 'शक्तिशाली',
    ],
    serenity: [
      'calm', 'peace', 'quiet', 'still', 'tranquil', 'gentle', 'soft',
      'breeze', 'flow', 'smooth', 'ease', 'comfort', 'warm',
      'शांति', 'शांत', 'कोमल', 'आराम',
    ],
    longing: [
      'wish', 'hope', 'want', 'miss', 'ache', 'yearn', 'dream', 'wait',
      'far', 'distant', 'away', 'someday', 'maybe', 'if only',
      'इच्छा', 'उम्मीद', 'सपना', 'दूर', 'शायद',
    ],
  }

  const scores: EmotionScore[] = Object.entries(emotionKeywords).map(
    ([emotion, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        const matches = lowerText.match(regex)
        return acc + (matches ? matches.length : 0)
      }, 0)

      return {
        emotion: emotion as EmotionType,
        score,
      }
    }
  )

  // Find emotion with highest score
  const detected = scores.reduce((prev, current) =>
    current.score > prev.score ? current : prev
  )

  // If no keywords found, default to introspection (neutral, thoughtful)
  return detected.score > 0 ? detected.emotion : 'introspection'
}

/**
 * Enhanced detection using text characteristics
 */
export function detectEmotionAdvanced(text: string): EmotionType {
  const lowerText = text.toLowerCase()
  const wordCount = text.split(/\s+/).length
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1)

  // Long, flowing sentences suggest serenity or introspection
  if (avgWordsPerSentence > 20) {
    if (lowerText.includes('calm') || lowerText.includes('peace')) {
      return 'serenity'
    }
    return 'introspection'
  }

  // Short, fragmented sentences suggest melancholy or passion
  if (avgWordsPerSentence < 10) {
    if (
      lowerText.includes('fire') ||
      lowerText.includes('burn') ||
      lowerText.includes('intense')
    ) {
      return 'passion'
    }
    return 'melancholy'
  }

  // Default to keyword-based detection
  return detectEmotion(text)
}


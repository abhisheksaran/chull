export const emotionColorMap = {
  melancholy: {
    base: '#1a1a2e',
    accent: '#16213e',
    glow: '#0f3460',
    text: '#e94560',
  },
  nostalgia: {
    base: '#2d1b3d',
    accent: '#3d2a4f',
    glow: '#4a3a5a',
    text: '#d4a574',
  },
  introspection: {
    base: '#0d1b2a',
    accent: '#1b263b',
    glow: '#415a77',
    text: '#778da9',
  },
  passion: {
    base: '#2d0a1a',
    accent: '#4a0e2e',
    glow: '#6b1a3a',
    text: '#c41e3a',
  },
  serenity: {
    base: '#0a1929',
    accent: '#132f4c',
    glow: '#1e4976',
    text: '#4fc3f7',
  },
  longing: {
    base: '#1a0d1a',
    accent: '#2d1a2d',
    glow: '#3d2a3d',
    text: '#b886d9',
  },
} as const

export type EmotionType = keyof typeof emotionColorMap

const emotionTypes: EmotionType[] = [
  'melancholy',
  'nostalgia',
  'introspection',
  'passion',
  'serenity',
  'longing',
]

/**
 * Assign emotion color based on story index (cycles through colors)
 * This ensures visual variety while maintaining consistency
 */
export function assignEmotionColor(index: number): EmotionType {
  return emotionTypes[index % emotionTypes.length]
}

export function getEmotionColors(emotion: string) {
  return emotionColorMap[emotion as EmotionType] || emotionColorMap.melancholy
}


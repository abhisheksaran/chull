/**
 * Server-side function to get stories
 * This will be used in Next.js server components
 */

import { getAllStories, getStoryMetadata, type Story, type StoryMetadata } from './contentParser'

let cachedStories: Story[] | null = null
let cachedMetadata: StoryMetadata[] | null = null

export function getStories(): Story[] {
  if (cachedStories) {
    return cachedStories
  }

  try {
    cachedStories = getAllStories()
    return cachedStories
  } catch (error) {
    console.error('Error loading stories:', error)
    return []
  }
}

export function getStoriesMetadata(): StoryMetadata[] {
  if (cachedMetadata) {
    return cachedMetadata
  }

  const stories = getStories()
  cachedMetadata = stories.map(getStoryMetadata)
  return cachedMetadata
}

export function getStoryById(id: string): Story | null {
  const stories = getStories()
  return stories.find((s) => s.id === id) || null
}


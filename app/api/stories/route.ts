/**
 * API route to fetch stories
 * This allows client-side fetching of stories
 */

import { NextResponse } from 'next/server'
import { getStoriesMetadata, getStoryById } from '@/lib/getStories'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const story = getStoryById(id)
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }
    return NextResponse.json(story)
  }

  const stories = getStoriesMetadata()
  return NextResponse.json(stories)
}


import { notFound } from 'next/navigation'
import { getStoryById } from '@/lib/getStories'
import StoryClient from './StoryClient'

export async function generateStaticParams() {
  try {
    const { getStories } = await import('@/lib/getStories')
    const stories = getStories()
    return stories.map((story) => ({
      id: story.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = getStoryById(params.id)

  if (!story) {
    notFound()
  }

  return <StoryClient story={story} />
}

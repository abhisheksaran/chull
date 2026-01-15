# Content Guide

## Adding New Stories

### Method 1: Direct Code (Quick)

Edit `/app/stories/[id]/page.tsx` and add your story to the `stories` object:

```typescript
const stories: Record<string, Story> = {
  'your-story-id': {
    title: 'Your Story Title',
    titleHindi: 'आपकी कहानी का शीर्षक',
    emotion: 'melancholy', // or 'nostalgia', 'introspection', 'passion', 'serenity', 'longing'
    sections: [
      {
        type: 'text',
        content: 'Your English text here...',
        contentHindi: 'आपका हिंदी पाठ यहाँ...',
        alignment: 'center', // or 'left', 'right'
      },
      {
        type: 'image',
        image: '/photos/your-image.jpg',
      },
      // ... more sections
    ],
  },
}
```

Then add it to the stories array in `/app/page.tsx`:

```typescript
const stories = [
  // ... existing stories
  {
    id: 'your-story-id',
    title: 'Your Story Title',
    titleHindi: 'आपकी कहानी का शीर्षक',
    emotion: 'melancholy',
    excerpt: 'A brief description',
    excerptHindi: 'संक्षिप्त विवरण',
  },
]
```

### Method 2: Markdown Files (Recommended for Future)

1. Create a markdown file: `/content/stories/your-story.md`
2. Add frontmatter:

```markdown
---
id: your-story-id
title: Your Story Title
titleHindi: आपकी कहानी का शीर्षक
emotion: melancholy
excerpt: A brief description
excerptHindi: संक्षिप्त विवरण
---

## Section 1

Your English text here...

आपका हिंदी पाठ यहाँ...

![Image alt](/photos/your-image.jpg)
```

3. Update the content loader to parse markdown files.

## Emotional Tones

Choose the emotion that best matches your story's mood:

- **melancholy**: Deep, sorrowful, contemplative
- **nostalgia**: Warm, wistful, remembering
- **introspection**: Thoughtful, reflective, philosophical
- **passion**: Intense, fiery, emotional
- **serenity**: Calm, peaceful, tranquil
- **longing**: Yearning, wistful, desiring

## Text Alignment

- **center**: For impactful, standalone statements
- **left**: For narrative flow (default reading)
- **right**: For poetic, unconventional layouts

## Adding Photos

1. Place images in `/public/photos/`
2. Reference them in sections:

```typescript
{
  type: 'image',
  image: '/photos/your-image.jpg',
}
```

3. Use descriptive filenames for organization.

## Best Practices

1. **Mix languages naturally**: Don't translate word-for-word. Let Hindi and English complement each other.
2. **Vary section lengths**: Short and long sections create rhythm.
3. **Use alignment strategically**: Center for emphasis, left/right for flow.
4. **Match emotion to content**: The color scheme should enhance the mood.
5. **Test on mobile**: Ensure readability on all screen sizes.

## Content Structure Tips

- Start with a strong opening section (usually centered)
- Build narrative with alternating alignments
- Use images as visual breaks
- End with a reflective or impactful closing
- Keep sections focused—one idea per section works best


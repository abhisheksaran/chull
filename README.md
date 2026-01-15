# Chull - Digital Art Gallery

A cinematic digital art gallery for writings and photographs. This is not a blog—it's a digital literary art installation.

## Design Philosophy

Each story is an exhibition. Scrolling is a cinematic journey. Colors, typography, and motion adapt to emotional tone. Hindi and English coexist poetically.

## Emotional Color System

- **Melancholy**: Deep navy with crimson accents
- **Nostalgia**: Purple tones with golden warmth
- **Introspection**: Dark blue with silver highlights
- **Passion**: Deep burgundy with red glow
- **Serenity**: Midnight blue with cyan light
- **Longing**: Dark purple with lavender whispers

## Typography

- **English**: Inter (clean, modern)
- **Hindi**: Noto Sans Devanagari (elegant, readable)
- **Display**: Playfair Display (cinematic, poetic)

## Development

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
npm run build
```

The `out` directory contains the static site ready for GitHub Pages.

## Adding Content

1. **Stories**: Add markdown files in `/content/stories/`
2. **Photos**: Add images in `/public/photos/`
3. **Metadata**: Update `/content/stories/index.json` with story metadata

## Project Structure

```
chull/
├── app/              # Next.js app directory
├── components/       # React components
├── content/          # Story content (markdown)
├── public/           # Static assets
├── styles/           # Global styles
└── lib/              # Utilities
```


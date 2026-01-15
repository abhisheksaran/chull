# Design System - Chull

## Visual Concept

Chull is a digital literary art installation where each story is an exhibition. The experience is cinematic, emotional, and immersive.

## Typography System

### Font Pairing

1. **English Body**: Inter
   - Clean, modern, highly readable
   - Used for English prose and UI elements
   - Variable weight: 400-700

2. **Hindi Body**: Noto Sans Devanagari
   - Elegant, readable Devanagari script
   - Maintains visual harmony with Inter
   - Variable weight: 400-700

3. **Display**: Playfair Display
   - Cinematic, poetic serif
   - Used for titles and headings
   - Creates contrast and hierarchy

### Typography Scale

- Fluid typography using `clamp()` for responsive scaling
- Base sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- Line heights optimized for readability (1.7-1.8 for body, 1.3 for display)

## Color System

### Emotional Color Palettes

Each story can be assigned an emotional tone that determines its color scheme:

#### Melancholy
- Base: `#1a1a2e` (Deep navy)
- Accent: `#16213e` (Darker navy)
- Glow: `#0f3460` (Midnight blue)
- Text: `#e94560` (Crimson red)

#### Nostalgia
- Base: `#2d1b3d` (Deep purple)
- Accent: `#3d2a4f` (Rich purple)
- Glow: `#4a3a5a` (Muted purple)
- Text: `#d4a574` (Golden amber)

#### Introspection
- Base: `#0d1b2a` (Almost black blue)
- Accent: `#1b263b` (Dark blue-gray)
- Glow: `#415a77` (Steel blue)
- Text: `#778da9` (Silver blue)

#### Passion
- Base: `#2d0a1a` (Deep burgundy)
- Accent: `#4a0e2e` (Rich burgundy)
- Glow: `#6b1a3a` (Dark red)
- Text: `#c41e3a` (Bright red)

#### Serenity
- Base: `#0a1929` (Midnight)
- Accent: `#132f4c` (Deep blue)
- Glow: `#1e4976` (Ocean blue)
- Text: `#4fc3f7` (Cyan)

#### Longing
- Base: `#1a0d1a` (Deep purple-black)
- Accent: `#2d1a2d` (Rich purple)
- Glow: `#3d2a3d` (Muted purple)
- Text: `#b886d9` (Lavender)

### Base Dark Palette

- Studio: `#0a0a0a` (Pure black, background)
- Canvas: `#121212` (Near black, surfaces)
- Paper: `#1a1a1a` (Dark gray, cards)
- Ink: `#2a2a2a` (Medium gray, borders)

## Interaction Patterns

### Scroll Behavior

- **Smooth scrolling**: Native CSS smooth scroll
- **Parallax effects**: Framer Motion scroll-based animations
- **Progressive reveal**: Sections fade in as they enter viewport
- **Cinematic transitions**: Mask gradients for fade effects

### Hover States

- **Scale transforms**: Subtle scale (1.02-1.05) on interactive elements
- **Glow effects**: Color-matched glows that intensify on hover
- **Background shifts**: Smooth color transitions
- **Cursor feedback**: Scale down on tap/click

### Motion Principles

1. **Easing**: Use ease-out for entrances, ease-in-out for continuous animations
2. **Duration**: 0.6-1.2s for transitions, 2-10s for ambient animations
3. **Stagger**: Delay animations by 0.1s per item for lists
4. **Parallax**: Different scroll speeds for depth perception

## Visual Effects

### Grain Texture

- Subtle film grain overlay using SVG noise filter
- Animated grain effect for cinematic feel
- Low opacity (3-5%) to not interfere with readability

### Glow Effects

- Color-matched glows for emotional sections
- Multiple shadow layers for depth
- Pulse animations for ambient lighting

### Blur Effects

- Backdrop blur for glassmorphism
- Blur radius: 20px with saturation boost
- Used for overlays and navigation

### Transitions

- **Fade**: Opacity transitions (0.8s)
- **Slide**: Transform with opacity (1.2s)
- **Scale**: Transform with opacity (0.6s)
- **Color**: Background color transitions (0.5s)

## Layout Principles

### Spacing

- Generous whitespace (py-32 for sections)
- Max-width containers (max-w-4xl to max-w-7xl)
- Safe screen spacing (calc(100vh - 2rem))

### Grid System

- Responsive: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Gap: 2rem (gap-8) between items
- No rigid grid, fluid and organic

### Content Width

- Hero: max-w-4xl (centered)
- Stories grid: max-w-7xl
- Story content: max-w-5xl
- Text blocks: max-w-3xl

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 minimum)
- Emotional colors tested for readability
- Dark backgrounds ensure sufficient contrast

### Keyboard Navigation

- All interactive elements focusable
- Visible focus states
- Logical tab order

### Screen Readers

- Semantic HTML structure
- ARIA labels where needed
- Alt text for images (when added)

### Motion Preferences

- Respect `prefers-reduced-motion`
- Provide static fallbacks
- Essential animations only

## Performance

### Optimization

- Static site generation (Next.js export)
- Optimized fonts (display: swap)
- Lazy loading for images
- Minimal JavaScript bundle

### Loading States

- Smooth fade-ins prevent layout shift
- Progressive enhancement
- Graceful degradation

## Content Structure

### Story Format

```typescript
{
  id: string
  title: string
  titleHindi: string
  emotion: 'melancholy' | 'nostalgia' | 'introspection' | 'passion' | 'serenity' | 'longing'
  sections: Array<{
    type: 'text' | 'image'
    content?: string
    contentHindi?: string
    image?: string
    alignment?: 'left' | 'right' | 'center'
  }>
}
```

### Adding New Stories

1. Create markdown file in `/content/stories/`
2. Add metadata to `/content/stories/index.json`
3. Story automatically appears in gallery
4. Emotional tone determines color scheme


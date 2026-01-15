# Quick Start Guide

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Building for Production

```bash
# Build static site
npm run build
```

The static files will be in the `out` directory, ready to deploy to GitHub Pages.

## Deploying to GitHub Pages

### Option 1: GitHub Actions (Automatic)

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select "GitHub Actions" as the source
4. The workflow in `.github/workflows/deploy.yml` will automatically deploy on every push to `main`

### Option 2: Manual Deploy

1. Build the site: `npm run build`
2. Copy the `out` directory contents to your `gh-pages` branch
3. Push to GitHub

## Project Structure

```
chull/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   └── stories/           # Story pages
│       └── [id]/
│           └── page.tsx   # Individual story page
├── components/            # React components
├── lib/                   # Utilities
│   ├── emotionColors.ts   # Color system
│   └── utils.ts           # Helper functions
├── public/                # Static assets (images, etc.)
├── content/               # Story content (future: markdown)
└── styles/                # Additional styles
```

## Key Features

✅ **Cinematic animations** with Framer Motion  
✅ **Emotional color system** - 6 distinct palettes  
✅ **Bilingual support** - Hindi + English typography  
✅ **Responsive design** - Works on all devices  
✅ **Accessible** - WCAG AA compliant  
✅ **Performance optimized** - Static site generation  
✅ **GitHub Pages ready** - One-click deployment  

## Next Steps

1. **Add your stories**: See `CONTENT_GUIDE.md` for instructions
2. **Add photos**: Place images in `/public/photos/`
3. **Customize colors**: Edit `/lib/emotionColors.ts`
4. **Adjust typography**: Modify font imports in `/app/layout.tsx`

## Customization

### Changing Colors

Edit `/lib/emotionColors.ts` to modify the emotional color palettes.

### Changing Fonts

Edit `/app/layout.tsx` to swap fonts. Make sure to:
1. Import from Google Fonts or add custom fonts
2. Update the CSS variables in `tailwind.config.js`

### Adding New Emotions

1. Add color palette to `/lib/emotionColors.ts`
2. Add Tailwind classes to `tailwind.config.js` (optional, inline styles work too)
3. Use the new emotion in your stories

## Troubleshooting

### Build Errors

- Ensure Node.js version is 18+ (`node --version`)
- Clear `.next` and `node_modules`, then reinstall
- Check that all imports are correct

### GitHub Pages Not Loading

- Ensure `next.config.js` has `output: 'export'`
- Check that the base path is correct (if using custom domain)
- Verify GitHub Actions workflow is enabled

### Fonts Not Loading

- Check network tab for font requests
- Verify font names match Google Fonts
- Ensure `display: 'swap'` is set in font config

## Support

For questions or issues, refer to:
- `DESIGN_SYSTEM.md` - Complete design documentation
- `CONTENT_GUIDE.md` - How to add content
- `README.md` - Project overview


# Content Setup Guide

## How to Add Your Writings

Use **simple text files** (`.txt`) - just write your story!

Create a `.txt` file in the `/content/stories/` directory. For example: `my-story.txt`

**Option A: With Title from Story**
Start your file with a highlighted title from your story:

```
==The Last Train==
==आखिरी ट्रेन==

Your story content here...
```

The `==text==` syntax marks text from your story to use as the title. You can provide both English and Hindi titles.

**Option B: Without Title Marker**
If you don't mark a title, the system will:
- Use the filename as the title (e.g., `my-story.txt` → "My Story")
- Auto-detect the emotion from your text
- Split content into sections by paragraphs
- Handle Hindi and English automatically

**That's it!** No frontmatter, no metadata needed.

## Writing Your Story

You can:

1. **Mix English and Hindi naturally** - Just write both languages in the same file:
   ```
   This is English text.
   
   यह हिंदी पाठ है।
   ```

2. **Add images** - Use markdown image syntax:
   ```
   ![Image description](/photos/my-image.jpg)
   ```

3. **Create multiple sections** - Separate sections with blank lines. Each section becomes a separate block on the story page.

### Example Story File

```
==Memories of Rain==
==बारिश की यादें==

The first drop fell, and suddenly the world was different.

पहली बूंद गिरी, और अचानक दुनिया बदल गई।

I remember standing there, letting the water wash away everything that had been weighing me down.

मुझे याद है वहाँ खड़े होकर, पानी को सब कुछ धोते हुए देखना जो मुझे दबा रहा था।

![Rain on window](/photos/rain-window.jpg)

In that moment, I understood what it meant to be free.

उस पल, मैंने समझा कि आज़ाद होने का मतलब क्या होता है।
```

## Emotion Auto-Detection

If you don't specify an emotion, the system analyzes your text and assigns one automatically:

- **melancholy**: Detects words like "loss", "empty", "alone", "dark"
- **nostalgia**: Detects words like "remember", "memory", "past", "childhood"
- **introspection**: Detects words like "think", "question", "wonder", "meaning"
- **passion**: Detects words like "intense", "fire", "desire", "love"
- **serenity**: Detects words like "calm", "peace", "quiet", "gentle"
- **longing**: Detects words like "wish", "hope", "miss", "dream"

## Handling Hindi-Only Stories

If your story is originally in Hindi:

1. Write the Hindi text naturally
2. Add English translation in the same sections (or provide it separately)
3. The system will detect both languages and display them together

Example:
```
==मेरी कहानी==
==My Story==

मैं वहाँ खड़ा था, सोच रहा था कि क्या होगा।

I stood there, wondering what would happen.

क्या यह सही था? क्या मुझे यह करना चाहिए था?

Was this right? Should I have done this?
```

## File Naming

- Use lowercase letters, numbers, and hyphens
- Examples: `my-story.txt`, `memories-of-rain.txt`, `the-last-train.txt`
- The filename becomes the story ID

## After Adding Stories

1. Restart your dev server: `npm run dev`
2. Stories will automatically appear on the landing page
3. Each story gets its own page at `/stories/[id]`
4. Emotion colors are applied automatically

## Tips

- **Keep sections focused**: One idea per section works best
- **Vary section lengths**: Mix short and long for rhythm
- **Use images strategically**: Place them between text sections for visual breaks
- **Let emotion emerge naturally**: The auto-detection works best when you write authentically
- **Test your story**: After adding, check how it looks on the story page

## Troubleshooting

**Story not appearing?**
- Check that the file is in `/content/stories/`
- Verify the file has `.txt` extension
- Restart dev server

**Wrong emotion detected?**
- Adjust your text to include more emotion-specific keywords
- The system analyzes your writing style automatically

**Images not showing?**
- Ensure images are in `/public/photos/` directory
- Use absolute paths starting with `/photos/`
- Check file extensions match


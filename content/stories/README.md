# Stories Directory

Place your story `.txt` files here.

## Simple Text Files

Just create a `.txt` file and write your story.

**Option 1: Title from Your Story**
Start with a highlighted line from your story as the title:

```
==The Last Train==
==आखिरी ट्रेन==

Your story content here...
```

The `==text==` syntax extracts that text to use as the title. You can provide both English and Hindi titles on separate lines.

**Option 2: Auto-Title from Filename**
Just write your story - the filename becomes the title:

```
the-last-train.txt
```

The system will automatically:
- Use the filename as the title
- Detect the emotion from your text
- Create sections from your paragraphs
- Handle Hindi and English

**Example:**
```
==The Last Train==
==आखिरी ट्रेन==

The platform was empty...
```

Just write your story content - that's it!

## Notes

- Emotion will be auto-detected from text
- If text is primarily in Hindi, provide English translation in the same file
- Images should be placed in `/public/photos/` directory
- File name becomes the story ID

# Audio Setup Summary

## What You Need

1. **room-tone.mp3** (Required)
   - Primary ambient layer
   - Place in: `/public/audio/room-tone.mp3`
   - Already configured in code

2. **air-texture.mp3** (Optional)
   - For future enhancements
   - Can be added later

3. **deep-drone.mp3** (Optional)
   - For future enhancements
   - Can be added later

## Quick Start (5 Minutes)

### Step 1: Download
1. Go to: https://freesound.org/people/leonelmail/sounds/579571/
2. Create free account if needed
3. Download the WAV file
4. Save as: `~/Downloads/room-tone-raw.wav`

### Step 2: Process
```bash
cd /Users/AbhishekSaran/personal/chull
./scripts/process-audio.sh ~/Downloads/room-tone-raw.wav public/audio/room-tone.mp3
```

### Step 3: Test
```bash
npm run dev
```
- Open browser
- Scroll or click
- Audio should fade in smoothly

## Detailed Guides

- **CURATED_SOURCES.md** - Specific file recommendations with direct links
- **AUDIO_SOURCES.md** - Comprehensive source list and processing guide
- **QUICK_START.md** - Step-by-step setup instructions
- **README.md** - File requirements and specifications

## Current Configuration

The system is already configured to use:
- **File**: `room-tone.mp3`
- **Base Volume**: 8% (very subtle)
- **Scene 2 Volume**: 12% (slightly more presence)
- **Silence Volume**: 1.5% (barely audible noise floor)
- **Fade In**: 7 seconds
- **Fade Out**: 3 seconds

## File Specifications

- **Format**: MP3, 160kbps, 44.1kHz
- **Normalization**: -16 LUFS or quieter
- **Fades**: 2s in, 2s out
- **Loop**: Seamless, no clicks
- **Duration**: 30s - 2min (will loop automatically)

## Troubleshooting

**Script doesn't work?**
- Install ffmpeg: `brew install ffmpeg` (macOS) or `apt-get install ffmpeg` (Linux)
- Install bc: `brew install bc` (macOS) or `apt-get install bc` (Linux)

**Audio doesn't play?**
- Check browser console for errors
- Verify file exists: `ls public/audio/room-tone.mp3`
- Check file permissions

**Need different sound?**
- See CURATED_SOURCES.md for alternatives
- Download new file
- Process with same script
- Replace `room-tone.mp3`

## Next Steps

1. ✅ Code is ready - system configured for `room-tone.mp3`
2. ⏳ Download audio file (see CURATED_SOURCES.md)
3. ⏳ Process file (use `scripts/process-audio.sh`)
4. ⏳ Test in browser
5. ⏳ Adjust volume if needed (in `AmbientAudioWrapper.tsx`)

## Support Files Created

- ✅ `scripts/process-audio.sh` - Automated processing script
- ✅ `public/audio/AUDIO_SOURCES.md` - Comprehensive guide
- ✅ `public/audio/CURATED_SOURCES.md` - Specific recommendations
- ✅ `public/audio/QUICK_START.md` - Quick setup guide
- ✅ `public/audio/README.md` - Updated requirements
- ✅ `components/AmbientAudioWrapper.tsx` - Updated to use `room-tone.mp3`

Everything is ready - just download and process your audio file!


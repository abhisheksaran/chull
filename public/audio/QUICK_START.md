# Quick Start: Audio Setup

## Step 1: Download Audio Files

### Recommended Sources (CC0/Royalty-Free)

1. **Freesound.org** (CC0 filter)
   - Search: "room tone" + CC0
   - Search: "air texture" + CC0
   - Search: "ambient drone" + CC0
   - URL: https://freesound.org

2. **Mixkit** (Free for commercial use)
   - URL: https://mixkit.co/free-sound-effects/ambience/
   - Filter for indoor/room ambience

3. **Signature Sounds** (CC0 Room Tones pack)
   - URL: https://signaturesounds.org/store/p/room-tones

## Step 2: Process Audio Files

### Using the Processing Script

```bash
# Make sure you're in the project root
cd /Users/AbhishekSaran/personal/chull

# Process room tone
./scripts/process-audio.sh ~/Downloads/room-tone-raw.wav public/audio/room-tone.mp3

# Process air texture (optional)
./scripts/process-audio.sh ~/Downloads/air-texture-raw.wav public/audio/air-texture.mp3

# Process deep drone (optional)
./scripts/process-audio.sh ~/Downloads/drone-raw.wav public/audio/deep-drone.mp3
```

### Manual Processing (Audacity)

1. Open file in Audacity
2. **Normalize**: Effect → Normalize → -16 dB
3. **Find loop point**: Look for matching waveform at start/end
4. **Crossfade loop**: Select 0.5-1s at end → Effect → Crossfade In
5. **Fade in**: Select first 2s → Effect → Fade In
6. **Fade out**: Select last 2s → Effect → Fade Out
7. **Export**: File → Export → Export as MP3
   - Bitrate: 160 kbps
   - Quality: Standard

## Step 3: Verify Files

Check that files exist:
```bash
ls -lh public/audio/*.mp3
```

Expected files:
- `room-tone.mp3` (required)
- `air-texture.mp3` (optional)
- `deep-drone.mp3` (optional)

## Step 4: Test

1. Start dev server: `npm run dev`
2. Open browser console
3. Scroll or click to trigger audio
4. Verify smooth fade-in
5. Navigate to story page - verify fade to silence
6. Return to main page - verify fade back

## File Requirements Checklist

- [ ] Duration: 30s - 2min (for loops)
- [ ] Format: MP3, 160kbps, 44.1kHz
- [ ] Normalized: -16 LUFS or quieter
- [ ] Fades: 2s fade in, 2s fade out
- [ ] Loop: Seamless, no clicks
- [ ] License: CC0 or royalty-free
- [ ] Content: No music, no rhythm, no vocals

## Troubleshooting

**Audio doesn't play:**
- Check browser console for errors
- Verify file path: `/audio/room-tone.mp3`
- Check file permissions
- Try different browser

**Clicks at loop:**
- Re-process with better loop point
- Increase crossfade duration
- Use "Find Zero Crossings" in Audacity

**Too loud/too quiet:**
- Adjust `baseVolume` in `AmbientAudioWrapper.tsx`
- Re-normalize to different LUFS level

## Current Configuration

- **Primary file**: `room-tone.mp3`
- **Base volume**: 8% (0.08)
- **Scene 2 volume**: 12% (0.12)
- **Silence volume**: 1.5% (0.015)
- **Fade in**: 7 seconds
- **Fade out**: 3 seconds

See `components/AmbientAudioWrapper.tsx` to adjust settings.


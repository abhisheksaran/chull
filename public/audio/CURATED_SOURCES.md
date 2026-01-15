# Curated Audio Sources - Direct Recommendations

## 1. Room Tone / Gallery Ambience

### Primary Recommendation

**File**: Quiet Bedroom Room Tone
- **Source**: Freesound.org
- **URL**: https://freesound.org/people/leonelmail/sounds/579571/
- **License**: CC0 (Public Domain)
- **Duration**: 44 seconds
- **Description**: Quiet bedroom room tone with ambient background
- **Why**: Near-silent, neutral, perfect for gallery atmosphere
- **Processing**: Extend to 60-90s loop, add fades

### Alternative Options

**File**: Indoors Simple Room Tone Ambient
- **Source**: Freesound.org
- **URL**: https://freesound.org/people/bulbastre/sounds/126942/
- **License**: CC0
- **Duration**: 1:43
- **Description**: Simple indoor room tone ambient
- **Why**: Already good length, neutral character

**File**: Ambient Tone
- **Source**: Freesound.org
- **URL**: https://freesound.org/people/andersmmg/sounds/573990/
- **License**: CC0
- **Duration**: 10 seconds
- **Description**: Ambient room or building tone
- **Why**: Very subtle, needs extension

**File**: Room Tone #1
- **Source**: Freesound.org
- **URL**: https://freesound.org/people/auroraborealis4/sounds/796871/
- **License**: CC0
- **Duration**: 12 seconds
- **Description**: Carpeted room with creaky fan
- **Why**: Has character, needs extension

### Mixkit Options (Free for Commercial Use)

**Source**: Mixkit Ambience Collection
- **URL**: https://mixkit.co/free-sound-effects/ambience/
- **Filter**: Look for "room" or "indoor" ambience
- **Note**: All Mixkit sounds are free for commercial use
- **Recommendation**: Browse and download 2-3 candidates, test which works best

---

## 2. Soft Air / Wind Corridor Texture

### Primary Recommendation

**Search Strategy**: Freesound.org
- **Search Terms**: "air texture" OR "soft wind" OR "gentle breeze" + CC0 filter
- **URL**: https://freesound.org/search/?q=air+texture+cc0
- **Filter**: License = CC0
- **Target**: Very subtle air movement, no nature sounds

### Alternative: Create Your Own

If you can't find suitable files, consider:

**Option A**: Process room tone with high-pass filter
- Take a room tone file
- Apply high-pass filter (cut below 200Hz)
- Add gentle reverb
- Result: Airy texture without nature sounds

**Option B**: Mixkit Wind Ambience
- **URL**: https://mixkit.co/free-sound-effects/ambience/
- **Filter**: "wind" or "air"
- **Warning**: Many include nature sounds - listen carefully

---

## 3. Deep Cinematic Drone (Optional)

### Primary Recommendation

**Search Strategy**: Freesound.org
- **Search Terms**: "ambient drone" OR "cinematic pad" OR "evolving pad" + CC0 filter
- **URL**: https://freesound.org/search/?q=ambient+drone+cc0
- **Filter**: License = CC0
- **Target**: Slow evolving pad, no rhythm, very low frequency

### CC0 Sample Packs

**Source**: Free Music Archive
- **URL**: https://freemusicarchive.org/
- **Filter**: Genre = Ambient, License = CC0
- **Search**: "drone" or "pad"

**Source**: Internet Archive
- **URL**: https://archive.org/details/audio
- **Search**: "CC0 ambient drone" or "CC0 cinematic pad"
- **Filter**: CC0 license

---

## Download Checklist

For each file you download, record:

- [ ] **File Name**: Original filename
- [ ] **Source URL**: Direct link to file
- [ ] **License**: CC0 / Royalty-Free / Attribution Required
- [ ] **Duration**: Original duration
- [ ] **Sample Rate**: 44.1kHz / 48kHz / other
- [ ] **Format**: WAV / MP3 / FLAC
- [ ] **Loop Points**: Start/end times for seamless loop
- [ ] **Emotional Match**: Does it match the gallery atmosphere?

---

## Processing Workflow

1. **Download** 3-5 candidate files per category
2. **Listen** to each, select best match
3. **Process** using `scripts/process-audio.sh`
4. **Test** loop in browser
5. **Adjust** if needed (volume, loop points, fades)
6. **Place** in `/public/audio/` with correct name

---

## Quick Download Commands

### Using wget/curl (if direct download available)

```bash
# Example (replace with actual download URL)
cd ~/Downloads
wget "https://freesound.org/people/leonelmail/sounds/579571/download/" -O room-tone-raw.wav

# Process immediately
cd /Users/AbhishekSaran/personal/chull
./scripts/process-audio.sh ~/Downloads/room-tone-raw.wav public/audio/room-tone.mp3
```

**Note**: Freesound requires login for downloads. Use browser download, then process.

---

## License Verification

Before final use, verify:

1. **CC0**: ✅ No attribution required
2. **Royalty-Free**: ✅ Commercial use allowed
3. **Mixkit**: ✅ Free for commercial use (verify current terms)
4. **Freesound**: ✅ Check individual file license

**Keep records** of all sources for your project documentation.

---

## Emotional Texture Reference

### room-tone.mp3
> "The quiet presence of an empty gallery space. Not silence, but the subtle hum of air conditioning, distant ventilation, the acoustic character of a large room. Like standing alone in a museum after hours."

### air-texture.mp3
> "Almost imperceptible movement of air. Like a gentle breeze through a corridor, or the subtle pressure change in a well-sealed room. Creates a sense of space and depth without drawing attention."

### deep-drone.mp3
> "A slow, evolving atmospheric pad. Like the distant rumble of a city heard through thick walls, or the low-frequency resonance of a large space. Adds weight and presence without rhythm or melody."


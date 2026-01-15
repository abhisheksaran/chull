# Ambient Audio Sources & Processing Guide

## Recommended Sources

### 1. Room Tone / Gallery Ambience

**Primary Recommendation:**
- **Source**: Freesound.org (CC0 License)
- **Search**: "room tone" + "CC0" filter
- **Specific Files**:
  - [Quiet Room Tone](https://freesound.org/people/leonelmail/sounds/579571/) - 44 seconds, CC0
  - [Indoors Simple Room Tone](https://freesound.org/people/bulbastre/sounds/126942/) - 1:43, CC0
  - [Ambient Tone](https://freesound.org/people/andersmmg/sounds/573990/) - 10 seconds, CC0

**Alternative Sources:**
- **Mixkit**: https://mixkit.co/free-sound-effects/ambience/
  - Filter for "room" or "indoor" ambience
  - All Mixkit sounds are free for commercial use
- **Signature Sounds**: https://signaturesounds.org/store/p/room-tones
  - CC0 Room Tones pack (paid but high quality)

**Target Specs:**
- Duration: 30s - 2min (will be looped)
- No voices, no music, no rhythm
- Very low frequency hum or air texture
- Seamless loop potential

---

### 2. Soft Air / Wind Corridor Texture

**Primary Recommendation:**
- **Source**: Freesound.org (CC0 License)
- **Search**: "air" + "wind" + "ambient" + "CC0" filter
- **Specific Files**:
  - [Soft Wind Ambience](https://freesound.org/search/?q=soft+wind+ambient+cc0) - Search results
  - [Air Texture](https://freesound.org/search/?q=air+texture+ambient+cc0) - Search results

**Alternative Sources:**
- **Mixkit**: https://mixkit.co/free-sound-effects/ambience/
  - Look for "wind" or "air" ambience
  - Avoid files with birds, traffic, or water

**Target Specs:**
- Duration: 30s - 2min
- Almost inaudible, slow moving air
- No birds, no traffic, no water drops
- Very subtle presence

---

### 3. Deep Cinematic Drone (Optional)

**Primary Recommendation:**
- **Source**: Freesound.org (CC0 License)
- **Search**: "drone" + "ambient" + "pad" + "CC0" filter
- **Specific Files**:
  - [Ambient Drone](https://freesound.org/search/?q=ambient+drone+cc0) - Search results
  - [Cinematic Pad](https://freesound.org/search/?q=cinematic+pad+cc0) - Search results

**Alternative Sources:**
- **CC0 Sample Packs**: Search for "CC0 ambient sample packs"
- **Free Music Archive**: Filter for CC0 ambient/drone

**Target Specs:**
- Duration: 1-3 minutes (evolving, not looping)
- One evolving pad, very slow, very low
- No musical progression
- Deep, atmospheric texture

---

## Processing Instructions

### Tools Required
- **Audacity** (free): https://www.audacityteam.org/
- **FFmpeg** (command line): https://ffmpeg.org/
- **SoX** (optional, for advanced processing): http://sox.sourceforge.net/

### Step-by-Step Processing

#### 1. Download & Import
```bash
# Download files to a temporary folder
mkdir -p ~/audio-processing
cd ~/audio-processing
# Download your chosen files here
```

#### 2. Normalize to -16 LUFS
```bash
# Using FFmpeg with loudnorm filter
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 output_normalized.wav
```

#### 3. Create Seamless Loop
- Open in Audacity
- Find a good loop point (look for waveform that matches start/end)
- Use "Find Zero Crossings" (Ctrl+B) to avoid clicks
- Crossfade the loop point (Select 0.5-1 second at end, Effect → Crossfade In)
- Export as WAV

#### 4. Add 2-Second Fade In/Out
```bash
# Using FFmpeg
ffmpeg -i input.wav -af "afade=t=in:st=0:d=2,afade=t=out:st=$(ffprobe -i input.wav -show_entries format=duration -v quiet -of csv="p=0" | awk '{print $1-2}'):d=2" output_faded.wav
```

Or in Audacity:
- Select first 2 seconds → Effect → Fade In
- Select last 2 seconds → Effect → Fade Out

#### 5. Optimize for Web
```bash
# Convert to MP3 at 160kbps (good balance of quality/size)
ffmpeg -i input_faded.wav -codec:a libmp3lame -b:a 160k -ar 44100 output.mp3

# Or OGG Vorbis (better compression, smaller files)
ffmpeg -i input_faded.wav -codec:a libvorbis -q:a 5 -ar 44100 output.ogg
```

#### 6. Verify Loop Points
- Import the processed file
- Play the loop several times
- Ensure no clicks or pops at boundaries
- Adjust crossfade if needed

---

## File Specifications

### Final File Requirements

**room-tone.mp3**
- Format: MP3, 160kbps
- Sample Rate: 44.1kHz
- Duration: 30s - 2min (seamless loop)
- LUFS: -16 or quieter
- Fade: 2s in, 2s out
- Loop: Seamless, no clicks

**air-texture.mp3**
- Format: MP3, 160kbps
- Sample Rate: 44.1kHz
- Duration: 30s - 2min (seamless loop)
- LUFS: -16 or quieter
- Fade: 2s in, 2s out
- Loop: Seamless, no clicks

**deep-drone.mp3** (optional)
- Format: MP3, 160kbps
- Sample Rate: 44.1kHz
- Duration: 1-3min (evolving, not looping)
- LUFS: -16 or quieter
- Fade: 2s in, 2s out
- No loop needed

---

## Quick Processing Script

Save this as `process-audio.sh`:

```bash
#!/bin/bash

# Process audio files for web use
# Usage: ./process-audio.sh input.wav output.mp3

INPUT=$1
OUTPUT=$2

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
    echo "Usage: $0 input.wav output.mp3"
    exit 1
fi

# Get duration
DURATION=$(ffprobe -i "$INPUT" -show_entries format=duration -v quiet -of csv="p=0")
FADE_OUT_START=$(echo "$DURATION - 2" | bc)

# Process: Normalize, fade, convert to MP3
ffmpeg -i "$INPUT" \
    -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=2,afade=t=out:st=$FADE_OUT_START:d=2" \
    -codec:a libmp3lame \
    -b:a 160k \
    -ar 44100 \
    "$OUTPUT"

echo "Processed: $OUTPUT"
```

Make it executable:
```bash
chmod +x process-audio.sh
```

---

## Emotional Texture Descriptions

### room-tone.mp3
**Emotional Texture**: The quiet presence of an empty gallery space. Not silence, but the subtle hum of air conditioning, distant ventilation, the acoustic character of a large room. Like standing alone in a museum after hours. Neutral, respectful, allowing the art (text) to breathe.

### air-texture.mp3
**Emotional Texture**: Almost imperceptible movement of air. Like a gentle breeze through a corridor, or the subtle pressure change in a well-sealed room. Creates a sense of space and depth without drawing attention. More felt than heard.

### deep-drone.mp3 (optional)
**Emotional Texture**: A slow, evolving atmospheric pad. Like the distant rumble of a city heard through thick walls, or the low-frequency resonance of a large space. Adds weight and presence without rhythm or melody. Cinematic but not musical.

---

## License Verification

Before using any file, verify:
1. **CC0**: Public domain, no attribution required
2. **Royalty-Free**: Check license terms for commercial use
3. **Mixkit**: Free for commercial use (verify current terms)
4. **Freesound**: Check individual file license (filter for CC0)

Always keep a record of:
- Source URL
- License type
- Attribution requirements (if any)

---

## Next Steps

1. Download 3-5 candidate files from each category
2. Listen and select the best match for your vision
3. Process using the instructions above
4. Test loops in your browser
5. Place final files in `/public/audio/`
6. Update code to use new file names


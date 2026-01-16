# Room-Specific Ambient Audio

Each gallery room has its own unique ambient soundscape that plays when the visitor enters. Audio crossfades smoothly (3 seconds) when transitioning between rooms.

## Required Audio Files

Add MP3 files for each room:

| File | Room | Mood Suggestion |
|------|------|-----------------|
| `rain.mp3` | बारिश (Rain) | Gentle rain, distant thunder, water on leaves |
| `window.mp3` | खिड़की से (From the Window) | City hum, wind, distant traffic, birds |
| `transit.mp3` | गतिमान (In Transit) | Train ambience, movement, subtle rhythm |
| `books.mp3` | किताबें (Books) | Library quiet, paper rustling, clock ticking |
| `dreams.mp3` | स्वप्न (Dreams) | Ethereal pads, underwater textures, soft drones |
| `creation.mp3` | सृजन (Creation) | Pen on paper, coffee shop, creative hum |
| `laughter.mp3` | हँसी (Laughter) | Light airy tones, wind chimes, warmth |
| `tenderness.mp3` | कोमलता (Tenderness) | Heartbeat, breathing, intimate quiet |
| `mortality.mp3` | मृत्यु (Mortality) | Slow bells, wind, vast emptiness |

## Audio Specifications

- **Format**: MP3 (128-192kbps for web)
- **Duration**: 60-120 seconds (loops seamlessly)
- **Looping**: Ensure clean loop points with no clicks
- **Level**: Normalize to -18 LUFS (these play at 6% volume)
- **Mood**: Subtle, atmospheric, non-distracting

## Sources for Free Ambient Audio

- [Freesound.org](https://freesound.org) - CC licensed sounds
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/) - Free for personal use
- [Zapsplat](https://www.zapsplat.com) - Royalty-free ambiences

## Fallback Behavior

If a room's audio file is missing, the system gracefully falls back to the default `room-tone.mp3`. No errors will appear to the user.


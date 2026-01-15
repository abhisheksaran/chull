#!/bin/bash

# Audio Processing Script for Ambient Gallery Sounds
# Processes audio files: normalizes, adds fades, converts to web format
# Usage: ./process-audio.sh input.wav output.mp3

set -e

INPUT=$1
OUTPUT=$2

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
    echo "Usage: $0 input.wav output.mp3"
    echo ""
    echo "This script will:"
    echo "  1. Normalize audio to -16 LUFS"
    echo "  2. Add 2-second fade in and fade out"
    echo "  3. Convert to MP3 at 160kbps, 44.1kHz"
    exit 1
fi

if [ ! -f "$INPUT" ]; then
    echo "Error: Input file '$INPUT' not found"
    exit 1
fi

echo "Processing: $INPUT -> $OUTPUT"
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed"
    echo "Install with: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
    exit 1
fi

# Check if bc is installed (for duration calculation)
if ! command -v bc &> /dev/null; then
    echo "Error: bc is not installed"
    echo "Install with: brew install bc (macOS) or apt-get install bc (Linux)"
    exit 1
fi

# Get duration
echo "Analyzing audio file..."
DURATION=$(ffprobe -i "$INPUT" -show_entries format=duration -v quiet -of csv="p=0" 2>/dev/null || echo "0")

if [ "$DURATION" = "0" ] || [ -z "$DURATION" ]; then
    echo "Error: Could not determine audio duration"
    exit 1
fi

echo "Duration: ${DURATION}s"

# Calculate fade out start time (2 seconds before end)
FADE_OUT_START=$(echo "$DURATION - 2" | bc)

if (( $(echo "$FADE_OUT_START < 0" | bc -l) )); then
    echo "Warning: File is shorter than 4 seconds, reducing fade duration"
    FADE_OUT_START=$(echo "$DURATION / 2" | bc)
    FADE_DURATION=$(echo "$DURATION / 4" | bc)
else
    FADE_DURATION=2
fi

echo "Fade in: 0s to ${FADE_DURATION}s"
echo "Fade out: ${FADE_OUT_START}s to ${DURATION}s"
echo ""

# Process: Normalize, fade, convert to MP3
echo "Processing audio..."
ffmpeg -i "$INPUT" \
    -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=${FADE_DURATION},afade=t=out:st=${FADE_OUT_START}:d=${FADE_DURATION}" \
    -codec:a libmp3lame \
    -b:a 160k \
    -ar 44100 \
    -y \
    "$OUTPUT" 2>&1 | grep -E "(Duration|Stream|Output)" || true

echo ""
echo "✓ Processed: $OUTPUT"
echo ""
echo "File info:"
ffprobe -v quiet -show_format -show_streams "$OUTPUT" 2>/dev/null | grep -E "(duration|bit_rate|sample_rate)" || true


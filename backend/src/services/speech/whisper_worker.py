#!/usr/bin/env python3
"""
MediSaarthi High-Performance Faster-Whisper Transcription Engine
Anti-Hallucination & Anti-Repetition Loop Protected
"""

import sys
import os
import json
import argparse
import re

_CACHED_MODELS = {}

def get_model(model_size="tiny", device="cpu", compute_type="int8"):
    cache_key = f"{model_size}_{device}_{compute_type}"
    if cache_key not in _CACHED_MODELS:
        from faster_whisper import WhisperModel
        _CACHED_MODELS[cache_key] = WhisperModel(
            model_size,
            device=device,
            compute_type=compute_type,
            cpu_threads=8,
            num_workers=2
        )
    return _CACHED_MODELS[cache_key]

def clean_repetition_hallucinations(text):
    """Filter out autoregressive looping hallucinations like 'word, word, word...'"""
    if not text:
        return ""
    
    # Remove repeated token phrases (e.g., 'परद, परद, परद...')
    cleaned = re.sub(r'(\b[\w\u0900-\u097F]+\b[\s,]*){4,}', r'\1', text)
    
    # Word-by-word duplicate filter
    words = cleaned.split()
    deduped = []
    for w in words:
        if len(deduped) >= 2 and deduped[-1].lower() == w.lower() and deduped[-2].lower() == w.lower():
            continue
        deduped.append(w)
    
    return " ".join(deduped).strip()

def transcribe_audio(audio_path, model_size="base", device="cpu", compute_type="int8", language=None):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        return {
            "error": "faster-whisper is not installed. Run 'pip install faster-whisper'.",
            "fallback": True
        }

    if not os.path.exists(audio_path):
        return {"error": f"Audio file '{audio_path}' not found."}

    try:
        model = get_model(model_size, device, compute_type)

        lang_code = language.split("-")[0] if language and "-" in language else language
        if lang_code == "auto":
            lang_code = None

        # Anti-hallucination configuration:
        # - condition_on_previous_text=False prevents infinite token loops
        # - compression_ratio_threshold=2.2 discards repetitive patterns
        # - no_speech_threshold=0.6 ignores ambient mic noise
        segments, info = model.transcribe(
            audio_path,
            language=lang_code,
            beam_size=2,
            best_of=2,
            temperature=0.0,
            condition_on_previous_text=False,
            compression_ratio_threshold=2.2,
            no_speech_threshold=0.6,
            log_prob_threshold=-1.0,
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=400)
        )

        transcript_parts = []
        for segment in segments:
            # Discard low confidence or repetitive segments
            if segment.no_speech_prob > 0.6:
                continue
            cleaned_segment = clean_repetition_hallucinations(segment.text.strip())
            if cleaned_segment:
                transcript_parts.append(cleaned_segment)

        raw_text = " ".join(transcript_parts).strip()
        final_text = clean_repetition_hallucinations(raw_text)

        return {
            "text": final_text,
            "transcript": final_text,
            "detected_language": info.language if hasattr(info, "language") else (lang_code or "hi"),
            "language_probability": round(info.language_probability, 2) if hasattr(info, "language_probability") else 0.95,
            "duration": round(info.duration, 2) if hasattr(info, "duration") else 0.0,
            "provider": "whisper"
        }
    except Exception as e:
        return {"error": str(e)}

def main():
    parser = argparse.ArgumentParser(description="Anti-hallucination audio transcription using faster-whisper")
    parser.add_argument("--audio", required=True, help="Path to input audio file")
    parser.add_argument("--model", default="base", help="Model size: tiny, base, small")
    parser.add_argument("--device", default="cpu", help="Device: cpu or cuda")
    parser.add_argument("--compute_type", default="int8", help="Compute type: int8, float16")
    parser.add_argument("--language", default=None, help="Language code, e.g., hi, en")

    args = parser.parse_args()

    result = transcribe_audio(
        audio_path=args.audio,
        model_size=args.model,
        device=args.device,
        compute_type=args.compute_type,
        language=args.language
    )

    print(json.dumps(result))

if __name__ == "__main__":
    main()

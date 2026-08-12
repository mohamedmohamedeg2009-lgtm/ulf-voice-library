import type { PerformanceSettings } from "@/features/studio/schemas";
import type { Voice } from "@/features/voices/voice";

export interface TextAnalysis {
  contentType: string;
  tone: string;
  keywords: string[];
}

export interface VoiceRecommendation {
  voiceId: string;
  reason: string;
}

export interface AIService {
  analyzeText(text: string): TextAnalysis;
  recommendVoice(text: string, voices: Voice[]): VoiceRecommendation[];
  suggestVoiceSettings(text: string): { settings: PerformanceSettings; rationale: string };
  improveText(text: string): { original: string; proposed: string };
}

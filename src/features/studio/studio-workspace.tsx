"use client";

import { useMemo, useState } from "react";
import { AudioLines, ChevronDown, Download, LoaderCircle, MessageCircle, Play, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Voice } from "@/features/voices/voice";
import { performanceSettingsSchema, type PerformanceSettings } from "./schemas";
import { improveText, recommendVoices, suggestVoiceSettings } from "@/features/ai/demo-ai-service";
import { useAppStore } from "@/store/app-store";
import { AudioPlayer } from "@/components/audio/audio-player";
import type { Recording } from "@/features/history/schemas";

const controls: { key: keyof PerformanceSettings; label: string; min: number; max: number; step?: number; suffix?: string }[] = [
  { key: "speed", label: "السرعة", min: 0.5, max: 2, step: 0.01, suffix: "x" },
  { key: "pitch", label: "حدة الصوت", min: -12, max: 12 },
  { key: "energy", label: "الحماس", min: 0, max: 100, suffix: "%" },
  { key: "clarity", label: "الوضوح", min: 0, max: 100, suffix: "%" },
  { key: "expression", label: "التعبير", min: 0, max: 100, suffix: "%" },
  { key: "pauseIntensity", label: "قوة الوقفات", min: 0, max: 100, suffix: "%" },
  { key: "emphasis", label: "التأكيد", min: 0, max: 100, suffix: "%" },
  { key: "stability", label: "الثبات", min: 0, max: 100, suffix: "%" },
];

export function StudioWorkspace({ voices }: { voices: Voice[] }) {
  const storeVoiceId = useAppStore((state) => state.selectedVoiceId);
  const selectVoice = useAppStore((state) => state.selectVoice);
  const [text, setText] = useState("");
  const [settings, setSettings] = useState<PerformanceSettings>(() => performanceSettingsSchema.parse({}));
  const [magicOpen, setMagicOpen] = useState(false);
  const [proposal, setProposal] = useState<{ original: string; proposed: string } | null>(null);
  const [recommendations, setRecommendations] = useState<ReturnType<typeof recommendVoices>>([]);
  const [advanced, setAdvanced] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [format, setFormat] = useState<"mp3" | "wav">("mp3");
  const [generated, setGenerated] = useState<{ recording: Recording; publicShareUrl: string | null } | null>(null);
  const addRecording = useAppStore((state) => state.addRecording);
  const selectedVoiceId = storeVoiceId ?? voices[0]?.id ?? null;
  const selectedVoice = useMemo(() => voices.find((voice) => voice.id === selectedVoiceId), [selectedVoiceId, voices]);

  function applySettings() {
    const result = suggestVoiceSettings(text);
    setSettings(result.settings);
    setMessage(`تم تطبيق إعدادات تناسب ${result.contentType}.`);
    setStatus("success");
    setMagicOpen(false);
  }

  function proposeText() {
    setProposal(improveText(text));
    setMagicOpen(false);
  }

  async function generate() {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, voiceId: selectedVoiceId, format, settings }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "تعذر توليد الصوت.");
      setGenerated(result);
      addRecording(result.recording);
      setStatus("success");
      setMessage("تم توليد الصوت وحفظه في السجل.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "تعذر توليد الصوت.");
    }
  }

  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <CardHeader>
          <div><p className="eyebrow">النص</p><h2 className="text-lg font-bold text-white">اكتب الرسالة التي تريد سماعها</h2></div>
          <Badge>{text.length} / 5000 حرف</Badge>
        </CardHeader>
        <CardContent>
          <textarea aria-label="النص العربي" value={text} maxLength={5000} onChange={(event) => setText(event.target.value)} placeholder="مثال: مباراة اليوم الساعة التاسعة..." className="min-h-44 w-full resize-y rounded-2xl border border-white/10 bg-[#0a1323] p-4 text-base leading-8 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => setMagicOpen(true)}><WandSparkles className="size-4" />تحسين تلقائي</Button>
            <Button type="button" variant="outline" onClick={() => setRecommendations(recommendVoices(text, voices))}><Sparkles className="size-4" />رشح لي أفضل صوت</Button>
          </div>
          {recommendations.length > 0 ? <div className="mt-4 grid gap-2 md:grid-cols-3">{recommendations.map((item) => {
            const voice = voices.find((candidate) => candidate.id === item.voiceId);
            return <button type="button" key={item.voiceId} onClick={() => selectVoice(item.voiceId)} className="rounded-xl border border-white/8 bg-white/4 p-3 text-right hover:border-cyan-300/30"><strong className="block text-white">{voice?.displayName}</strong><span className="text-xs leading-5 text-slate-400">{item.reason}</span></button>;
          })}</div> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div><p className="eyebrow">الصوت المختار</p><h2 className="text-lg font-bold text-white">{selectedVoice?.displayName ?? "اختر صوتًا"}</h2></div><AudioLines className="size-6 text-cyan-300" /></CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{voices.slice(0, 6).map((voice) => <button key={voice.id} type="button" onClick={() => selectVoice(voice.id)} className={`rounded-xl border p-3 text-right ${voice.id === selectedVoiceId ? "border-cyan-300/50 bg-cyan-300/8" : "border-white/8 bg-white/3"}`}><span className="font-bold text-white">{voice.displayName}</span><span className="mt-1 block text-xs text-slate-400">{voice.voiceTone}</span></button>)}</div>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-5">
      <Card>
        <CardHeader><div><p className="eyebrow">الأداء</p><h2 className="text-lg font-bold text-white">إعدادات الصوت</h2></div></CardHeader>
        <CardContent className="space-y-5">
          {controls.slice(0, advanced ? controls.length : 4).map((control) => <label key={control.key} className="block text-sm text-slate-300"><span className="mb-2 flex justify-between"><span>{control.label}</span><b className="text-cyan-200">{String(settings[control.key])}{control.suffix}</b></span><input type="range" min={control.min} max={control.max} step={control.step ?? 1} value={Number(settings[control.key])} onChange={(event) => setSettings((current) => ({ ...current, [control.key]: Number(event.target.value) }))} className="accent-cyan-300" /></label>)}
          <button type="button" onClick={() => setAdvanced((value) => !value)} className="flex min-h-11 w-full items-center justify-between text-sm text-slate-400"><span>{advanced ? "إخفاء الإعدادات المتقدمة" : "إظهار الإعدادات المتقدمة"}</span><ChevronDown className={`size-4 transition-transform ${advanced ? "rotate-180" : ""}`} /></button>
        </CardContent>
      </Card>
      <label className="block text-sm text-slate-400">صيغة التوليد<select value={format} onChange={(event)=>setFormat(event.target.value as "mp3"|"wav")} className="mt-2 min-h-11 w-full rounded-xl border border-white/8 bg-[#091322] px-3 text-white"><option value="mp3">MP3 — سريع وخفيف</option><option value="wav">WAV — جودة غير مضغوطة</option></select></label>
      <Button className="w-full text-base" disabled={!text.trim() || !selectedVoiceId || status === "loading"} onClick={generate}>{status === "loading" ? <LoaderCircle className="size-5 animate-spin" /> : <Play className="size-5 fill-current" />}توليد الصوت</Button>
      {message ? <p role="status" className={`rounded-xl border p-3 text-sm ${status === "error" ? "border-rose-400/20 bg-rose-400/8 text-rose-200" : "border-emerald-400/20 bg-emerald-400/8 text-emerald-200"}`}>{message}</p> : null}
      {generated?<AudioPlayer src={generated.recording.audioUrl} label="الصوت المولّد"/>:null}
      <div className="grid grid-cols-2 gap-2"><Button asChild={Boolean(generated?.recording.mp3Url)} variant="outline" disabled={!generated?.recording.mp3Url}>{generated?.recording.mp3Url?<a href={generated.recording.mp3Url} download><Download className="size-4"/>MP3</a>:<><Download className="size-4"/>MP3</>}</Button><Button asChild={Boolean(generated?.recording.wavUrl)} variant="outline" disabled={!generated?.recording.wavUrl}>{generated?.recording.wavUrl?<a href={generated.recording.wavUrl} download><Download className="size-4"/>WAV</a>:<><Download className="size-4"/>WAV</>}</Button></div>
      <Button asChild={Boolean(generated?.publicShareUrl)} variant="secondary" className="w-full" disabled={!generated?.publicShareUrl}>{generated?.publicShareUrl?<a href={`https://wa.me/?text=${encodeURIComponent(generated.publicShareUrl)}`} target="_blank" rel="noreferrer"><MessageCircle className="size-4"/>مشاركة عبر واتساب</a>:<><MessageCircle className="size-4"/>الرابط خاص — المشاركة غير متاحة</>}</Button>
    </div>

    {magicOpen ? <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4"><Card className="w-full max-w-md"><CardContent className="space-y-4"><h2 className="text-xl font-bold text-white">ماذا تريد أن نحسّن؟</h2><p className="text-sm leading-6 text-slate-400">لن نغيّر النص قبل أن توافق على النسخة المقترحة.</p><Button className="w-full" onClick={applySettings}>إعدادات الصوت فقط</Button><Button variant="secondary" className="w-full" onClick={proposeText} disabled={!text.trim()}>النص وإعدادات الصوت</Button><Button variant="ghost" className="w-full" onClick={() => setMagicOpen(false)}>إلغاء</Button></CardContent></Card></div> : null}
    {proposal ? <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4"><Card className="w-full max-w-xl"><CardContent className="space-y-4"><h2 className="text-xl font-bold text-white">راجع النص المقترح</h2><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white/4 p-3"><span className="text-xs text-slate-500">الأصلي</span><p className="mt-2 text-slate-300">{proposal.original}</p></div><div className="rounded-xl border border-cyan-300/15 bg-cyan-300/5 p-3"><span className="text-xs text-cyan-300">المقترح</span><p className="mt-2 text-white">{proposal.proposed}</p></div></div><div className="flex gap-2"><Button onClick={() => { setText(proposal.proposed); setProposal(null); applySettings(); }}>تطبيق</Button><Button variant="ghost" onClick={() => setProposal(null)}>إلغاء</Button></div></CardContent></Card></div> : null}
  </div>;
}

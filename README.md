# Gulf Voice Library

مكتبة شخصية عربية RTL للأصوات الرجالية الخليجية، مبنية بـ Next.js App Router وSupabase. تركز بيانات البداية على الشخصيات الكويتية، مع بنية قابلة للتوسع إلى مزودات ومجالات أخرى.

## المزايا

- Dashboard، Voice Studio، Voice Library، Favorites، History، Projects وSettings.
- إعدادات أداء احترافية، تحسين تلقائي بموافقة المستخدم، وترشيح أفضل ثلاثة أصوات.
- طبقة `VoiceProvider` مستقلة، مع `DemoVoiceProvider` صادق و`ElevenLabsProvider` اختياري.
- طبقة `AIService` مستقلة وتحليل demo محلي منظم؛ يمكن إضافة مزود AI خارجي دون ربط المكونات به.
- Supabase Auth مع بريد واحد مسموح، وRLS، وStorage خاص للصوت المولّد.
- 10 أصوات seed تجريبية مستقلة وقابلة للاستبدال بأكثر من 100 صوت.

## التشغيل المحلي

```bash
npm install
copy .env.example .env.local
npm run dev
```

على PowerShell الذي يمنع `npm.ps1` استخدم `npm.cmd run dev`.

1. أنشئ مشروع Supabase.
2. طبّق `supabase/migrations/0001_initial_schema.sql` ثم `supabase/seed.sql`.
3. أنشئ مستخدمًا واحدًا في Supabase Auth.
4. أضف البريد نفسه إلى `ALLOWED_EMAIL` في `.env.local`.
5. أضف URL وanon key العامين. لا تضع service-role key في متغير يبدأ بـ`NEXT_PUBLIC_`.

## تفعيل توليد الصوت

الوضع الافتراضي `VOICE_PROVIDER=demo` لا يختلق ملفات صوتية، وسيعرض رسالة أن المزود غير متاح. لتفعيل ElevenLabs:

```env
VOICE_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=...
```

يجب أن تحمل سجلات `voices` قيمة `provider = 'elevenlabs'` و`provider_voice_id` حقيقية. ملفات preview غير مضمنة لأن الأصوات العشرة بيانات Demo فقط.

الصوت المولّد يُرفع إلى bucket خاص ويُعاد كرابط موقّع مؤقت. لذلك تبقى مشاركة WhatsApp معطلة حتى تُنفذ آلية `publicShareUrl` مقصودة؛ لا توجد WhatsApp API مباشرة.

## أوامر الجودة

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

## النشر على Vercel

اربط المستودع بـVercel، أضف متغيرات `.env.example` المناسبة لكل بيئة، واجعل Build Command هو `npm run build`. طبّق migrations وseed على Supabase قبل فتح الموقع. جميع Route Handlers تعيد التحقق من المستخدم ولا تعتمد على Proxy وحده.

## حدود النسخة الحالية

- AI demo حتمي ومحلي؛ واجهة `AIService` جاهزة لمزود خارجي لكن لا توجد استدعاءات AI مدفوعة دون إعداد صريح.
- Voice Comparison وPerformance Variations ممثلتان في البنية المتعددة للمزودات والإعدادات، ولم تُعرضا كتوليد فعلي لأن دعم المزود لم يُثبت.
- إدارة الأصوات في الواجهة أولية؛ مصدر الحقيقة الدائم هو جدول `voices` والمigrations.

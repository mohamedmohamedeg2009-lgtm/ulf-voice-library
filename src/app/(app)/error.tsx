"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({retry}:{error:Error&{digest?:string};retry:()=>void}){return <div className="rounded-2xl border border-rose-400/15 bg-rose-400/5 p-8 text-center"><h1 className="text-xl font-bold text-white">حدث خطأ غير متوقع</h1><p className="my-3 text-sm text-slate-400">لم نتمكن من تحميل هذه الصفحة. لم يتم عرض أي تفاصيل داخلية.</p><Button onClick={retry}>إعادة المحاولة</Button></div>}

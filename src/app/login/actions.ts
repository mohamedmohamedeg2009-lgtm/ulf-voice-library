"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAllowedEmail } from "@/features/auth/authorization";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.email().trim().max(254),
  password: z.string().min(8).max(128),
});

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "تحقق من البريد وكلمة المرور." };
  if (!isAllowedEmail(parsed.data.email, process.env.ALLOWED_EMAIL)) {
    return { error: "هذا الحساب غير مصرح له بالدخول." };
  }
  const supabase = await createClient();
  if (!supabase) return { error: "أكمل إعداد Supabase في ملف البيئة أولًا." };
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "تعذر تسجيل الدخول. تحقق من البيانات وحاول مجددًا." };
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}

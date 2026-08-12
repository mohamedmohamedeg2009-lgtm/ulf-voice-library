import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAllowedEmail } from "./authorization";

export async function getAuthorizedUser() {
  const supabase = await createClient();
  if (!supabase) return { status: "unconfigured" as const, user: null };
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { status: "anonymous" as const, user: null };
  if (!isAllowedEmail(data.user.email, process.env.ALLOWED_EMAIL)) {
    await supabase.auth.signOut();
    return { status: "forbidden" as const, user: null };
  }
  return { status: "authorized" as const, user: data.user };
}

export async function requireUser() {
  const result = await getAuthorizedUser();
  if (result.status !== "authorized") redirect(`/login?reason=${result.status}`);
  return result.user;
}

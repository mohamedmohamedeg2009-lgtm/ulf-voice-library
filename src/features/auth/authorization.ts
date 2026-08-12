export function isAllowedEmail(email: string | null | undefined, allowedEmail: string | undefined): boolean {
  if (!email || !allowedEmail) return false;
  return email.trim().toLowerCase() === allowedEmail.trim().toLowerCase();
}

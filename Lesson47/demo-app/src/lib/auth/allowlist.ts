export function parseAllowlist(): Set<string> {
  const raw = process.env.BETA_ALLOWLIST_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isEmailAllowlisted(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = parseAllowlist();
  if (list.size === 0 && process.env.AUTH_DEV_BYPASS === "true") {
    return true;
  }
  return list.has(email.toLowerCase());
}

export function getSoftCap(): number {
  const n = Number(process.env.BETA_SOFT_CAP ?? "100");
  return Number.isFinite(n) && n > 0 ? n : 100;
}

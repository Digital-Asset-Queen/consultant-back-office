import type { Language } from "@/i18n/translations";

// ───────────────────────── Locale state ─────────────────────────
// Module-level current locale. Defaults to "en" so legacy callers behave
// unchanged until LanguageProvider calls setLocale() on mount.
let currentLocale: Language = "en";

/** Switch the locale used by all formatting helpers below. */
export function setLocale(lang: Language): void {
  currentLocale = lang;
}

/** Read the active locale (rarely needed outside this module). */
export function getLocale(): Language {
  return currentLocale;
}

const THAI_LOCALE = "th-TH";
const ENGLISH_LOCALE = "en-US";

function activeIntlLocale(): string {
  return currentLocale === "th" ? THAI_LOCALE : ENGLISH_LOCALE;
}

// ───────────────────────── Helpers ─────────────────────────
/** Normalize a bigint nanos / number ms / ISO string input to epoch ms. */
function toMs(
  value: bigint | number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || value === 0n || value === 0)
    return null;
  let ms: number;
  if (typeof value === "bigint") {
    ms = Number(value) / 1_000_000;
  } else if (typeof value === "number") {
    ms = value > 1e12 ? value / 1_000_000 : value;
  } else {
    ms = new Date(value).getTime();
  }
  if (!Number.isFinite(ms)) return null;
  return ms;
}

// ───────────────────────── Currency ─────────────────────────
export function formatCurrency(
  value: number | bigint | null | undefined,
  currency = "USD",
): string {
  if (value === null || value === undefined) {
    return currentLocale === "th" ? "฿0" : "$0";
  }
  const num = typeof value === "bigint" ? Number(value) : value;
  if (currentLocale === "th") {
    // Thai: ฿ symbol with THB code, Thai digit grouping.
    return new Intl.NumberFormat(THAI_LOCALE, {
      style: "currency",
      currency: currency === "USD" ? "THB" : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }
  return new Intl.NumberFormat(ENGLISH_LOCALE, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// ───────────────────────── Dates ─────────────────────────
export function formatDate(
  value: bigint | number | string | null | undefined,
): string {
  const ms = toMs(value);
  if (ms === null) return "\u2014";
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "\u2014";
  return new Intl.DateTimeFormat(activeIntlLocale(), {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(currentLocale === "th" ? { calendar: "buddhist" } : {}),
  }).format(date);
}

export function formatDateShort(
  value: bigint | number | string | null | undefined,
): string {
  const ms = toMs(value);
  if (ms === null) return "\u2014";
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "\u2014";
  return new Intl.DateTimeFormat(activeIntlLocale(), {
    month: "short",
    day: "numeric",
    ...(currentLocale === "th" ? { calendar: "buddhist" } : {}),
  }).format(date);
}

export function formatDateISO(
  value: bigint | number | string | null | undefined,
): string {
  const ms = toMs(value);
  if (ms === null) return "";
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "";
  // Gregorian ISO date — input controls expect yyyy-MM-dd regardless of locale.
  return date.toISOString().split("T")[0];
}

export function formatDateInput(
  value: bigint | number | string | null | undefined,
): string {
  return formatDateISO(value);
}

// ───────────────────────── Numbers ─────────────────────────
export function formatNumber(
  value: number | bigint | null | undefined,
): string {
  if (value === null || value === undefined) return "0";
  const num = typeof value === "bigint" ? Number(value) : value;
  return num.toLocaleString(activeIntlLocale());
}

// ───────────────────────── Hours / Duration ─────────────────────────
export function formatHours(value: number | bigint | null | undefined): string {
  if (value === null || value === undefined) {
    return currentLocale === "th" ? "0 ชม." : "0h";
  }
  const num = typeof value === "bigint" ? Number(value) : value;
  const rounded = Math.round(num * 10) / 10;
  return currentLocale === "th" ? `${rounded} ชม.` : `${rounded}h`;
}

export function formatDuration(minutes: bigint | number): string {
  const mins = typeof minutes === "bigint" ? Number(minutes) : minutes;
  if (!Number.isFinite(mins)) {
    return currentLocale === "th" ? "0 นาที" : "0m";
  }
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (currentLocale === "th") {
    if (h === 0) return `${m} นาที`;
    if (m === 0) return `${h} ชม.`;
    return `${h} ชม. ${m} นาที`;
  }
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ───────────────────────── Relative dates ─────────────────────────
export function formatRelativeDate(
  value: bigint | number | string | null | undefined,
): string {
  const ms = toMs(value);
  if (ms === null) return "";
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86_400_000);

  if (currentLocale === "th") {
    if (days === 0) return "วันนี้";
    if (days === 1) return "เมื่อวาน";
    if (days < 7) return `${days} วันที่แล้ว`;
    if (days < 30) return `${Math.floor(days / 7)} สัปดาห์ที่แล้ว`;
    if (days < 365) return `${Math.floor(days / 30)} เดือนที่แล้ว`;
    return `${Math.floor(days / 365)} ปีที่แล้ว`;
  }

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ───────────────────────── Misc (locale-independent) ─────────────────────────
export function dateToNanos(dateStr: string): bigint {
  if (!dateStr) return 0n;
  const ms = new Date(dateStr).getTime();
  if (!Number.isFinite(ms)) return 0n;
  return BigInt(ms) * 1_000_000n;
}

export function getInitials(name: string): string {
  if (!name?.trim()) return "?";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getInvoiceAgeDays(
  dueDateNanos: bigint | number | null | undefined,
): number {
  if (dueDateNanos === null || dueDateNanos === undefined) return 0;
  let ms: number;
  if (typeof dueDateNanos === "bigint") {
    ms = Number(dueDateNanos) / 1_000_000;
  } else {
    ms = dueDateNanos > 1e12 ? dueDateNanos / 1_000_000 : dueDateNanos;
  }
  if (!Number.isFinite(ms) || ms === 0) return 0;
  return Math.floor((Date.now() - ms) / 86_400_000);
}

export function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (
    [
      "active",
      "paid",
      "signed",
      "accepted",
      "won",
      "complete",
      "completed",
    ].includes(s)
  )
    return "text-success";
  if (
    ["pending", "sent", "draft", "proposed", "in progress", "partial"].includes(
      s,
    )
  )
    return "text-warning";
  if (["overdue", "lost", "expired", "terminated", "at risk"].includes(s))
    return "text-danger";
  if (["on hold", "paused", "cooling"].includes(s))
    return "text-muted-foreground";
  return "text-foreground";
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function toNumber(value: number | bigint | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "bigint" ? Number(value) : value;
}

export { cn } from "./utils";

import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  formatCurrency as fmtCurrency,
  formatDate as fmtDate,
  formatHours as fmtHours,
} from "./formatting";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format a bigint nanosecond timestamp to a locale-aware date string.
// Delegates to formatting.ts so the active locale (set via setLocale) applies.
export function formatDate(nanoseconds: bigint | undefined | null): string {
  if (!nanoseconds) return "—";
  return fmtDate(nanoseconds);
}

// Format a number amount as currency, respecting the active locale
// (Thai => ฿/THB with Thai grouping; English => $/USD with en-US grouping).
export function formatCurrency(amount: number | undefined | null): string {
  if (amount == null) return fmtCurrency(null);
  return fmtCurrency(amount);
}

// Format a bigint amount (stored as fixed-point cents*100) as currency.
export function formatCurrencyBigInt(
  amount: bigint | undefined | null,
): string {
  if (amount == null) return fmtCurrency(null);
  return fmtCurrency(Number(amount) / 100);
}

// Format bigint minutes as a locale-aware hours string ("X.Xh" / "X.X ชม.").
export function formatHours(minutes: bigint | undefined | null): string {
  if (minutes == null) return fmtHours(null);
  return fmtHours(minutes);
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function getDaysRemaining(deadline: Date | string): {
  days: number;
  label: string;
  isUrgent: boolean;
  isExpired: boolean;
} {
  const d = typeof deadline === "string" ? new Date(deadline) : deadline;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { days, label: `Expired ${Math.abs(days)}d ago`, isUrgent: true, isExpired: true };
  }
  if (days === 0) {
    return { days: 0, label: "Due today", isUrgent: true, isExpired: false };
  }
  if (days === 1) {
    return { days: 1, label: "Due tomorrow", isUrgent: true, isExpired: false };
  }
  return {
    days,
    label: `${days} days left`,
    isUrgent: days <= 5,
    isExpired: false,
  };
}

export function formatRefNumber(ref: string): string {
  return ref.toUpperCase();
}

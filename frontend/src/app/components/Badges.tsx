import React from "react";

export function UrgencyBadge({ level }: { level: string | null }) {
  const map: Record<string, string> = {
    Critical: "bg-red-100 text-red-800 ring-1 ring-red-200 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-800",
    High:     "bg-orange-100 text-orange-800 ring-1 ring-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:ring-orange-800",
    Medium:   "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:ring-yellow-800",
    Low:      "bg-green-100 text-green-800 ring-1 ring-green-200 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-800",
  };
  const label = level ?? "Unknown";
  const cls = map[label] ?? "bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const isAnalyzed = status === "analyzed";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isAnalyzed
          ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-800"
          : "bg-blue-100 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:ring-blue-800"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isAnalyzed ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
      {isAnalyzed ? "Analyzed" : "Pending"}
    </span>
  );
}

export function SeverityScore({ score }: { score: number | null }) {
  if (score === null) return <span className="text-sm text-gray-400 dark:text-gray-500">—</span>;

  const color =
    score >= 80 ? "text-red-600 dark:text-red-400" :
    score >= 60 ? "text-orange-600 dark:text-orange-400" :
    score >= 40 ? "text-yellow-600 dark:text-yellow-400" :
    "text-green-600 dark:text-green-400";

  return (
    <span className={`text-sm font-semibold font-mono ${color}`}>{score}<span className="text-xs font-normal text-gray-400 dark:text-gray-500">/100</span></span>
  );
}

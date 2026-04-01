"use client";

import React, { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UrgencyBadge, StatusBadge, SeverityScore } from "./Badges";
import { getTicket, Ticket } from "../lib/api";

const POLL_INTERVAL = 5000;

function TicketDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams?.get("id");
  const id = idParam ? Number(idParam) : NaN;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getTicket(id);
      setTicket(data);
    } catch {
      setError("Ticket not found or server unavailable.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTicket(); }, [fetchTicket]);

  useEffect(() => {
    if (!ticket || ticket.status === "analyzed") return;
    const interval = setInterval(() => fetchTicket(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [ticket, fetchTicket]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 mb-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tickets
      </button>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Loading ticket…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <Link href="/tickets" className="text-sm text-blue-600 dark:text-blue-400 underline cursor-pointer">Return to Ticket List</Link>
        </div>
      ) : ticket ? (
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500">#{ticket.id}</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">{ticket.title}</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Submitted by <span className="font-medium text-gray-700 dark:text-gray-300">{ticket.submitted_by}</span>
                  &nbsp;·&nbsp;{formatDate(ticket.created_at)}
                </p>
              </div>
              <UrgencyBadge level={ticket.urgency_level} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Description</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">AI Analysis</h2>

              {ticket.status === "pending" ? (
                <div className="flex flex-col items-center justify-center h-32 gap-3 text-gray-400 dark:text-gray-500">
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-sm text-center">AI is analysing this ticket…</p>
                  <p className="text-xs">Auto-refreshing every {POLL_INTERVAL / 1000}s</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Urgency Level</span>
                    <UrgencyBadge level={ticket.urgency_level} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Severity Score</span>
                    <SeverityScore score={ticket.severity_score} />
                  </div>
                  {ticket.reasoning && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Reasoning</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{ticket.reasoning}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm px-6 py-4">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Created: <span className="text-gray-700 dark:text-gray-300 font-medium">{formatDate(ticket.created_at)}</span></span>
              <span>Updated: <span className="text-gray-700 dark:text-gray-300 font-medium">{formatDate(ticket.updated_at)}</span></span>
              <span>Ticket ID: <span className="font-mono text-gray-700 dark:text-gray-300 font-medium">#{ticket.id}</span></span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TicketDetail() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-24">
        <svg className="w-8 h-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    }>
      <TicketDetailContent />
    </Suspense>
  );
}

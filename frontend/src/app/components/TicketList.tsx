"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { UrgencyBadge, StatusBadge, SeverityScore } from "./Badges";
import { getTickets, Ticket } from "../lib/api";

const POLL_INTERVAL = 8000;

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [sortField, setSortField] = useState<keyof Ticket>("id");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchTickets = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getTickets();
      setTickets(data);
      setLastRefresh(new Date());
    } catch {
      setError("Could not load tickets. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  useEffect(() => {
    const hasPending = tickets.some((t) => t.status === "pending");
    if (!hasPending) return;
    const id = setInterval(() => fetchTickets(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [tickets, fetchTickets]);

  const handleSort = (field: keyof Ticket) => {
    if (field !== "urgency_level" && field !== "severity_score") return;
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const urgencyWeight: Record<string, number> = {
    "Critical": 4,
    "High": 3,
    "Medium": 2,
    "Low": 1,
    "Unknown": 0
  };

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === "all") return true;
    return t.status === statusFilter;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (aValue === null) aValue = "";
    if (bValue === null) bValue = "";

    if (sortField === "urgency_level") {
      aValue = urgencyWeight[a.urgency_level || "Unknown"] || 0;
      bValue = urgencyWeight[b.urgency_level || "Unknown"] || 0;
    } else if (sortField === "severity_score") {
      aValue = a.severity_score || 0;
      bValue = b.severity_score || 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: keyof Ticket }) => {
    if (field !== "urgency_level" && field !== "severity_score") return null;
    if (sortField !== field) {
      return (
        <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg className="w-3 h-3 text-blue-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-blue-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ticket Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {lastRefresh ? `Last updated ${lastRefresh.toLocaleTimeString()}` : "Loading…"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="analyzed">Analyzed</option>
          </select>
          <button
            onClick={() => fetchTickets()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
          >
            + New Ticket
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Tickets", value: tickets.length, color: "text-gray-900 dark:text-white" },
          { label: "Pending AI", value: tickets.filter(t => t.status === "pending").length, color: "text-blue-600 dark:text-blue-400" },
          { label: "Analyzed", value: tickets.filter(t => t.status === "analyzed").length, color: "text-emerald-600 dark:text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {tickets.some(t => t.status === "pending") && (
        <div className="flex items-center gap-2 mb-4 text-xs text-blue-600 dark:text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Auto-refreshing every {POLL_INTERVAL / 1000}s — AI is processing pending tickets…
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400 dark:text-gray-500">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Loading tickets…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button onClick={() => fetchTickets()} className="mt-2 text-sm text-blue-600 dark:text-blue-400 underline">Retry</button>
        </div>
      ) : sortedTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400 dark:text-gray-500">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">No tickets found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_160px_120px_80px_80px_40px] gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
            {[
              { label: "Title", field: "title" as keyof Ticket },
              { label: "Submitted By", field: "submitted_by" as keyof Ticket },
              { label: "Urgency", field: "urgency_level" as keyof Ticket, sortable: true },
              { label: "Severity", field: "severity_score" as keyof Ticket, sortable: true },
              { label: "Status", field: "status" as keyof Ticket }
            ].map((col) => (
              col.sortable ? (
                <button
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="group flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {col.label}
                  <SortIcon field={col.field} />
                </button>
              ) : (
                <span key={col.field} className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {col.label}
                </span>
              )
            ))}
            <span></span>
          </div>

          <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedTickets.map((ticket) => (
              <li key={ticket.id}>
                <Link href={`/details?id=${ticket.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer">
                  <div className="md:hidden p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{ticket.title}</p>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by {ticket.submitted_by}</p>
                    <div className="flex items-center gap-3">
                      <UrgencyBadge level={ticket.urgency_level} />
                      <SeverityScore score={ticket.severity_score} />
                    </div>
                  </div>

                  <div className="hidden md:grid grid-cols-[1fr_160px_120px_80px_80px_40px] gap-4 items-center px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{ticket.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">{ticket.description}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{ticket.submitted_by}</p>
                    <div><UrgencyBadge level={ticket.urgency_level} /></div>
                    <div><SeverityScore score={ticket.severity_score} /></div>
                    <div><StatusBadge status={ticket.status} /></div>
                    <div className="flex justify-end">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

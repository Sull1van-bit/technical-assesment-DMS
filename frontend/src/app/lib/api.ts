const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  submitted_by: string;
  status: "pending" | "analyzed";
  urgency_level: string | null;
  severity_score: number | null;
  reasoning: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketCreate {
  title: string;
  description: string;
  submitted_by: string;
}

export async function createTicket(data: TicketCreate): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create ticket");
  }
  return res.json();
}

export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_BASE}/tickets`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export async function getTicket(id: number): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Ticket not found");
  return res.json();
}

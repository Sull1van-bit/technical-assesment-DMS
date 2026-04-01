import React from "react";
import Header from "../components/Header";
import TicketDetail from "../components/TicketDetail";

export default function TicketDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <main className="flex-1 w-full flex items-start justify-center">
        <TicketDetail />
      </main>
    </div>
  );
}

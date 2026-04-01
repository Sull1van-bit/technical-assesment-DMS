import React from "react";
import Header from "../components/Header";
import SubmitTicketForm from "../components/SubmitTicketForm";

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <SubmitTicketForm />
      </main>
    </div>
  );
}

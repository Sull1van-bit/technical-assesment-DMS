"use client";

import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/submit"
            className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            Submit Ticket
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <DarkModeSwitch />
        </div>
      </div>
    </header>
  );
}

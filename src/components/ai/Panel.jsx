import React from "react";

export default function Panel({ title, right, children, className = "" }) {
  return (
    <section
      className={`bg-[var(--panel,#0c123a)] border border-[var(--border,#1a214b)] rounded-2xl shadow-sm ${className}`}
    >
      <header className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[var(--border,#1a214b)]">
        <h2 className="text-sm sm:text-base font-semibold text-[var(--text,#e6e6f2)]">
          {title}
        </h2>
        <div>{right}</div>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

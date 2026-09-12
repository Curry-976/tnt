"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/collection?q=${encodeURIComponent(q)}` : "/collection");
  }

  return (
    <form className="nav-search-form" onSubmit={handleSubmit} role="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5"></circle>
        <path d="M15.5 15.5 21 21"></path>
      </svg>
      <input
        type="search"
        className="nav-search-input"
        placeholder="Rechercher"
        aria-label="Rechercher un maillot"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}

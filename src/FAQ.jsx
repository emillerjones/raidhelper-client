import React, { useState } from "react";
import "./FAQ.css";

const FAQS = [
  {
    q: "Do I need an account to use Horizon?",
    a: "No. Anyone can view a guild's raid calendar instantly — no Discord login, signup, or installation required.",
    icon: "user",
  },
  {
    q: "What is Horizon?",
    a: "Horizon is a unified raid calendar for Discord communities. Instead of checking multiple servers and channels, you can see all your upcoming raids in one place.",
    icon: "calendar",
  },
  {
    q: "Can I see raids from multiple guilds or servers in one place?",
    a: "Yes. That's the core idea. Horizon gathers raids from multiple communities and displays them on a single calendar.",
    icon: "users",
  },
  {
    q: "Do I need to install anything?",
    a: "Only if you want raids added automatically. The Chrome extension can scan Discord raid posts and sync them into Horizon, but viewing the calendar never requires it.",
    icon: "download",
  },
  {
    q: "What does the extension actually do?",
    a: "It scans Discord raid posts and imports them into Horizon. After a scan, you'll see how many raids were found, how many were new, which servers were scanned, and how long it took.",
    icon: "puzzle",
  },
  {
    q: "Does the extension read my Discord messages?",
    a: "No. It only looks for raid event information. We don't access, store, or analyze your normal conversations.",
    icon: "shield",
  },
  {
    q: "Why use Horizon instead of Discord?",
    a: "Discord is great for communication. Horizon is built for visibility. Instead of hunting through channels and servers, you can see everything on one calendar.",
    icon: "bolt",
  },
  {
    q: "Which version of WoW does Horizon support?",
    a: "Horizon is currently focused on WoW Classic Era and the way Classic guilds organize and schedule raids.",
    icon: "controller",
  },
  {
    q: "How often is the calendar updated?",
    a: "Whenever someone runs a scan with the extension, the calendar updates right away — there's no automatic background syncing yet.",
    icon: "refresh",
  },
  {
    q: "Is Horizon free?",
    a: "Yes. Horizon is currently free to use.",
    icon: "check",
  },
  {
    q: "Where do I get the extension?",
    a: "The extension will be available through the Chrome Web Store. A direct download link will be provided once it's published.",
    icon: "chrome",
  },
];

const ICONS = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M14.5 15.2c2.5.3 4.5 1.9 4.5 4.3" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  ),
  puzzle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 4h2a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2h-2a2 2 0 1 0-4 0H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8a2 2 0 0 1 2-2h2a2 2 0 1 0 4 0z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  ),
  controller: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="8" width="20" height="10" rx="5" />
      <path d="M7 12h.01M9 14h.01M9 10h.01M7 12h0M17 11h2M18 10v2" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4v6h6M20 20v-6h-6" />
      <path d="M5.5 9a7 7 0 0 1 12.4-2.5M18.5 15a7 7 0 0 1-12.4 2.5" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  chrome: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6M5 8.5l5.2 3M18 15.5l-5.2-3" />
    </svg>
  ),
};

export default function FAQ() {
  const [query, setQuery] = useState("");

  const filtered = FAQS.filter((item) => {
    const text = (item.q + " " + item.a).toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <p className="faq-eyebrow">FAQ</p>
        <h1 className="faq-headline">
          Common questions, <span className="faq-gradient">clear answers.</span>
        </h1>
        <p className="faq-subhead">
          Everything you need to know before trying Horizon.
        </p>

        <div className="faq-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="faq-search-icon">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="faq-grid">
        {filtered.map((item) => (
          <div className="faq-card" key={item.q}>
            <span className="faq-card-icon">{ICONS[item.icon]}</span>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="faq-empty">No questions match "{query}".</p>
        )}
      </section>
    </div>
  );
}

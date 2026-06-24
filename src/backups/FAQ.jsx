import React, { useState } from "react";
import "./FAQ.css";

const FAQS = [
  {
    q: "Do I need an account to use Horizon?",
    a: "No. Anyone can view a guild's raid calendar instantly — no Discord login, signup, or installation required.",
  },
  {
    q: "What is Horizon?",
    a: "Horizon is a unified raid calendar for Discord communities. Instead of checking multiple servers and channels, you can see all your upcoming raids in one place.",
  },
  {
    q: "Can I see raids from multiple guilds or servers in one place?",
    a: "Yes. That's the core idea. Horizon gathers raids from multiple communities and displays them on a single calendar.",
  },
  {
    q: "Do I need to install anything?",
    a: "Only if you want raids added automatically. The Chrome extension can scan Discord raid posts and sync them into Horizon, but viewing the calendar never requires it.",
  },
  {
    q: "What does the extension actually do?",
    a: "It scans Discord raid posts and imports them into Horizon. After a scan, you'll see how many raids were found, how many were new, which servers were scanned, and how long it took.",
  },
  {
    q: "Does the extension read my Discord messages?",
    a: "No. It only looks for raid event information. We don't access, store, or analyze your normal conversations.",
  },
  {
    q: "Why use Horizon instead of Discord?",
    a: "Discord is great for communication. Horizon is built for visibility. Instead of hunting through channels and servers, you can see everything on one calendar.",
  },
  {
    q: "Which version of WoW does Horizon support?",
    a: "Horizon is currently focused on WoW Classic Era and the way Classic guilds organize and schedule raids.",
  },
  {
    q: "How often is the calendar updated?",
    a: "Whenever someone runs a scan with the extension, the calendar updates right away — there's no automatic background syncing yet.",
  },
  {
    q: "Is Horizon free?",
    a: "Yes. Horizon is currently free to use.",
  },
  {
    q: "Where do I get the extension?",
    a: "The extension will be available through the Chrome Web Store. A direct download link will be provided once it's published.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <p className="faq-eyebrow">FAQ</p>
        <h1 className="faq-headline">Common questions</h1>
        <p className="faq-subhead">
          Everything you'd want to know before trying Horizon.
        </p>
      </section>

      <section className="faq-list">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={`faq-item ${isOpen ? "faq-item-open" : ""}`} key={item.q}>
              <button
                className="faq-question"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="faq-chevron"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {isOpen && <p className="faq-answer">{item.a}</p>}
            </div>
          );
        })}
      </section>
    </div>
  );
}

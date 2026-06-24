import React, { useEffect, useRef, useState } from "react";
import "./HowItWorks.css";

const IFRAME_NATURAL_WIDTH = 1600;
const IFRAME_NATURAL_HEIGHT = 900;

const VIEW_BULLETS = [
  "Open a calendar link",
  "See every raid across your guilds",
  "Works in any browser",
  "That's it. You're in.",
];

const EXTENSION_STEPS = [
  { num: 1, label: "Install the extension" },
  { num: 2, label: "Scan Discord" },
  { num: 3, label: "Raids appear in Horizon" },
];

const SCAN_STATS = [
  { value: "2", label: "Raids found" },
  { value: "0", label: "New" },
  { value: "2", label: "Updated" },
  { value: "1", label: "Servers scanned" },
];

const SCAN_ENTRIES = [
  {
    title: "Ony 6PM ZG to follow",
    date: "6/17/2026, 5:00:00 PM",
    leader: "ltsQueenB",
    signups: "20/24 signups",
    softres: "dptcbu",
  },
  {
    title: "ZG right after Ony so probably 6:20PM",
    date: "6/17/2026, 5:30:00 PM",
    leader: "ltsQueenB",
    signups: "20/23 signups",
    softres: "uozahq",
  },
];

const TRUST_ITEMS = [
  {
    icon: "shield",
    color: "blue",
    title: "Reads raid events only",
    desc: "We only look for raid posts and event information.",
  },
  {
    icon: "lock",
    color: "purple",
    title: "Your messages stay private",
    desc: "We don't read or access your DMs or private conversations.",
  },
  {
    icon: "bolt",
    color: "green",
    title: "One-click scan",
    desc: "Scan any server (or all servers) with a single click.",
  },
  {
    icon: "chrome",
    color: "chrome",
    title: "Chrome extension",
    desc: "Coming soon to the Chrome Web Store.",
  },
];

const TRUST_ICONS = {
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
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
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  ),
  chrome: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#fff" />
      <path d="M12 3a9 9 0 0 1 7.79 4.5H12a4.5 4.5 0 0 0-3.9 2.25L4.21 7.5A9 9 0 0 1 12 3z" fill="#EA4335" />
      <path d="M19.79 7.5A9 9 0 0 1 12 21l3.9-6.75A4.5 4.5 0 0 0 16.5 12a4.5 4.5 0 0 0-.6-2.25h3.89z" fill="#34A853" />
      <path d="M12 21a9 9 0 0 1-7.79-13.5L8.1 14.25A4.5 4.5 0 0 0 12 16.5a4.5 4.5 0 0 0 1.95-.45L12 21z" fill="#4285F4" />
      <circle cx="12" cy="12" r="3.6" fill="#fff" />
      <circle cx="12" cy="12" r="2.6" fill="#4285F4" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4v6h6M20 20v-6h-6" />
      <path d="M5.5 9a7 7 0 0 1 12.4-2.5M18.5 15a7 7 0 0 1-12.4 2.5" />
    </svg>
  ),
};

const LiveCalendarPreview = () => {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.offsetWidth;
      if (width > 0) {
        setScale(width / IFRAME_NATURAL_WIDTH);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hiw-iframe-wrap" ref={wrapRef}>
      <iframe
        src="https://raidhelper-client.vercel.app/calendar"
        title="Raid Calendar live preview"
        className="hiw-iframe"
        style={{
          width: `${IFRAME_NATURAL_WIDTH}px`,
          height: `${IFRAME_NATURAL_HEIGHT}px`,
          transform: `scale(${scale})`,
        }}
        loading="lazy"
      />
    </div>
  );
};

export default function HowItWorks() {
  return (
    <div className="hiw-page">
      <section className="hiw-hero">
        {/* <p className="hiw-eyebrow">HOW IT WORKS</p> */}
        <h1 className="hiw-headline">
          Your raid week,<br />in <span className="hiw-gradient">one calendar.</span>
        </h1>
        <p className="hiw-subhead">
          Horizon brings upcoming raids from all your Discord communities
          into one calendar, so you always know what's next.
        </p>

        <div className="hiw-pills">
          <span className="hiw-pill hiw-pill-green">No account required</span>
          <span className="hiw-pill-dot">•</span>
          <span className="hiw-pill hiw-pill-green">No extension required</span>
          <span className="hiw-pill-dot">•</span>
          <span className="hiw-pill hiw-pill-blue">Just open a link</span>
        </div>
      </section>

      <section className="hiw-steps-row">
        <div className="hiw-step-card hiw-step-primary">
          <span className="hiw-step-badge hiw-step-badge-green">No extension needed</span>

          <div className="hiw-step-heading">
            <span className="hiw-step-icon hiw-step-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <h2>1. Use Horizon instantly</h2>
          </div>

          <p className="hiw-step-lead">View any raid calendar in seconds. No login. No install.</p>
          <ul className="hiw-checklist">
            {VIEW_BULLETS.map((b) => (
              <li key={b}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12l3 3 5-6" />
                </svg>
                {b}
              </li>
            ))}
          </ul>

          <LiveCalendarPreview />
        </div>

        <div className="hiw-step-card">
          <span className="hiw-step-badge hiw-step-badge-purple">Optional extension</span>

          <div className="hiw-step-heading">
            <span className="hiw-step-icon hiw-step-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 4h2a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2h-2a2 2 0 1 0-4 0H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8a2 2 0 0 1 2-2h2a2 2 0 1 0 4 0z" />
              </svg>
            </span>
            <h2>2. Add raids automatically?</h2>
          </div>

          <p className="hiw-step-lead">
            Use the optional Chrome extension to scan Discord and import raids.
          </p>

          <div className="hiw-mini-steps">
            {EXTENSION_STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="hiw-mini-step">
                  <span className="hiw-mini-step-num">{s.num}</span>
                  <p>{s.label}</p>
                </div>
                {i < EXTENSION_STEPS.length - 1 && <span className="hiw-mini-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="hiw-mock-scanner">
            <div className="hiw-scanner-header">
              Current-server scan complete: <span className="hiw-scanner-guild">LetsGua</span>
            </div>

            <div className="hiw-scanner-stats">
              {SCAN_STATS.map((stat, i) => (
                <div className={`hiw-scanner-stat hiw-scanner-stat-${["purple", "green", "amber", "blue"][i]}`} key={stat.label}>
                  <p className="hiw-scanner-stat-value">{stat.value}</p>
                  <p className="hiw-scanner-stat-label">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="hiw-scanner-entries">
              {SCAN_ENTRIES.map((entry) => (
                <div className="hiw-scanner-entry" key={entry.title}>
                  <p className="hiw-scanner-entry-title">{entry.title}</p>
                  <p className="hiw-scanner-entry-meta">{entry.date}</p>
                  <p className="hiw-scanner-entry-meta">Leader: {entry.leader} · {entry.signups}</p>
                  <p className="hiw-scanner-entry-meta">SoftRes: {entry.softres}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-trust">
        <h2 className="hiw-trust-title">Built with trust in mind.</h2>
        <div className="hiw-trust-grid">
          {TRUST_ITEMS.map((item) => (
            <div className="hiw-trust-item" key={item.title}>
              <span className={`hiw-trust-icon hiw-trust-icon-${item.color}`}>{TRUST_ICONS[item.icon]}</span>
              <div className="hiw-trust-item-text">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

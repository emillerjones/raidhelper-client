import React, { useEffect, useRef, useState } from "react";
import "./HorizonSplash.css";
import earthBg from "./assets/earth-bg.jpg";
// import HorizonNav from "./layout/Navbar.jsx";

const IFRAME_NATURAL_WIDTH = 1600;
const IFRAME_NATURAL_HEIGHT = 900;

const FEATURES = [
  {
    title: "Unified Calendar",
    desc: "All your Discord communities in one place. See every event in a single, convenient view.",
    icon: "calendar",
  },
  {
    title: "Real-Time Updates",
    desc: "Events sync in real time so you're always up to date without lifting a finger.",
    icon: "bolt",
  },
  {
    title: "Smart Alerts",
    desc: "Get notified about the events that matter most to you.",
    icon: "bell",
  },
  {
    title: "Built for Raiders",
    desc: "Designed by gamers, for gamers. Fast, powerful, and reliable.",
    icon: "shield",
  },
  {
    title: "Privacy First",
    desc: "We never access your messages. Your data stays private.",
    icon: "lock",
  },
];

const ICONS = {
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
      <circle cx="8" cy="13" r="0.5" fill="currentColor" />
      <circle cx="12" cy="13" r="0.5" fill="currentColor" />
      <circle cx="16" cy="13" r="0.5" fill="currentColor" />
      <circle cx="8" cy="17" r="0.5" fill="currentColor" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
};

/* Embeds the real, live Raid Calendar app and scales its full-size
   render down to fit the available width, so the real app's own
   responsive breakpoints don't kick in awkwardly at a tiny iframe size. */
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
    <div className="horizon-app-iframe-wrap" ref={wrapRef}>
      <iframe
        src="https://raidhelper-client.vercel.app/"
        title="Raid Calendar live preview"
        className="horizon-app-iframe"
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

export default function HorizonSplash() {
  return (
    <div className="horizon-page">
      {/* Earth photo background */}
      <div
        className="horizon-hero-bg"
        style={{ backgroundImage: `url(${earthBg})` }}
        aria-hidden="true"
      />
      <div className="horizon-hero-bg-fade" aria-hidden="true" />

      {/* <HorizonNav /> */}

      {/* Hero */}
      <section className="horizon-hero">
        <div className="horizon-hero-copy">
          <span className="horizon-eyebrow">DISCORD EVENT CALENDAR</span>
          <h1 className="horizon-headline">
            Your raid week<br />in one calendar.
          </h1>
          <p className="horizon-subhead">
            Horizon brings upcoming raids from all your Discord communities
            into one calendar, so you always know what's next.
          </p>
          <div className="horizon-cta-row">
            <button className="horizon-btn horizon-btn-light horizon-btn-lg">
              Get Started Free
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
            <button className="horizon-btn horizon-btn-outline horizon-btn-lg">
              See How It Works
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M6.5 5.5l4 2.5-4 2.5z" fill="currentColor" stroke="none" />
              </svg>
            </button>
          </div>
          <ul className="horizon-trust-row">
            <li>Works with any Discord server</li>
            <li>Private by design</li>
            <li>Real-time updates</li>
          </ul>
        </div>

        {/* Product preview - live embed of the real Raid Calendar app */}
        <div className="horizon-app-frame">
          <div className="horizon-app-glow" aria-hidden="true" />
          <LiveCalendarPreview />
        </div>
      </section>

      {/* Feature strip */}
      <section className="horizon-features">
        <p className="horizon-features-kicker">BUILT FOR PLAYERS. DESIGNED FOR CLARITY.</p>
        <div className="horizon-features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="horizon-feature">
              <span className="horizon-feature-icon">{ICONS[f.icon]}</span>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

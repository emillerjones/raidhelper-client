import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HorizonSplash.css";

const DESKTOP_IFRAME_WIDTH = 1600;
const DESKTOP_IFRAME_HEIGHT = 900;
const MOBILE_IFRAME_WIDTH = 390;
const MOBILE_IFRAME_HEIGHT = 780;
const MOBILE_BREAKPOINT = 768;

const FEATURES = [
  {
    title: "Unified Calendar",
    desc: "Every raid from every guild you follow, in one place.",
    icon: "calendar",
  },
  {
    title: "No Signup Needed",
    desc: "Open a link and see the calendar instantly. No account required.",
    icon: "bolt",
  },
  {
    title: "Built for Classic Era",
    desc: "Raid sizes and schedules that match how Classic Era guilds actually run.",
    icon: "shield",
  },
  {
    title: "Privacy First",
    desc: "We only read raid posts. Your messages stay private, always.",
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

// Tracks whether we're at/under the mobile breakpoint, same 768px threshold
// used by Navbar.jsx and raidhelperevents.jsx, so all three stay consistent.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

/* Embeds the real, live Raid Calendar app and scales its full-size
   render down to fit the available width, so the real app's own
   responsive breakpoints don't kick in awkwardly at a tiny iframe size.

   `kind` picks which native size to render the iframe at: "desktop"
   loads the full 7-day grid, "mobile" renders at a genuinely narrow
   width so the app's own mobile breakpoint kicks in and shows the
   swipeable day view instead of a tiny shrunk desktop layout. Showing
   the already-appropriately-sized mobile view (instead of a heavily
   scaled-down desktop one) also reduces the temptation to pinch-zoom
   the embed at all, which was implicated in the iOS Safari crash. */
const LiveCalendarPreview = ({ kind }) => {
  const wrapRef = useRef(null);
  const naturalWidth = kind === "mobile" ? MOBILE_IFRAME_WIDTH : DESKTOP_IFRAME_WIDTH;
  const naturalHeight = kind === "mobile" ? MOBILE_IFRAME_HEIGHT : DESKTOP_IFRAME_HEIGHT;
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Throttled so pinch-zoom on mobile (which fires a flood of resize
    // events mid-gesture) doesn't repeatedly re-apply transform: scale()
    // to the iframe while the browser's own native zoom transform is
    // also actively changing — two transform systems fighting over the
    // same element has been observed to break the iframe's navigation
    // state on iOS Safari ("Can't open this page").
    let rafId = null;
    const updateScale = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const width = el.offsetWidth;
        if (width > 0) {
          setScale(width / naturalWidth);
        }
      });
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [naturalWidth]);

  return (
    <div
      className={
        kind === "mobile"
          ? "horizon-app-iframe-wrap horizon-app-iframe-wrap--mobile"
          : "horizon-app-iframe-wrap"
      }
      ref={wrapRef}
    >
      <iframe
        src="https://raidhelper-client.vercel.app/calendar"
        title={kind === "mobile" ? "Raid Calendar live preview, mobile" : "Raid Calendar live preview"}
        className="horizon-app-iframe"
        style={{
          width: `${naturalWidth}px`,
          height: `${naturalHeight}px`,
          transform: `scale(${scale})`,
        }}
        loading="lazy"
      />
    </div>
  );
};

export default function HorizonSplash() {
  const isMobile = useIsMobile();

  return (
    <div className="horizon-page">
      {/* Hero */}
      <section className="horizon-hero">
        <div className="horizon-hero-copy">
          <span className="horizon-eyebrow">DISCORD EVENT CALENDAR</span>
          <h1 className="horizon-headline">
            See everything<br />ahead.
          </h1>
          <p className="horizon-subhead">
            Horizon brings every event from your Discord communities into one
            powerful calendar so you never miss what matters.
          </p>
          <div className="horizon-cta-row">
            <Link to="/calendar" className="horizon-btn horizon-btn-light horizon-btn-lg">
              Open Calendar
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link to="/how-it-works" className="horizon-btn horizon-btn-outline horizon-btn-lg">
              See How It Works
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M6.5 5.5l4 2.5-4 2.5z" fill="currentColor" stroke="none" />
              </svg>
            </Link>
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
          <LiveCalendarPreview kind={isMobile ? "mobile" : "desktop"} />
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

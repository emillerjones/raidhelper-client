import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Features.css";

const DESKTOP_IFRAME_WIDTH = 1600;
const DESKTOP_IFRAME_HEIGHT = 900;
const MOBILE_IFRAME_WIDTH = 390;
const MOBILE_IFRAME_HEIGHT = 780;

function LiveFrame({ kind }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const naturalWidth = kind === "mobile" ? MOBILE_IFRAME_WIDTH : DESKTOP_IFRAME_WIDTH;
  const naturalHeight = kind === "mobile" ? MOBILE_IFRAME_HEIGHT : DESKTOP_IFRAME_HEIGHT;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.offsetWidth;
      if (width > 0) setScale(width / naturalWidth);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [naturalWidth]);

  return (
    <div className={kind === "mobile" ? "feat-iframe-wrap feat-iframe-wrap-mobile" : "feat-iframe-wrap feat-iframe-wrap-desktop"} ref={wrapRef}>
      <iframe
        src="https://raidhelper-client.vercel.app/calendar"
        title={kind === "mobile" ? "Horizon mobile calendar, live" : "Horizon desktop calendar, live"}
        className="feat-iframe"
        style={{
          width: `${naturalWidth}px`,
          height: `${naturalHeight}px`,
          transform: `scale(${scale})`,
        }}
        loading="lazy"
      />
    </div>
  );
}

export default function Features() {
  return (
    <div className="feat-page">
      <section className="feat-hero">
        
        <h1 className="feat-headline">
          One calendar.<br />Every raid.
        </h1>
        <p className="feat-subhead">
          Horizon pulls raid events from your Discord communities into a
          single calendar, built for WoW Classic Era.
        </p>

        <div className="feat-pills">
          <span className="feat-pill feat-pill-green">No account required</span>
          <span className="feat-pill-dot">•</span>
          <span className="feat-pill feat-pill-green">No extension required</span>
          <span className="feat-pill-dot">•</span>
          <span className="feat-pill feat-pill-blue">Just open a link</span>
        </div>
      </section>

      <section className="feat-lead">
        <div className="feat-lead-text">
          <span className="feat-lead-tag">No signup needed</span>
          <h2>Anyone can view a calendar instantly</h2>
          <p>
            No Discord login, no account, no install. Open a link and see
            every raid your guild has scheduled — that's it.
          </p>
        </div>
        <div className="feat-lead-text">
          <span className="feat-lead-tag">Optional extension</span>
          <h2>Raids appear automatically</h2>
          <p>
            Officers post raids in Discord like normal. The Horizon
            extension scans for them and keeps the calendar in sync — no
            manual data entry, ever.
          </p>
        </div>
      </section>

      <section className="feat-showcase">
        <div className="feat-showcase-header">
          <h2>
            See it before you believe it
            <span className="feat-live-badge">
              <span className="feat-live-dot" />
              Live
            </span>
          </h2>
          <p>This is the real app, embedded right here — try clicking around.</p>
        </div>
        <div className="feat-screens-row">
          <div className="feat-screen feat-screen-desktop">
            <LiveFrame kind="desktop" />
            <p className="feat-screen-caption">Full week, every guild — desktop</p>
          </div>
          <div className="feat-screen feat-screen-mobile">
            <LiveFrame kind="mobile" />
            <p className="feat-screen-caption">Swipe day to day — mobile</p>
          </div>
        </div>
      </section>

      <section className="feat-showcase">
        <div className="feat-showcase-header">
          <h2>Find your raid in seconds</h2>
          <p>Filter by guild, raid type, or both at once — or just start typing.</p>
        </div>
        <div className="feat-filters-row">
          <div className="feat-filter-shot">
            <img src="/images/filter-guild-screenshot.png" alt="Filtering the calendar by multiple guilds at once" />
            <p className="feat-filter-caption">Select multiple guilds</p>
          </div>
          <div className="feat-filter-shot">
            <img src="/images/filter-raidtype-screenshot.png" alt="Filtering the calendar by raid type" />
            <p className="feat-filter-caption">Narrow by raid type</p>
          </div>
        </div>
      </section>

      <section className="feat-stats">
        <div className="feat-stat">
          <p className="feat-stat-value">30+</p>
          <p className="feat-stat-label">Active Guilds</p>
        </div>
        <div className="feat-stat-divider" />
        <div className="feat-stat">
          <p className="feat-stat-value">300+</p>
          <p className="feat-stat-label">Raids tracked</p>
        </div>
        <div className="feat-stat-divider" />
        <div className="feat-stat-note">
          Already organizing real raid schedules — not just a demo.
        </div>
      </section>

      <section className="feat-grid">
        <div className="feat-card">
          <span className="feat-icon-wrap feat-icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </span>
          <h3>Unified, cross-server view</h3>
          <p>
            Pulling raids from multiple guilds and servers? See them all on
            one calendar instead of jumping between Discords.
          </p>
        </div>

        <div className="feat-card">
          <span className="feat-icon-wrap feat-icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" />
            </svg>
          </span>
          <h3>Built for Classic Era</h3>
          <p>
            Raid sizes, lockouts, and schedules that match how Classic Era
            guilds actually run — not a generic event calendar.
          </p>
        </div>

        <div className="feat-card">
          <span className="feat-icon-wrap feat-icon-coral">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 5h5v5M19 5 10 14" />
              <path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
            </svg>
          </span>
          <h3>One click to sign up</h3>
          <p>
            Click any raid and jump straight to its Discord signup post —
            no hunting through channels to find it.
          </p>
        </div>

        <div className="feat-card">
          <span className="feat-icon-wrap feat-icon-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>
          <h3>Privacy by design</h3>
          <p>
            The extension only reads raid posts, never your messages. We
            don't want or store anything else.
          </p>
        </div>
      </section>

      <section className="feat-cta">
        <div>
          <h2>See it for yourself</h2>
          <p>No signup required to look around.</p>
        </div>
        <Link to="/" className="horizon-btn horizon-btn-light feat-cta-btn">
          View the calendar
        </Link>
      </section>
    </div>
  );
}

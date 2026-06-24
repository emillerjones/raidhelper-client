import React from "react";
import { Link } from "react-router-dom";
import "./Features.css";

export default function Features() {
  return (
    <div className="feat-page">
      <section className="feat-hero">
        {/* <p className="feat-eyebrow">FEATURES</p> */}
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

      <section className="feat-stats">
        <div className="feat-stat">
          <p className="feat-stat-value">25</p>
          <p className="feat-stat-label">Guilds</p>
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
          <span className="feat-icon-wrap feat-icon-amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <h3>Search and filter everything</h3>
          <p>
            Filter by guild and raid type at the same time, or just start
            typing to search across every raid on the calendar.
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

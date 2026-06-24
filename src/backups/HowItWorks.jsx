import React from "react";
import "./HowItWorks.css";

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

const COMPARE_VIEW = [
  "No account needed",
  "No install needed",
  "Works instantly",
  "See raids from any shared link",
];

const COMPARE_EXTENSION = [
  "Extension required",
  "Install Chrome extension",
  "One-time setup",
  "Import raids from Discord",
];

const SCAN_RESULTS = [
  { guild: "LetsGua", found: 2 },
];

const SCAN_STATS = [
  { value: "2", label: "Raids found" },
  { value: "0", label: "New" },
  { value: "1", label: "Servers scanned" },
  { value: "15s", label: "Run time" },
];

export default function HowItWorks() {
  return (
    <div className="hiw-page">
      <section className="hiw-hero">
        <p className="hiw-eyebrow">HOW IT WORKS</p>
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

      <section className="hiw-step-card hiw-step-primary">
        <span className="hiw-step-badge hiw-step-badge-green">No extension needed</span>
        <div className="hiw-step-body">
          <div className="hiw-step-info">
            <span className="hiw-step-icon hiw-step-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <h2>1. Use Horizon instantly</h2>
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
          </div>

          <div className="hiw-mock-calendar">
            <div className="hiw-mock-cal-header">
              <span className="hiw-mock-brand">HORIZON</span>
              <span className="hiw-mock-select">Raid Calendar</span>
              <span className="hiw-mock-select">Filters</span>
            </div>
            <div className="hiw-mock-grid">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div className="hiw-mock-day-label" key={d}>{d}</div>
              ))}
              <div className="hiw-mock-cell">26</div>
              <div className="hiw-mock-cell">27</div>
              <div className="hiw-mock-cell">28</div>
              <div className="hiw-mock-cell">29</div>
              <div className="hiw-mock-cell">30</div>
              <div className="hiw-mock-cell">31</div>
              <div className="hiw-mock-cell">1</div>
              <div className="hiw-mock-cell">2</div>
              <div className="hiw-mock-cell">3</div>
              <div className="hiw-mock-cell">
                <span className="hiw-mock-event hiw-event-purple">BWL<br />7:00 PM</span>
              </div>
              <div className="hiw-mock-cell">5</div>
              <div className="hiw-mock-cell">6</div>
              <div className="hiw-mock-cell">7</div>
              <div className="hiw-mock-cell">8</div>
              <div className="hiw-mock-cell">9</div>
              <div className="hiw-mock-cell">
                <span className="hiw-mock-event hiw-event-green">MC<br />7:00 PM</span>
              </div>
              <div className="hiw-mock-cell">11</div>
              <div className="hiw-mock-cell">12</div>
              <div className="hiw-mock-cell">
                <span className="hiw-mock-event hiw-event-orange">ZG<br />6:30 PM</span>
              </div>
              <div className="hiw-mock-cell">
                <span className="hiw-mock-event hiw-event-blue">AQ40<br />8:00 PM</span>
              </div>
              <div className="hiw-mock-cell">
                <span className="hiw-mock-event hiw-event-red">Naxx<br />7:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-step-card">
        <span className="hiw-step-badge hiw-step-badge-purple">Optional extension</span>
        <div className="hiw-step-body">
          <div className="hiw-step-info">
            <span className="hiw-step-icon hiw-step-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 4h2a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2h-2a2 2 0 1 0-4 0H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8a2 2 0 0 1 2-2h2a2 2 0 1 0 4 0z" />
              </svg>
            </span>
            <h2>2. Want to add raids automatically?</h2>
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
          </div>

          <div className="hiw-mock-scanner">
            <div className="hiw-scanner-header">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hiw-scanner-icon">
                  <path d="M14 4h2a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2h-2a2 2 0 1 0-4 0H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8a2 2 0 0 1 2-2h2a2 2 0 1 0 4 0z" />
                </svg>
                Horizon Scanner
              </span>
              <span className="hiw-scanner-status">Scanning...</span>
            </div>
            {SCAN_RESULTS.map((r) => (
              <div className="hiw-scanner-row" key={r.guild}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="hiw-scanner-check">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12l3 3 5-6" />
                </svg>
                <span>{r.guild}</span>
                <span className="hiw-scanner-count">{r.found} raids found</span>
              </div>
            ))}
            <button className="hiw-scanner-btn">Stop scan</button>
          </div>
        </div>

        <div className="hiw-scan-report">
          <p className="hiw-scan-report-label">Every scan ends with a clear report</p>
          <div className="hiw-scan-stats">
            {SCAN_STATS.map((stat) => (
              <div className="hiw-scan-stat" key={stat.label}>
                <p className="hiw-scan-stat-value">{stat.value}</p>
                <p className="hiw-scan-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hiw-compare">
        <h2 className="hiw-compare-title">Clear difference. Simple choice.</h2>
        <div className="hiw-compare-grid">
          <div className="hiw-compare-col">
            <div className="hiw-compare-head hiw-compare-head-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Viewing calendars (most users)
            </div>
            {COMPARE_VIEW.map((item) => (
              <div className="hiw-compare-row" key={item}>{item}</div>
            ))}
            <div className="hiw-compare-row hiw-compare-highlight-blue">Most players only need this</div>
          </div>
          <div className="hiw-compare-col">
            <div className="hiw-compare-head hiw-compare-head-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 4h2a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2h-2a2 2 0 1 0-4 0H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8a2 2 0 0 1 2-2h2a2 2 0 1 0 4 0z" />
              </svg>
              Importing raids (organizers)
            </div>
            {COMPARE_EXTENSION.map((item) => (
              <div className="hiw-compare-row" key={item}>{item}</div>
            ))}
            <div className="hiw-compare-row hiw-compare-highlight-purple">Guild organizers use this</div>
          </div>
        </div>
      </section>
    </div>
  );
}

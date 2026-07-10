import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import horizonMark from "./assets/horizon-mark.png";
import {
  compareRaidScheduleAsc,
  formatRaidDateTime,
  getDateKeyFromDate,
  getRaidScheduleValue,
  RAID_COLORS,
  RAID_TYPE_ORDER,
  useStatsData,
} from "./statsData";
import "./HorizonSplash3.css";

const FEATURES = [
  {
    title: "Live Radar",
    desc: "Every incoming raid plotted the moment it's posted, not a static list.",
    icon: "radar",
  },
  {
    title: "Unified Calendar",
    desc: "Every raid from every guild you follow, in one place.",
    icon: "calendar",
  },
  {
    title: "No Signup Needed",
    desc: "Open a link and see the schedule instantly. No account required.",
    icon: "bolt",
  },
  {
    title: "Privacy First",
    desc: "We only read raid posts. Your messages stay private, always.",
    icon: "lock",
  },
];

const ICONS = {
  radar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <path d="M12 12 18 7" />
    </svg>
  ),
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
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
};

function getScopeEnd(days) {
  const end = new Date();
  end.setDate(end.getDate() + days - 1);
  return getDateKeyFromDate(end);
}

function getDiscordUrl(raid) {
  return `https://discord.com/channels/${raid.guild_id}/${raid.channel_id}`;
}

function getPointPosition(raid, index, raids) {
  const raidIndex = Math.max(0, RAID_TYPE_ORDER.indexOf(raid.raidType));
  const sliceSize = 360 / RAID_TYPE_ORDER.length;
  const sliceStart = -90 + raidIndex * sliceSize;
  const scatter = (((index * 37) % 21) - 10) / 10;
  const angle = sliceStart + sliceSize / 2 + scatter * Math.min(13, sliceSize * 0.36);
  const raidTimes = raids.map(getRaidScheduleValue);
  const firstRaidTime = Math.min(...raidTimes);
  const lastRaidTime = Math.max(...raidTimes);
  const span = Math.max(1, lastRaidTime - firstRaidTime);
  const progress = raids.length <= 1 ? 0.48 : Math.min(1, Math.max(0, (getRaidScheduleValue(raid) - firstRaidTime) / span));
  const sameTypeOffset = raids.slice(0, index).filter((item) => item.raidType === raid.raidType).length;
  const radius = Math.min(46, 12 + progress * 34 + (sameTypeOffset % 3) * 1.3);
  const radians = (angle * Math.PI) / 180;

  return {
    x: 50 + Math.cos(radians) * radius,
    y: 50 + Math.sin(radians) * radius,
  };
}

function RaidAvatar({ raid }) {
  return <img src={raid.guildIconUrl || horizonMark} alt="" />;
}

function GuildAvatar({ guild }) {
  return <img src={guild.guildIconUrl || horizonMark} alt="" />;
}

const DESKTOP_CALENDAR_WIDTH = 1600;
const DESKTOP_CALENDAR_HEIGHT = 900;
const MOBILE_CALENDAR_WIDTH = 390;
const MOBILE_CALENDAR_HEIGHT = 780;
const MOBILE_BREAKPOINT = 768;

// Same 768px threshold used by Navbar.jsx and HorizonSplash.jsx, so all
// mobile-detecting components on the site stay in sync.
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

// Iframe renders at native width and is shrunk with a CSS transform, so the
// real app's own responsive breakpoints don't kick in at a tiny embed size.
// On mobile, "kind" switches to the app's native mobile width so its own
// swipeable day view renders, instead of a tiny shrunk desktop grid.
function CalendarPreview({ kind }) {
  const wrapRef = useRef(null);
  const naturalWidth = kind === "mobile" ? MOBILE_CALENDAR_WIDTH : DESKTOP_CALENDAR_WIDTH;
  const naturalHeight = kind === "mobile" ? MOBILE_CALENDAR_HEIGHT : DESKTOP_CALENDAR_HEIGHT;
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let rafId = null;
    const updateScale = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const width = el.offsetWidth;
        if (width > 0) setScale(width / naturalWidth);
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
          ? "home3-calendar-wrap home3-calendar-wrap--mobile"
          : "home3-calendar-wrap home3-calendar-wrap--clickable"
      }
      ref={wrapRef}
    >
      <iframe
        className="home3-calendar-iframe"
        loading="lazy"
        src="https://raidhelper-client.vercel.app/calendar"
        style={{
          width: `${naturalWidth}px`,
          height: `${naturalHeight}px`,
          transform: `scale(${scale})`,
        }}
        title="Raid Calendar live preview"
      />
      {kind === "desktop" && (
        <Link aria-label="Open the full calendar" className="home3-calendar-veil" to="/calendar">
          <span className="home3-calendar-veil-hint">
            Open Calendar
            <span aria-hidden="true">-&gt;</span>
          </span>
        </Link>
      )}
    </div>
  );
}

export default function HorizonSplash3() {
  const [heroView, setHeroView] = useState("radar");
  const isMobile = useIsMobile();
  const { error, events, guilds, isLoading, raidsByType, totalGuilds, totalRaids, raidsToday } = useStatsData("home");
  const today = getDateKeyFromDate(new Date());
  const scopeEnd = getScopeEnd(3);
  const radarRaids = events
    .filter((raid) => raid.localDate && raid.localDate >= today && raid.localDate <= scopeEnd)
    .sort(compareRaidScheduleAsc)
    .slice(0, 16);
  const feedRaids = radarRaids.slice(0, 6);
  const topGuilds = guilds
    .slice()
    .sort((a, b) => b.raids.length - a.raids.length || b.raidsToday - a.raidsToday)
    .slice(0, 10);
  const maxRaidType = Math.max(1, ...raidsByType.map((type) => type.count));
  const nextRaid = radarRaids[0] || null;
  const dominantType = raidsByType.slice().sort((a, b) => b.count - a.count)[0];

  return (
    <main className="home3-page">
      <section className="home3-hero">
        <div className="home3-hero-copy">
          <span className="home3-eyebrow">DISCORD RAID CALENDAR</span>
          <h1>
            Every raid,<br />tracked live.
          </h1>
          <p>
            Horizon reads the raid posts your guilds already make in Discord and turns them
            into one calendar, and a live radar that shows what's coming next right now.
          </p>

          <div className="home3-cta-row">
            <Link className="home3-btn home3-btn--primary" to="/calendar">
              Open Calendar
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="home3-btn home3-btn--secondary" to="/stats5">
              Open Radar
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>

          <ul className="home3-trust-row">
            <li>Works with any Discord server</li>
            <li>No signup required</li>
            <li>Private by design</li>
          </ul>

          <div className="home3-status-strip" aria-label="Live status">
            <span><strong>{totalGuilds || "--"}</strong>guilds</span>
            <span><strong>{totalRaids || "--"}</strong>raids tracked</span>
            <span><strong>{raidsToday || 0}</strong>today</span>
          </div>
        </div>

        <div className="home3-preview">
          <div className="home3-view-toggle" role="tablist" aria-label="Hero preview">
            <button
              aria-selected={heroView === "radar"}
              className={heroView === "radar" ? "home3-view-tab home3-view-tab--active" : "home3-view-tab"}
              onClick={() => setHeroView("radar")}
              role="tab"
              type="button"
            >
              Live Radar
            </button>
            <button
              aria-selected={heroView === "calendar"}
              className={heroView === "calendar" ? "home3-view-tab home3-view-tab--active" : "home3-view-tab"}
              onClick={() => setHeroView("calendar")}
              role="tab"
              type="button"
            >
              Live Calendar
            </button>
          </div>

          <div className="home3-command-preview" aria-busy={isLoading}>
          {heroView === "radar" ? (
            <>
          <div className="home3-radar-card">
            <header className="home3-radar-header">
              <span>Live radar</span>
              <strong>{radarRaids.length} contacts incoming</strong>
            </header>
              <div className="home3-radar-body">
                <div className="home3-radar" aria-label="Live raid radar preview">
                  <div className="home3-radar-grid" />
                  <div className="home3-radar-sweep" />
                  <div className="home3-radar-core">
                    <img src={horizonMark} alt="" />
                  </div>
                  {RAID_TYPE_ORDER.map((raidType, index) => {
                    const angle = -90 + index * (360 / RAID_TYPE_ORDER.length) + 360 / RAID_TYPE_ORDER.length / 2;
                    const radians = (angle * Math.PI) / 180;
                    const radius = 55;
                    return (
                      <span
                        className="home3-radar-label"
                        key={raidType}
                        style={{
                          "--label-x": `${50 + Math.cos(radians) * radius}%`,
                          "--label-y": `${50 + Math.sin(radians) * radius}%`,
                          "--raid-color": RAID_COLORS[raidType],
                        }}
                      >
                        {raidType}
                      </span>
                    );
                  })}
                  {radarRaids.map((raid, index) => {
                    const point = getPointPosition(raid, index, radarRaids);
                    return (
                      <a
                        className="home3-blip"
                        href={getDiscordUrl(raid)}
                        key={raid.raidhelper_event_id}
                        rel="noreferrer"
                        style={{
                          "--x": `${point.x}%`,
                          "--y": `${point.y}%`,
                          "--raid-color": RAID_COLORS[raid.raidType],
                          "--delay": `${index * 26}ms`,
                        }}
                        target="_blank"
                      >
                        <RaidAvatar raid={raid} />
                        <span>
                          <strong>{raid.raid_name || raid.title}</strong>
                          <em>{raid.guildName}</em>
                          <small>{raid.raidType} / {formatRaidDateTime(raid)}</small>
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
          </div>

          <aside className="home3-feed-card">
            <header>
              <span>Next up</span>
            </header>
            <div className="home3-feed-list">
              {feedRaids.map((raid) => (
                <a
                  className="home3-feed-item"
                  href={getDiscordUrl(raid)}
                  key={raid.raidhelper_event_id}
                  rel="noreferrer"
                  style={{ "--raid-color": RAID_COLORS[raid.raidType] }}
                  target="_blank"
                >
                  <RaidAvatar raid={raid} />
                  <span>{raid.raidType}</span>
                  <strong>{raid.raid_name || raid.title}</strong>
                  <small>{formatRaidDateTime(raid)}</small>
                </a>
              ))}
              {!isLoading && feedRaids.length === 0 && (
                <p className="home3-empty">No incoming contacts in the preview window.</p>
              )}
            </div>
            <Link className="home3-feed-more" to="/stats5">
              See full radar
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </aside>
            </>
          ) : (
            <div className="home3-calendar-card">
              <header className="home3-radar-header">
                <span>Live calendar</span>
                <strong>Full schedule</strong>
              </header>
              <div className="home3-calendar-body">
                <CalendarPreview kind={isMobile ? "mobile" : "desktop"} />
              </div>
            </div>
          )}
          </div>
        </div>
      </section>

      <section className="home3-paths" aria-label="Radar and calendar overview">
        <Link className="home3-path home3-path--radar" to="/stats5">
          <span>Command view</span>
          <h2>Radar for what's happening next.</h2>
          <p>Scan incoming raids by type and guild, then jump straight into Discord.</p>
          <span className="home3-path-cta">
            Open Radar
            <span aria-hidden="true">-&gt;</span>
          </span>
        </Link>
        <Link className="home3-path home3-path--calendar" to="/calendar">
          <span>Planning view</span>
          <h2>Calendar for the full schedule.</h2>
          <p>See every tracked raid laid out day by day, across every guild you follow.</p>
          <span className="home3-path-cta">
            Open Calendar
            <span aria-hidden="true">-&gt;</span>
          </span>
        </Link>
      </section>

      <section className="home3-signal">
        <div className="home3-signal-copy">
          <span>Signal intelligence</span>
          <h2>One live network of raiders.</h2>
          <p>
            Radar and Calendar both stay fed by the same tracked Discord raid posts, so
            what you see is what's actually being posted, updated as it happens.
          </p>
          <div className="home3-signal-metrics">
            <span><strong>{nextRaid ? formatRaidDateTime(nextRaid) : "Standby"}</strong>next contact</span>
            <span><strong>{dominantType?.raidType || "None"}</strong>strongest signal</span>
          </div>
        </div>

        <div className="home3-type-mix" aria-label="Raid type mix">
          {RAID_TYPE_ORDER.map((raidType) => {
            const type = raidsByType.find((item) => item.raidType === raidType);
            const count = type?.count || 0;
            return (
              <div
                className="home3-type-row"
                key={raidType}
                style={{
                  "--raid-color": RAID_COLORS[raidType],
                  "--type-width": `${Math.max(5, (count / maxRaidType) * 100)}%`,
                }}
              >
                <span>{raidType}</span>
                <i><b /></i>
                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home3-guilds" aria-label="Tracked guilds">
        <header>
          <div>
            <span>Guild registry</span>
            <strong>{totalGuilds || "--"} guilds already on the radar</strong>
          </div>
          <Link to="/stats5">
            View all
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </header>
        <div className="home3-guild-wall">
          {topGuilds.map((guild, index) => (
            <Link
              className="home3-guild"
              key={guild.guild_id}
              style={{
                "--guild-color": RAID_COLORS[guild.dominantType],
                "--delay": `${index * 24}ms`,
              }}
              to={`/stats5?guild=${guild.guild_id}`}
            >
              <span className="home3-guild-orb"><GuildAvatar guild={guild} /></span>
              <strong>{guild.guildName || "Unknown guild"}</strong>
              <em>{guild.raids.length} raids</em>
            </Link>
          ))}
        </div>
        {error && <p className="home3-empty">Live stats are temporarily unavailable.</p>}
      </section>

      <section className="home3-features">
        <p className="home3-features-kicker">BUILT FOR PLAYERS. DESIGNED FOR CLARITY.</p>
        <div className="home3-features-grid">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="home3-feature">
              <span className="home3-feature-icon">{ICONS[feature.icon]}</span>
              <h4>{feature.title}</h4>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

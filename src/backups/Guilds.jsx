import React, { useEffect, useState } from "react";
import horizonMark from "./assets/horizon-mark.png";
import "./Guilds.css";

const API = import.meta.env.VITE_API;

// Same raid-type keyword matching the calendar uses, so a guild's next
// raid collapses to a clean category badge instead of a long raw title.
const RAID_KEYWORDS = {
  ZG: ["zg", "zul", "gurub", "zul gurub"],
  AQ20: ["aq20", "aq 20", "ruins of ahn"],
  Ony: ["ony", "onyxia"],
  MC: ["molten core", "mc", "molten", "core"],
  BWL: ["bwl", "blackwing lair", "blackwing"],
  AQ40: ["aq40", "aq 40", "temple of ahn'qiraj", "ouro", "cthun"],
  Naxx: ["naxx", "naxxramas"],
};

const RAID_COLORS = {
  ZG: "#639922",
  AQ20: "#BA7517",
  Ony: "#A32D2D",
  MC: "#D85A30",
  BWL: "#534AB7",
  AQ40: "#0F6E56",
  Naxx: "#185FA5",
  Other: "#686f7b",
};

function matchRaidType(title) {
  if (!title) return "Other";
  const lower = title.toLowerCase();
  for (const [raidType, keywords] of Object.entries(RAID_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return raidType;
  }
  return "Other";
}

function getDateKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateKeyFromTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return getDateKeyFromDate(date);
}

function formatRelativeRaidTime(date) {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (diffMs < 0) return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
  if (diffHours < 24 && date.getDate() === now.getDate()) return `Today, ${timeStr}`;

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.getDate() === tomorrow.getDate() && diffHours < 48) return `Tomorrow, ${timeStr}`;

  return `${date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}, ${timeStr}`;
}

function GuildIcon({ guildName, guildIconUrl }) {
  if (guildIconUrl) {
    return (
      <img
        className="guilds-icon guilds-icon--image"
        src={guildIconUrl}
        alt={guildName || ""}
      />
    );
  }
  return (
    <span className="guilds-icon guilds-icon--mark">
      <img src={horizonMark} alt="" aria-hidden="true" />
    </span>
  );
}

export default function Guilds() {
  const [events, setEvents] = useState([]);
  const [openGuildId, setOpenGuildId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchEvents() {
      try {
        const res = await fetch(`${API}/api/raidhelper/imported`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();

        const mappedEvents = data.map((raid) => {
          const raw = raid.raw_json || {};
          return {
            ...raid,
            startTime: raw.startTime || raid.start_time,
            localDate: raw.localDate || getDateKeyFromTimestamp(raw.startTime || raid.start_time),
            guildName: raw.guildName || raid.guild_name || null,
            guildIconUrl: raw.guildIconUrl || raid.guild_icon_url || null,
          };
        });

        if (isMounted) setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to load guilds:", err);
      }
    }

    fetchEvents();
    return () => { isMounted = false; };
  }, []);

  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    return getDateKeyFromDate(day);
  });
  const weekStart = next7Days[0];
  const weekEnd = next7Days[6];

  const guildMap = new Map();
  for (const event of events) {
    if (!guildMap.has(event.guild_id)) {
      guildMap.set(event.guild_id, {
        guild_id: event.guild_id,
        guildName: event.guildName,
        guildIconUrl: event.guildIconUrl,
        raids: [],
      });
    }
    guildMap.get(event.guild_id).raids.push(event);
  }

  const now = new Date();
  const guilds = [...guildMap.values()].map((guild) => {
    const upcoming = guild.raids
      .filter((r) => new Date(r.startTime || r.start_time) >= now)
      .sort((a, b) => new Date(a.startTime || a.start_time) - new Date(b.startTime || b.start_time));

    const nextRaid = upcoming[0] || null;

    const raidsThisWeek = guild.raids.filter((r) => {
      const key = r.localDate;
      return key && key >= weekStart && key <= weekEnd;
    }).length;

    return { ...guild, nextRaid, raidsThisWeek };
  }).sort((a, b) => b.raidsThisWeek - a.raidsThisWeek);

  const totalRaids = events.length;
  const totalRaidsThisWeek = events.filter((e) => e.localDate && e.localDate >= weekStart && e.localDate <= weekEnd).length;

  return (
    <div className="guilds-page">
      <section className="guilds-hero">

        <h1 className="guilds-headline">
          Every guild, <span className="guilds-gradient">at a glance.</span>
        </h1>
        <p className="guilds-subhead">
          See who's running raids and when, across every guild Horizon tracks.
        </p>
      </section>

      <section className="guilds-stats-card">
        <div className="guilds-stat">
          <p className="guilds-stat-value">{guilds.length}</p>
          <p className="guilds-stat-label">Guilds Represented</p>
        </div>
        <div className="guilds-stat-divider" />
        <div className="guilds-stat">
          <p className="guilds-stat-value">{totalRaids}</p>
          <p className="guilds-stat-label">Raids tracked</p>
        </div>
        <div className="guilds-stat-divider" />
        <div className="guilds-stat">
          <p className="guilds-stat-value">{totalRaidsThisWeek}</p>
          <p className="guilds-stat-label">Raids this week</p>
        </div>
      </section>

      <section className="guilds-panel">
        <div className="guilds-list">
          {guilds.map((guild) => {
            const isOpen = openGuildId === guild.guild_id;
            const nextRaidType = guild.nextRaid ? matchRaidType(guild.nextRaid.raid_name || guild.nextRaid.title) : null;
            const nextRaidColor = nextRaidType ? RAID_COLORS[nextRaidType] : null;

            return (
              <div className={isOpen ? "guilds-row guilds-row--open" : "guilds-row"} key={guild.guild_id}>
                <button
                  type="button"
                  className="guilds-row-header"
                  onClick={() => setOpenGuildId(isOpen ? null : guild.guild_id)}
                  aria-expanded={isOpen}
                >
                  <GuildIcon guildName={guild.guildName} guildIconUrl={guild.guildIconUrl} />

                  <div className="guilds-row-identity">
                    <span className="guilds-row-name">{guild.guildName || "Unknown guild"}</span>
                    
                  </div>

                  <div className="guilds-row-total">                    
                    <span className="guilds-row-total-value">{guild.raidsThisWeek} </span>
                    <span className="guilds-row-total-label">This week</span>
                  </div>

                  <div className="guilds-row-total">                    
                    <span className="guilds-row-total-value">{guild.raids.length}</span>
                    <span className="guilds-row-total-label">Total</span>
                  </div>

                  {guild.nextRaid ? (
                    <a
                      className="guilds-row-next"
                      style={{ "--raid-color": nextRaidColor }}
                      href={`https://discord.com/channels/${guild.nextRaid.guild_id}/${guild.nextRaid.channel_id}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="guilds-row-next-badge">{nextRaidType}</span>
                      <span className="guilds-row-next-time">
                        {formatRelativeRaidTime(new Date(guild.nextRaid.startTime || guild.nextRaid.start_time))}
                      </span>
                    </a>
                  ) : (
                    <span className="guilds-row-next guilds-row-next--empty">No upcoming raid</span>
                  )}

                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="guilds-row-chevron">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="guilds-row-body">
                    {guild.raids
                      .slice()
                      // .sort((a, b) => new Date(a.startTime || a.start_time) - new Date(b.startTime || b.start_time))
                      .sort((a, b) => new Date(b.startTime || b.start_time) - new Date(a.startTime || a.start_time))
                      .map((raid) => (
                        <a
                          key={raid.raidhelper_event_id}
                          className="guilds-raid-item"
                          href={`https://discord.com/channels/${raid.guild_id}/${raid.channel_id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="guilds-raid-name">{raid.raid_name || raid.title}</span>
                          <span className="guilds-raid-date">
                            {new Date(raid.startTime || raid.start_time).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                            {" · "}
                            {new Date(raid.startTime || raid.start_time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                          </span>
                        </a>
                      ))}
                  </div>
                )}
              </div>
            );
          })}

          {guilds.length === 0 && (
            <p className="guilds-empty">No guilds found yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

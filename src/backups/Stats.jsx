import React, { useEffect, useState } from "react";
import horizonMark from "./assets/horizon-mark.png";
import "./Stats.css";

const API = import.meta.env.VITE_API;

function getDateKeyFromTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatRaidDate(event) {
  const value = event.startTime || event.start_time;
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) + " · " + date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
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

  // Guilds without a Discord icon fall back to the Horizon mark instead
  // of a generic colored-initial circle, so a missing icon reads as
  // intentional brand presence rather than a visible gap.
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

  // Group raids by guild_id, same pattern your /stats endpoint already
  // uses server-side — done client-side here so this page reuses the
  // exact same data the calendar fetches, rather than a second source
  // of truth.
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

  const guilds = [...guildMap.values()].sort((a, b) => b.raids.length - a.raids.length);
  const totalRaids = events.length;

  return (
    <div className="guilds-page">
      <section className="guilds-hero">
        <h1 className="guilds-headline">
          Every guild, <span className="guilds-gradient">at a glance.</span>
        </h1>
        <p className="guilds-subhead">
          {guilds.length} guild{guilds.length === 1 ? "" : "s"} · {totalRaids} raid{totalRaids === 1 ? "" : "s"} tracked
        </p>
      </section>

      <section className="guilds-list">
        {guilds.map((guild) => {
          const isOpen = openGuildId === guild.guild_id;
          return (
            <div className={isOpen ? "guilds-row guilds-row--open" : "guilds-row"} key={guild.guild_id}>
              <button
                type="button"
                className="guilds-row-header"
                onClick={() => setOpenGuildId(isOpen ? null : guild.guild_id)}
                aria-expanded={isOpen}
              >
                <GuildIcon guildName={guild.guildName} guildIconUrl={guild.guildIconUrl} />
                <span className="guilds-row-name">{guild.guildName || "Unknown guild"}</span>
                <span className="guilds-row-count">{guild.raids.length} raid{guild.raids.length === 1 ? "" : "s"}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="guilds-row-chevron">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isOpen && (
                <div className="guilds-row-body">
                  {guild.raids
                    .slice()
                    .sort((a, b) => new Date(a.startTime || a.start_time) - new Date(b.startTime || b.start_time))
                    .map((raid) => (
                      <a
                        key={raid.raidhelper_event_id}
                        className="guilds-raid-item"
                        href={`https://discord.com/channels/${raid.guild_id}/${raid.channel_id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="guilds-raid-name">{raid.raid_name || raid.title}</span>
                        <span className="guilds-raid-date">{formatRaidDate(raid)}</span>
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
      </section>
    </div>
  );
}

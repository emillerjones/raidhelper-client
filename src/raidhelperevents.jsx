import { useEffect, useState } from "react";
import "./raidhelperevents.css";

const API = import.meta.env.VITE_API;

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
  ZG: "#639922",      // green
  AQ20: "#BA7517",    // amber
  Ony: "#A32D2D",     // red
  MC: "#D85A30",      // coral
  BWL: "#534AB7",     // purple
  AQ40: "#0F6E56",    // teal
  Naxx: "#185FA5",    // blue
};

function matchRaidType(title) {
  if (!title) return null;
  const lower = title.toLowerCase();

  for (const [raidType, keywords] of Object.entries(RAID_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return raidType;
    }
  }

  return null;
}

function getGuildColor(guildName, allGuildNames) {
  if (!guildName) return "hsl(0, 0%, 50%)";
  const index = allGuildNames.indexOf(guildName);
  const total = allGuildNames.length || 1;
  const hue = (index / total) * 360;
  return `hsl(${hue}, 65%, 55%)`;
}

function GuildBadge({ guildName, guildIconUrl, allGuildNames }) {
  if (guildIconUrl) {
    return (
      <img
        className="guild-badge guild-badge--image"
        src={guildIconUrl}
        alt={guildName || ""}
      />
    );
  }

  const initial = guildName ? guildName.trim().charAt(0).toUpperCase() : "?";
  const color = getGuildColor(guildName, allGuildNames);

  return (
    <span
      className="guild-badge guild-badge--fallback"
      style={{ backgroundColor: color }}
    >
      {initial}
    </span>
  );
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

function formatTime(event) {
  if (event.localTime) return event.localTime;

  const value = event.startTime || event.start_time;
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}




function formatLastUpdated(date) {
  if (!date) return "";
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function RaidHelperEvents() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuilds, setSelectedGuilds] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

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
            localTime: raw.localTime || null,
            guildName: raw.guildName || raid.guild_name || null,
            guildIconUrl: raw.guildIconUrl || raid.guild_icon_url || null,
            signupCount: raw.signupCount ?? raid.signup_count,
            signupMax: raw.signupMax ?? raid.signup_max,
            title: raw.title || raid.title,
          };
        });

        if (isMounted) {
          setEvents(mappedEvents);
          setLastUpdated(new Date());
          console.log("Mapped raid calendar events:", mappedEvents);
        }
      } catch (err) {
        console.error("Failed to refresh raid events:", err);
        // keep showing whatever events we already have rather than clearing them
      }
    }

    // initial load
    fetchEvents();

    // poll every 10 minutes, but skip while the tab is backgrounded
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchEvents();
      }
    }, 10 * 60 * 1000);

    // refresh immediately when the tab regains focus, in case it was
    // backgrounded for longer than the poll interval
    function handleVisibilityChange() {
      if (!document.hidden) {
        fetchEvents();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const [selectedRaidTypes, setSelectedRaidTypes] = useState([]);


  const today = new Date();
  const year = today.getFullYear();
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    return day;
  });

  const weekStart = getDateKeyFromDate(calendarDays[0]);
  const weekEnd = getDateKeyFromDate(calendarDays[calendarDays.length - 1]);

  const eventsInWeek = events.filter((event) => {
    if (!event.localDate) return false;
    return event.localDate >= weekStart && event.localDate <= weekEnd;
  });

  const allGuildNames = [...new Set(eventsInWeek.map((e) => e.guildName).filter(Boolean))];

  const guildRaidCounts = eventsInWeek.reduce((counts, event) => {
    if (event.guildName) {
      counts[event.guildName] = (counts[event.guildName] || 0) + 1;
    }
    return counts;
  }, {});

  function toggleGuild(guildName) {
    setSelectedGuilds((prev) =>
      prev.includes(guildName)
        ? prev.filter((g) => g !== guildName)
        : [...prev, guildName]
    );
  }

  const filteredEvents = events.filter((event) => {
    const searchText = `
      ${event.raid_name || ""}
      ${event.raid_leader || ""}
      ${event.guild_name || ""}
    `.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesGuild =
      selectedGuilds.length === 0 || selectedGuilds.includes(event.guildName);
    const eventRaidType = matchRaidType(event.raid_name || event.title) || "Other";
    const matchesRaidType =
      selectedRaidTypes.length === 0 || selectedRaidTypes.includes(eventRaidType);

    return matchesSearch && matchesGuild && matchesRaidType;
  });

  function eventsForDay(day) {
    if (!day) return [];

    const dayKey = getDateKeyFromDate(day);
    return filteredEvents.filter((event) => event.localDate === dayKey);
  }

  function toggleRaidType(raidType) {
    setSelectedRaidTypes((prev) =>
      prev.includes(raidType)
        ? prev.filter((r) => r !== raidType)
        : [...prev, raidType]
    );
  }

  const raidTypeCounts = eventsInWeek.reduce((counts, event) => {
    const raidType = matchRaidType(event.raid_name || event.title) || "Other";
    counts[raidType] = (counts[raidType] || 0) + 1;
    return counts;
  }, {});

  const totalRaidsThisWeek = eventsInWeek.length;









  return (
    <main className="raid-calendar-page">

      <div className="raid-calendar-top">
        <div className="raid-calendar-top-label">
          <span className="raid-calendar-brand">Raid Calendar</span>
          <span className="raid-calendar-top-month">
            {today.toLocaleString("default", { month: "long" })} {year}
          </span>
          {lastUpdated && (
            <span className="raid-calendar-last-updated">
              Data last refreshed at: {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>

        <div className="raid-stats-row">
          <button
            type="button"
            className={
              selectedRaidTypes.length === 0
                ? "raid-stat-card raid-stat-card--total raid-stat-card--active"
                : "raid-stat-card raid-stat-card--total"
            }
            onClick={() => setSelectedRaidTypes([])}
          >
            <span className="raid-stat-card__label">Total Raids</span>
            <span className="raid-stat-card__value">{totalRaidsThisWeek}</span>
          </button>

          {Object.keys(RAID_KEYWORDS).map((raidType) => (
            <button
              key={raidType}
              type="button"
              className={
                selectedRaidTypes.includes(raidType)
                  ? "raid-stat-card raid-stat-card--clickable raid-stat-card--active"
                  : "raid-stat-card raid-stat-card--clickable"
              }
              style={{ "--raid-color": RAID_COLORS[raidType] }}
              onClick={() => toggleRaidType(raidType)}
            >
              <span className="raid-stat-card__label">{raidType}</span>
              <span className="raid-stat-card__value">{raidTypeCounts[raidType] || 0}</span>
            </button>
          ))}

          <button
            type="button"
            className={
              selectedRaidTypes.includes("Other")
                ? "raid-stat-card raid-stat-card--other raid-stat-card--active"
                : "raid-stat-card raid-stat-card--other"
            }
            onClick={() => toggleRaidType("Other")}
          >
            <span className="raid-stat-card__label">Other</span>
            <span className="raid-stat-card__value">{raidTypeCounts.Other || 0}</span>
          </button>
        </div>
      </div>


      <div className="raid-calendar-layout">
        <aside className="raid-calendar-sidebar">
          {/* <h2 className="raid-calendar-month">
            {today.toLocaleString("default", { month: "long" })} {year}
          </h2> */}

          <div className="raid-calendar-search-wrap">
            <input
              className="raid-calendar-search"
              type="text"
              placeholder="Search raids, guilds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={
              selectedGuilds.length === 0
                ? "guild-row guild-row--active"
                : "guild-row"
            }            
            onClick={() => setSelectedGuilds([])}
          >
            <span className="guild-row__name">Show All Guilds</span>
            <span className="guild-row__count">{eventsInWeek.length}</span>
            
          </button>

          {allGuildNames.map((guild) => {
            const guildEvent = eventsInWeek.find((e) => e.guildName === guild);
            return (
              <button
                key={guild}
                type="button"
                className={
                  selectedGuilds.includes(guild)
                    ? "guild-row guild-row--active"
                    : "guild-row"
                }
                onClick={() => toggleGuild(guild)}
              >
                <GuildBadge
                  guildName={guild}
                  guildIconUrl={guildEvent?.guildIconUrl}
                  allGuildNames={allGuildNames}
                />
                <span className="guild-row__name">{guild}</span>
                <span className="guild-row__count">{guildRaidCounts[guild] || 0}</span>
              </button>
            );
          })}
        </aside>

        <section className="raid-calendar">
          {calendarDays.map((day) => (
            <div className="raid-calendar__header" key={day.toISOString()}>
              {day.toLocaleDateString("default", { weekday: "short" })} - {day.getDate()}
            </div>
          ))}

          {calendarDays.map((day, index) => (
            <div className="raid-calendar__day" key={index}>
              {day && (
                <>
                  {/* <div className="raid-calendar__date">{day.getDate()}</div> */}

                  {eventsForDay(day).map((event) => (
                    <a
                      className="raid-calendar__event"
                      key={event.raidhelper_event_id}
                      href={`https://discord.com/channels/${event.guild_id}/${event.channel_id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="raid-calendar__event-icon">
                        <GuildBadge
                          guildName={event.guildName}
                          guildIconUrl={event.guildIconUrl}
                          allGuildNames={allGuildNames}
                        />
                      </div>
                      <div className="raid-calendar__event-details">
                        <strong>{formatTime(event)}</strong>
                        <span>{event.guildName}</span>
                        <span>{event.raid_name || event.title}</span>
                      </div>
                    </a>
                  ))}
                </>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

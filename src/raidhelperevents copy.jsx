import { useEffect, useState } from "react";
import "./raidhelperevents.css";

const API = import.meta.env.VITE_API;


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

export default function RaidHelperEvents() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuilds, setSelectedGuilds] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch(`${API}/api/raidhelper/imported`);
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

      setEvents(mappedEvents);
      console.log("Mapped raid calendar events:", mappedEvents);
    }

    fetchEvents();
  }, []);

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

    return matchesSearch && matchesGuild;
  });

  function eventsForDay(day) {
    if (!day) return [];

    const dayKey = getDateKeyFromDate(day);
    return filteredEvents.filter((event) => event.localDate === dayKey);
  }

  return (
    <main className="raid-calendar-page">
      <div className="raid-calendar-top">
        <h2>
          {today.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <input
          className="raid-calendar-search"
          type="text"
          placeholder="Search raids, leaders, guilds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="raid-calendar-layout">
        <aside className="raid-calendar-sidebar">
          <button
            type="button"
            className={
              selectedGuilds.length === 0
                ? "guild-row guild-row--active"
                : "guild-row"
            }
            onClick={() => setSelectedGuilds([])}
          >
            <span className="guild-row__name">Show All</span>
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
              </button>
            );
          })}
        </aside>

        <section className="raid-calendar">
          {calendarDays.map((day) => (
            <div className="raid-calendar__header" key={day.toISOString()}>
              {day.toLocaleDateString("default", { weekday: "short" })}
            </div>
          ))}

          {calendarDays.map((day, index) => (
            <div className="raid-calendar__day" key={index}>
              {day && (
                <>
                  <div className="raid-calendar__date">{day.getDate()}</div>

                  {eventsForDay(day).map((event) => (
                    <a
                      className="raid-calendar__event"
                      key={event.raidhelper_event_id}
                      href={`https://discord.com/channels/${event.guild_id}/${event.channel_id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <strong>{formatTime(event)}</strong>
                      <span className="raid-calendar__event-guild">
                        <GuildBadge
                          guildName={event.guildName}
                          guildIconUrl={event.guildIconUrl}
                          allGuildNames={allGuildNames}
                        />
                        {event.guildName}
                      </span>
                      <span>{event.raid_name || event.title}</span>
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

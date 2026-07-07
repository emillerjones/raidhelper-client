import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import horizonLogo from "./assets/horizon-logo.png";
import RaidEventDetailsModal from "./RaidEventDetailsModal";
import GuildBadge from "./components/GuildBadge";
import "./raidhelperevents.css";

const API = import.meta.env.VITE_API;

const RAID_KEYWORDS = {
  ZG: ["zg", "zul", "gurub", "zul gurub"],
  AQ20: ["aq20", "aq 20", "ruins of ahn"],
  Ony: ["ony", "onyxia"],
  MC: ["molten core", "mc", "molten", "core"],
  BWL: ["bwl", "blackwing lair", "blackwing", " bwl "],
  AQ40: ["aq40", "aq 40", "temple of ahn'qiraj", "ouro", "cthun", "aq-40"],
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

const MOBILE_BREAKPOINT = 768;

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


// function openDiscordChannel(guildId, channelId) {
//   const webUrl = `https://discord.com/channels/${guildId}/${channelId}`;
//   // const appUrl = `discord://discord.com/channels/${guildId}/${channelId}`;
//   const appUrl = `discord:///channels/${guildId}/${channelId}`;
//   window.location.href = appUrl;

//   setTimeout(() => {
//     window.open(webUrl, "_blank", "noreferrer");
//   }, 800);
// }
function openDiscordChannel(guildId, channelId) {
  const webUrl = `https://discord.com/channels/${guildId}/${channelId}`;
  const appUrl = `discord:///channels/${guildId}/${channelId}`;

  window.open(webUrl, "_blank", "noreferrer");

  setTimeout(() => {
    window.location.href = appUrl;
  }, 300);
}

// Single event card, shared between the desktop grid and the mobile day view.
// `isMobile` controls whether the link opens in a new tab: on iOS, opening a
// Discord Universal Link via target="_blank" can fail to hand off the
// guild/channel path correctly to the native app, so mobile uses a normal
// same-tab navigation instead. Desktop keeps target="_blank" since there's
// no such handoff issue there.
function EventCard({ event, allGuildNames, isMobile, onInfoClick }) {
  return (
    // <a
    //   className="raid-calendar__event"
    //   href={`https://discord.com/channels/${event.guild_id}/${event.channel_id}`}
    //   target={isMobile ? undefined : "_blank"}
    //   rel="noreferrer"
    // >
    <button
      type="button"
      className="raid-calendar__event"
      onClick={() => openDiscordChannel(event.guild_id, event.channel_id)}
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
      <button
        type="button"
        className="raid-calendar__event-info"
        onClick={(e) => {
          e.stopPropagation();
          onInfoClick(event);
        }}
      >
        i
      </button>
    </button>
  );
}

// Mobile single-day swipe view, powered by Embla
function MobileDayCarousel({ calendarDays, eventsForDay, allGuildNames, onInfoClick }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const activeDay = calendarDays[selectedIndex];

  return (
    <div className="raid-mobile-day-view">
      <div className="raid-mobile-day-header">
        <button
          type="button"
          className="raid-mobile-day-nav"
          onClick={scrollPrev}
          aria-label="Previous day"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="raid-mobile-day-label">
          <span className="raid-mobile-day-weekday">
            {activeDay?.toLocaleDateString("default", { weekday: "long" })}
          </span>
          <span className="raid-mobile-day-date">
            {activeDay?.toLocaleDateString("default", { month: "short", day: "numeric" })}
          </span>
        </div>

        <button
          type="button"
          className="raid-mobile-day-nav"
          onClick={scrollNext}
          aria-label="Next day"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="raid-mobile-dots">
        {calendarDays.map((day, i) => (
          <span
            key={day.toISOString()}
            className={i === selectedIndex ? "raid-mobile-dot raid-mobile-dot--active" : "raid-mobile-dot"}
          />
        ))}
      </div>

      <div className="raid-mobile-embla" ref={emblaRef}>
        <div className="raid-mobile-embla__container">
          {calendarDays.map((day) => {
            const dayEvents = eventsForDay(day);
            return (
              <div className="raid-mobile-embla__slide" key={day.toISOString()}>
                {dayEvents.length === 0 ? (
                  <p className="raid-mobile-empty">No raids scheduled.</p>
                ) : (
                  dayEvents.map((event) => (
                    <EventCard
                      key={event.raidhelper_event_id}
                      event={event}
                      allGuildNames={allGuildNames}
                      isMobile
                      onInfoClick={onInfoClick}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// end of mobile view






export default function RaidHelperEvents() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuilds, setSelectedGuilds] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          console.log("Mapped raid calendar events:", mappedEvents);
        }
      } catch (err) {
        console.error("Failed to refresh raid events:", err);
        // keep showing whatever events we already have rather than clearing them
      }
    }

    // initial load
    fetchEvents();

    // poll every 10 minutes, but do not skip while the tab is backgrounded
    const interval = setInterval(() => {
      // if (!document.hidden) {
      //   fetchEvents();
      // }
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

  // On mobile, filters/search are hidden entirely, so skip them in the
  // filtering logic too rather than leaving stale selections silently applied.
  const filteredEvents = events.filter((event) => {
    if (isMobile) return true;

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
          <Link to="/" className="raid-calendar-brand-link">
            <img src={horizonLogo} alt="Horizon" className="raid-calendar-logo" />
          </Link>
          <span className="raid-calendar-top-month">
            {today.toLocaleString("default", { month: "long" })} {year}
          </span>
        </div>

        {!isMobile && (
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
        )}
      </div>

      {isMobile ? (
        <MobileDayCarousel
          calendarDays={calendarDays}
          eventsForDay={eventsForDay}
          allGuildNames={allGuildNames}
          onInfoClick={setSelectedEvent}
        />
      ) : (
        <div className="raid-calendar-layout">
          <aside className="raid-calendar-sidebar">
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
                    {eventsForDay(day).map((event) => (
                      <EventCard
                        key={event.raidhelper_event_id}
                        event={event}
                        allGuildNames={allGuildNames}
                        isMobile={isMobile}
                        onInfoClick={setSelectedEvent}
                      />
                    ))}
                  </>
                )}
              </div>
            ))}
          </section>
        </div>
      )}
      {selectedEvent && (
        <RaidEventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </main>
  );
}

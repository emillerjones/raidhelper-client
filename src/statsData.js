import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API;
const VISITOR_ID_KEY = "horizonVisitorId";

export function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    // Anonymous id so the server can count repeat visits without a login.
    visitorId = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  return visitorId;
}

export const RAID_KEYWORDS = {
  ZG: ["zg", "zul", "gurub", "zul gurub"],
  AQ20: ["aq20", "aq 20", "ruins of ahn"],
  Ony: ["ony", "onyxia"],
  MC: ["molten core", "mc", "molten", "core"],
  BWL: ["bwl", "blackwing lair", "blackwing", " bwl "],
  AQ40: ["aq40", "aq 40", "temple of ahn'qiraj", "ouro", "cthun", "aq-40"],
  Naxx: ["naxx", "naxxramas"],
};

export const RAID_COLORS = {
  ZG: "#639922",
  AQ20: "#BA7517",
  Ony: "#A32D2D",
  MC: "#D85A30",
  BWL: "#534AB7",
  AQ40: "#0F6E56",
  Naxx: "#185FA5",
  Other: "#686f7b",
};

export const RAID_TYPE_ORDER = [...Object.keys(RAID_KEYWORDS), "Other"];

export function matchRaidType(title) {
  if (!title) return "Other";
  const lower = title.toLowerCase();

  for (const [raidType, keywords] of Object.entries(RAID_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return raidType;
  }

  return "Other";
}

export function getDateKeyFromDate(date) {
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

export function formatShortTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeRaidTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const timeStr = formatShortTime(date);
  const dateKey = getDateKeyFromDate(date);
  const todayKey = getDateKeyFromDate(now);

  if (dateKey === todayKey) {
    return `Today, ${timeStr}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (dateKey === getDateKeyFromDate(tomorrow)) {
    return `Tomorrow, ${timeStr}`;
  }

  return `${date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  })}, ${timeStr}`;
}

export function formatRaidDateTime(raid) {
  const value = raid?.startTime || raid?.start_time;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const timeStr = raid.localTime || formatShortTime(date);
  const dateKey = raid.localDate || getDateKeyFromDate(date);
  const todayKey = getDateKeyFromDate(new Date());

  if (dateKey === todayKey) return `Today, ${timeStr}`;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateKey === getDateKeyFromDate(tomorrow)) return `Tomorrow, ${timeStr}`;

  return `${date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  })}, ${timeStr}`;
}

function parseTimeMinutes(timeText) {
  if (!timeText) return 0;
  const match = String(timeText).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function getRaidScheduleValue(raid) {
  const timestamp = raid.startTime || raid.start_time;
  const dateKey = raid.localDate || getDateKeyFromTimestamp(timestamp);
  if (dateKey) {
    if (raid.localTime) {
      return new Date(`${dateKey}T00:00:00`).getTime() + parseTimeMinutes(raid.localTime) * 60 * 1000;
    }

    const timestampDate = new Date(timestamp);
    if (!Number.isNaN(timestampDate.getTime())) return timestampDate.getTime();

    return new Date(`${dateKey}T00:00:00`).getTime();
  }

  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function compareRaidScheduleAsc(a, b) {
  const scheduleDiff = getRaidScheduleValue(a) - getRaidScheduleValue(b);
  if (scheduleDiff !== 0) return scheduleDiff;

  const aDate = new Date(a.startTime || a.start_time).getTime();
  const bDate = new Date(b.startTime || b.start_time).getTime();
  return (Number.isNaN(aDate) ? 0 : aDate) - (Number.isNaN(bDate) ? 0 : bDate);
}

function mapRaid(raid) {
  const raw = raid.raw_json || {};
  const startTime = raw.startTime || raid.raw_start_time || raid.start_time;
  const localDate = raw.localDate || raid.raw_local_date || getDateKeyFromTimestamp(startTime);
  const localTime = raw.localTime || raid.raw_local_time || null;

  return {
    ...raid,
    startTime,
    localDate,
    localTime,
    guildName: raw.guildName || raid.raw_guild_name || raid.guild_name || null,
    guildIconUrl: raw.guildIconUrl || raid.raw_guild_icon_url || raid.guild_icon_url || null,
    raidType: matchRaidType(raid.raid_name || raid.title),
  };
}

function groupGuilds(events) {
  const guildMap = new Map();
  const today = getDateKeyFromDate(new Date());
  const weekKeys = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() + i);
    return getDateKeyFromDate(day);
  });
  const weekStart = weekKeys[0];
  const weekEnd = weekKeys[6];

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

  return [...guildMap.values()]
    .map((guild) => {
      const upcoming = guild.raids
        .filter((raid) => raid.localDate && raid.localDate >= today)
        .sort(compareRaidScheduleAsc);

      const raidsThisWeek = guild.raids.filter(
        (raid) => raid.localDate && raid.localDate >= weekStart && raid.localDate <= weekEnd
      ).length;

      const raidsToday = guild.raids.filter((raid) => raid.localDate === today).length;
      const dominantType = getDominantRaidType(guild.raids);

      return {
        ...guild,
        nextRaid: upcoming[0] || null,
        raidsAllTime: guild.raids.length,
        raidsThisWeek,
        raidsToday,
        dominantType,
      };
    })
    .sort((a, b) => b.raidsThisWeek - a.raidsThisWeek || b.raids.length - a.raids.length);
}

function getDominantRaidType(events) {
  const counts = RAID_TYPE_ORDER.reduce((map, type) => {
    map[type] = 0;
    return map;
  }, {});

  for (const event of events) {
    counts[event.raidType] += 1;
  }

  return RAID_TYPE_ORDER.slice().sort((a, b) => counts[b] - counts[a])[0] || "Other";
}

function buildRaidsByType(events) {
  const counts = RAID_TYPE_ORDER.reduce((map, type) => {
    map[type] = 0;
    return map;
  }, {});

  for (const event of events) {
    counts[event.raidType] += 1;
  }

  return RAID_TYPE_ORDER.map((type) => ({
    raidType: type,
    count: counts[type],
  }));
}

function buildUpcomingRaids(events, limit = 28) {
  const today = getDateKeyFromDate(new Date());
  return events
    .filter((event) => event.localDate && event.localDate >= today)
    .sort(compareRaidScheduleAsc)
    .slice(0, limit);
}

export function useStatsData(page) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const url = page
          ? `${API}/api/raidhelper/stats?page=${encodeURIComponent(page)}`
          : `${API}/api/raidhelper/stats`;
        const res = await fetch(url, {
          headers: page ? { "X-Visitor-Id": getVisitorId() } : undefined,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        const allRaids = data.raids || (data.guilds || []).flatMap((guild) => guild.raids || []);

        if (isMounted) {
          setEvents(allRaids.map(mapRaid));
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [page]);

  return useMemo(() => {
    const today = getDateKeyFromDate(new Date());
    const guilds = groupGuilds(events);
    const raidsByType = buildRaidsByType(events);
    const upcomingRaids = buildUpcomingRaids(events);

    return {
      error,
      events,
      guilds,
      isLoading,
      raidsByType,
      totalGuilds: guilds.length,
      totalRaids: events.length,
      raidsToday: events.filter((event) => event.localDate === today).length,
      upcomingRaids,
    };
  }, [error, events, isLoading]);
}

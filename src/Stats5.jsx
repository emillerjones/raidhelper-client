import horizonMark from "./assets/horizon-mark.png";
import { useMemo, useRef, useState } from "react";
import {
  compareRaidScheduleAsc,
  formatRaidDateTime,
  getDateKeyFromDate,
  getRaidScheduleValue,
  RAID_COLORS,
  RAID_TYPE_ORDER,
  useStatsData,
} from "./statsData";
import "./Stats5.css";

const SCOPE_OPTIONS = [
  { label: "Today", days: 1 },
  { label: "2 days", days: 2 },
  { label: "3 days", days: 3 },
  { label: "7 days", days: 7 },
];

function getDiscordUrl(raid) {
  return `https://discord.com/channels/${raid.guild_id}/${raid.channel_id}`;
}

function getScopeEnd(days) {
  const end = new Date();
  end.setDate(end.getDate() + days - 1);
  return getDateKeyFromDate(end);
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
  const progress = raids.length <= 1 ? 0.45 : Math.min(1, Math.max(0, (getRaidScheduleValue(raid) - firstRaidTime) / span));
  const sameTypeOffset = raids
    .slice(0, index)
    .filter((item) => item.raidType === raid.raidType).length;
  const radius = Math.min(47, 11 + progress * 36 + (sameTypeOffset % 3) * 1.2);
  const radians = (angle * Math.PI) / 180;

  return {
    angle,
    x: 50 + Math.cos(radians) * radius,
    y: 50 + Math.sin(radians) * radius,
  };
}

function getDayBuckets(raids, scopeDays) {
  const buckets = Array.from({ length: scopeDays }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const key = getDateKeyFromDate(date);
    return {
      key,
      label: index === 0 ? "Today" : date.toLocaleDateString([], { weekday: "short" }),
      count: 0,
    };
  });

  for (const raid of raids) {
    const bucket = buckets.find((item) => item.key === raid.localDate);
    if (bucket) bucket.count += 1;
  }

  return buckets;
}

function GuildAvatar({ guild }) {
  return <img src={guild.guildIconUrl || horizonMark} alt="" />;
}

function RaidAvatar({ raid }) {
  return <img src={raid.guildIconUrl || horizonMark} alt="" />;
}

export default function Stats5() {
  const selectedGuildPanelRef = useRef(null);
  const [scopeDays, setScopeDays] = useState(1);
  const [viewMode, setViewMode] = useState("radar");
  const [selectedRaidTypes, setSelectedRaidTypes] = useState([]);
  const [selectedGuildIds, setSelectedGuildIds] = useState([]);
  const [activeRaidId, setActiveRaidId] = useState(null);
  const [selectedGuildId, setSelectedGuildId] = useState(null);
  const { error, events, guilds, isLoading, raidsByType, totalGuilds, totalRaids, raidsToday } = useStatsData();

  const dateScopedRaids = useMemo(() => {
    const today = getDateKeyFromDate(new Date());
    const scopeEnd = getScopeEnd(scopeDays);
    return events
      .filter((raid) => raid.localDate && raid.localDate >= today && raid.localDate <= scopeEnd)
      .sort(compareRaidScheduleAsc);
  }, [events, scopeDays]);

  const scopedRaids = useMemo(() => (
    dateScopedRaids.filter((raid) => {
      const raidTypeMatches = selectedRaidTypes.length === 0 || selectedRaidTypes.includes(raid.raidType);
      const guildMatches = selectedGuildIds.length === 0 || selectedGuildIds.includes(raid.guild_id);
      return raidTypeMatches && guildMatches;
    })
  ), [dateScopedRaids, selectedGuildIds, selectedRaidTypes]);

  const visibleRaids = scopedRaids.slice(0, 72);
  const activeRaid = visibleRaids.find((raid) => raid.raidhelper_event_id === activeRaidId) || visibleRaids[0] || null;
  const selectedGuild = useMemo(
    () => guilds.find((guild) => guild.guild_id === selectedGuildId) || null,
    [guilds, selectedGuildId]
  );
  const selectedGuildRaids = useMemo(() => {
    if (!selectedGuild) return [];
    const today = getDateKeyFromDate(new Date());
    const upcoming = selectedGuild.raids
      .filter((raid) => raid.localDate && raid.localDate >= today)
      .sort(compareRaidScheduleAsc);
    const past = selectedGuild.raids
      .filter((raid) => !raid.localDate || raid.localDate < today)
      .sort((a, b) => compareRaidScheduleAsc(b, a));
    return [...upcoming, ...past];
  }, [selectedGuild]);

  const topGuilds = guilds
    .slice()
    .sort((a, b) => b.raids.length - a.raids.length || b.raidsToday - a.raidsToday)
    .slice(0, 28);
  const maxGuildRaids = Math.max(1, ...topGuilds.map((guild) => guild.raids.length));
  const dayBuckets = getDayBuckets(scopedRaids, scopeDays);
  const maxBucket = Math.max(1, ...dayBuckets.map((bucket) => bucket.count));
  const maxRaidType = Math.max(1, ...raidsByType.map((type) => type.count));
  const guildFilterBase = selectedRaidTypes.length === 0
    ? dateScopedRaids
    : dateScopedRaids.filter((raid) => selectedRaidTypes.includes(raid.raidType));
  const raidTypeFilterBase = selectedGuildIds.length === 0
    ? dateScopedRaids
    : dateScopedRaids.filter((raid) => selectedGuildIds.includes(raid.guild_id));
  const typeScopeCounts = RAID_TYPE_ORDER.reduce((counts, raidType) => {
    counts[raidType] = raidTypeFilterBase.filter((raid) => raid.raidType === raidType).length;
    return counts;
  }, {});
  const guildScopeCounts = guildFilterBase.reduce((counts, raid) => {
    counts[raid.guild_id] = (counts[raid.guild_id] || 0) + 1;
    return counts;
  }, {});
  const guildFilterOptions = guilds
    .filter((guild) => guildScopeCounts[guild.guild_id])
    .sort((a, b) => (guildScopeCounts[b.guild_id] || 0) - (guildScopeCounts[a.guild_id] || 0));
  const nextRaidLabel = visibleRaids[0] ? formatRaidDateTime(visibleRaids[0]) : "No contacts";
  const busiestBucket = dayBuckets.slice().sort((a, b) => b.count - a.count)[0];

  function toggleRaidType(raidType) {
    setSelectedRaidTypes((prev) => (
      prev.includes(raidType)
        ? prev.filter((type) => type !== raidType)
        : [...prev, raidType]
    ));
  }

  function toggleGuild(guildId) {
    setSelectedGuildIds((prev) => (
      prev.includes(guildId)
        ? prev.filter((id) => id !== guildId)
        : [...prev, guildId]
    ));
  }

  function selectGuildAndScroll(guildId) {
    setSelectedGuildId(guildId);
    window.requestAnimationFrame(() => {
      selectedGuildPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <main className="stats5-page">
      <section className="stats5-hero">
        <div>
          <p className="stats5-kicker">Experiment 04</p>
          <h1>Horizon Radar</h1>
          <p>
            Centcom presents upcoming raids by type and time. Guild icons stay clickable so
            the page behaves the way you naturally expect.
          </p>
        </div>
        <div className="stats5-totals" aria-label="Summary">
          <span><strong>{totalGuilds}</strong> guilds</span>
          <span><strong>{totalRaids}</strong> raids tracked</span>
          <span><strong>{raidsToday}</strong> today</span>
        </div>
      </section>

      {error && <p className="stats5-error">Could not load stats.</p>}

      <section className="stats5-controls" aria-label="Radar controls">
        <div className="stats5-control-row stats5-control-row--primary">
          <div>
            <span>Radar range</span>
            <div className="stats5-segments">
              {SCOPE_OPTIONS.map((option) => (
                <button
                  className={scopeDays === option.days ? "stats5-segment stats5-segment--active" : "stats5-segment"}
                  key={option.days}
                  onClick={() => setScopeDays(option.days)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span>View</span>
            <div className="stats5-segments">
              <button
                className={viewMode === "radar" ? "stats5-segment stats5-segment--active" : "stats5-segment"}
                onClick={() => setViewMode("radar")}
                type="button"
              >
                Radar
              </button>
              <button
                className={viewMode === "timeline" ? "stats5-segment stats5-segment--active" : "stats5-segment"}
                onClick={() => setViewMode("timeline")}
                type="button"
              >
                Timeline
              </button>
            </div>
          </div>
        </div>
        <div className="stats5-filter-row">
          <span>Raid type</span>
          <div className="stats5-chip-rail" aria-label="Filter by raid type">
            <button
              className={selectedRaidTypes.length === 0 ? "stats5-filter-chip stats5-filter-chip--active" : "stats5-filter-chip"}
              onClick={() => setSelectedRaidTypes([])}
              type="button"
            >
              <span>All</span>
              <b>{raidTypeFilterBase.length}</b>
            </button>
            {RAID_TYPE_ORDER.map((raidType) => (
              <button
                className={selectedRaidTypes.includes(raidType) ? "stats5-filter-chip stats5-filter-chip--active" : "stats5-filter-chip"}
                key={raidType}
                onClick={() => toggleRaidType(raidType)}
                style={{ "--raid-color": RAID_COLORS[raidType] }}
                type="button"
              >
                <span>{raidType}</span>
                <b>{typeScopeCounts[raidType]}</b>
              </button>
            ))}
          </div>
        </div>
        <div className="stats5-filter-row">
          <span>Guilds</span>
          <div className="stats5-chip-rail stats5-chip-rail--guilds" aria-label="Filter by guild">
            <button
              className={selectedGuildIds.length === 0 ? "stats5-filter-chip stats5-filter-chip--active" : "stats5-filter-chip"}
              onClick={() => setSelectedGuildIds([])}
              type="button"
            >
              <span>All guilds</span>
              <b>{guildFilterBase.length}</b>
            </button>
            {guildFilterOptions.map((guild) => (
              <button
                className={selectedGuildIds.includes(guild.guild_id) ? "stats5-filter-chip stats5-filter-chip--guild stats5-filter-chip--active" : "stats5-filter-chip stats5-filter-chip--guild"}
                key={guild.guild_id}
                onClick={() => toggleGuild(guild.guild_id)}
                type="button"
              >
                <GuildAvatar guild={guild} />
                <span>{guild.guildName || "Unknown guild"}</span>
                <b>{guildScopeCounts[guild.guild_id]}</b>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="stats5-command" aria-busy={isLoading}>
        <div className="stats5-visual">
          <div className="stats5-radar-count">
            Showing <strong>{visibleRaids.length}</strong> raids
          </div>
          {viewMode === "radar" ? (
            <div className="stats5-radar" aria-label="Upcoming raid radar">
              <div className="stats5-radar-grid" />
              <div className="stats5-radar-sweep" />
              <div className="stats5-radar-center">
                <img src={horizonMark} alt="" />
              </div>
              {RAID_TYPE_ORDER.map((raidType, index) => (
                (() => {
                  const angle = -90 + index * (360 / RAID_TYPE_ORDER.length) + 360 / RAID_TYPE_ORDER.length / 2;
                  const radians = (angle * Math.PI) / 180;
                  const radius = 52;

                  return (
                    <span
                      className="stats5-radar-slice"
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
                })()
              ))}
              {visibleRaids.map((raid, index) => {
                const point = getPointPosition(raid, index, visibleRaids);
                const isActive = activeRaid?.raidhelper_event_id === raid.raidhelper_event_id;
                return (
                  <a
                    className={isActive ? "stats5-blip stats5-blip--active" : "stats5-blip"}
                    href={getDiscordUrl(raid)}
                    key={raid.raidhelper_event_id}
                    onFocus={() => setActiveRaidId(raid.raidhelper_event_id)}
                    onMouseEnter={() => setActiveRaidId(raid.raidhelper_event_id)}
                    rel="noreferrer"
                    style={{
                      "--x": `${point.x}%`,
                      "--y": `${point.y}%`,
                      "--raid-color": RAID_COLORS[raid.raidType],
                      "--delay": `${index * 20}ms`,
                    }}
                    target="_blank"
                  >
                    <RaidAvatar raid={raid} />
                    <span className="stats5-blip-card">
                      <strong>{raid.raid_name || raid.title}</strong>
                      <em>{raid.guildName}</em>
                      <small>{raid.raidType} / {formatRaidDateTime(raid)}</small>
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="stats5-timeline" aria-label="Upcoming raid timeline">
              {visibleRaids.map((raid, index) => {
                const x = visibleRaids.length <= 1 ? 50 : (index / (visibleRaids.length - 1)) * 100;
                const lane = RAID_TYPE_ORDER.indexOf(raid.raidType);
                const y = 13 + (Math.max(0, lane) % RAID_TYPE_ORDER.length) * 10.5;
                const isActive = activeRaid?.raidhelper_event_id === raid.raidhelper_event_id;
                return (
                  <a
                    className={isActive ? "stats5-star stats5-star--active" : "stats5-star"}
                    href={getDiscordUrl(raid)}
                    key={raid.raidhelper_event_id}
                    onFocus={() => setActiveRaidId(raid.raidhelper_event_id)}
                    onMouseEnter={() => setActiveRaidId(raid.raidhelper_event_id)}
                    rel="noreferrer"
                    style={{
                      "--x": `${x}%`,
                      "--y": `${y}%`,
                      "--raid-color": RAID_COLORS[raid.raidType],
                    }}
                    target="_blank"
                  >
                    <RaidAvatar raid={raid} />
                    <span>
                      <strong>{raid.raidType}</strong>
                      <em>{formatRaidDateTime(raid)}</em>
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <aside className="stats5-feed">
          <header>
            <span>Radar Feed</span>
            <strong>{scopeDays === 1 ? "Today" : `Next ${scopeDays} days`}</strong>
          </header>
          <div className="stats5-feed-list">
            {visibleRaids.map((raid) => {
              const isActive = activeRaid?.raidhelper_event_id === raid.raidhelper_event_id;
              return (
                <a
                  className={isActive ? "stats5-feed-item stats5-feed-item--active" : "stats5-feed-item"}
                  href={getDiscordUrl(raid)}
                  key={raid.raidhelper_event_id}
                  onFocus={() => setActiveRaidId(raid.raidhelper_event_id)}
                  onMouseEnter={() => setActiveRaidId(raid.raidhelper_event_id)}
                  rel="noreferrer"
                  style={{ "--raid-color": RAID_COLORS[raid.raidType] }}
                  target="_blank"
                >
                  <RaidAvatar raid={raid} />
                  <span>{raid.raidType}</span>
                  <strong>{raid.raid_name || raid.title}</strong>
                  <em>{raid.guildName}</em>
                  <small>{formatRaidDateTime(raid)}</small>
                </a>
              );
            })}
            {visibleRaids.length === 0 && (
              <p className="stats5-empty">No raids found in this radar range.</p>
            )}
          </div>
        </aside>
      </section>

      <section className="stats5-detail">
        <div className="stats5-active-card">
          <span>Radar filters</span>
          <strong>{selectedRaidTypes.length || selectedGuildIds.length ? "Filtered contacts" : "All contacts"}</strong>
          {activeRaid ? (
            <p className="stats5-contact-line">
              Contact: <b>{activeRaid.raid_name || activeRaid.title}</b> / {activeRaid.guildName} / {formatRaidDateTime(activeRaid)}
            </p>
          ) : (
            <p className="stats5-contact-line">No contacts match this filter.</p>
          )}
        </div>

        <div className="stats5-line-card">
          <header>
            <span>Scope summary</span>
            <strong>{selectedRaidTypes.length === 1 ? selectedRaidTypes[0] : selectedRaidTypes.length > 1 ? `${selectedRaidTypes.length} raid types` : "All raids"}</strong>
          </header>
          <div className="stats5-scope-metrics">
            <span><b>{visibleRaids.length}</b> contacts</span>
            <span><b>{nextRaidLabel}</b> next</span>
            <span><b>{busiestBucket?.label || "None"}</b> busiest</span>
          </div>
          <div className="stats5-line-chart">
            {dayBuckets.map((bucket) => (
              <div className="stats5-line-column" key={bucket.key}>
                <i style={{ "--bar-height": `${Math.max(5, (bucket.count / maxBucket) * 100)}%` }} />
                <span>{bucket.label}</span>
                <strong>{bucket.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats5-guilds">
        <header>
          <div>
            <span>Guild activity</span>
            <strong>All tracked raids</strong>
          </div>
          <p>Hover for stats. Click a guild to list every tracked raid below.</p>
        </header>
        <div className="stats5-guild-wall">
          {topGuilds.map((guild, index) => {
            const activity = guild.raids.length / maxGuildRaids;
            const scopedCount = scopedRaids.filter((raid) => raid.guild_id === guild.guild_id).length;
            const isSelected = selectedGuild?.guild_id === guild.guild_id;
            return (
              <button
                className={isSelected ? "stats5-guild stats5-guild--selected" : "stats5-guild"}
                key={guild.guild_id}
                onClick={() => selectGuildAndScroll(guild.guild_id)}
                style={{
                  "--guild-size": `${48 + activity * 46}px`,
                  "--guild-color": RAID_COLORS[guild.dominantType],
                  "--delay": `${index * 24}ms`,
                }}
                type="button"
              >
                <span className="stats5-guild-orb"><GuildAvatar guild={guild} /></span>
                <strong>{guild.guildName || "Unknown guild"}</strong>
                <em>{guild.raids.length} total</em>
                <span className="stats5-guild-card">
                  <b>{guild.guildName || "Unknown guild"}</b>
                  <small>{guild.raids.length} total tracked raids</small>
                  <small>{scopedCount} raids in current radar range</small>
                  {guild.nextRaid && <small>{guild.nextRaid.raidType} next: {formatRaidDateTime(guild.nextRaid)}</small>}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="stats5-lower">
        <div className="stats5-guild-raids" ref={selectedGuildPanelRef}>
          <header>
            <span>Selected guild</span>
            <strong>{selectedGuild?.guildName || "Click a guild icon"}</strong>
            {selectedGuild && <p>{selectedGuild.raids.length} total tracked raids</p>}
          </header>
          <div>
            {selectedGuildRaids.slice(0, 80).map((raid) => (
              <a
                className="stats5-guild-raid"
                href={getDiscordUrl(raid)}
                key={raid.raidhelper_event_id}
                rel="noreferrer"
                style={{ "--raid-color": RAID_COLORS[raid.raidType] }}
                target="_blank"
              >
                <span>{raid.raidType}</span>
                <strong>{raid.raid_name || raid.title}</strong>
                <em>{formatRaidDateTime(raid)}</em>
              </a>
            ))}
            {!selectedGuild && <p className="stats5-empty">Guild raid history appears here.</p>}
          </div>
        </div>

        <div className="stats5-type-card">
          <header>
            <span>All time</span>
            <strong>Raid type mix</strong>
          </header>
          {RAID_TYPE_ORDER.map((raidType) => {
            const type = raidsByType.find((item) => item.raidType === raidType);
            const count = type?.count || 0;
            return (
              <div
                className="stats5-type-row"
                key={raidType}
                style={{
                  "--raid-color": RAID_COLORS[raidType],
                  "--type-width": `${Math.max(4, (count / maxRaidType) * 100)}%`,
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
    </main>
  );
}

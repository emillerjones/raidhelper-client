import horizonMark from "./assets/horizon-mark.png";
import { useMemo, useState } from "react";
import {
  compareRaidScheduleAsc,
  formatRaidDateTime,
  getDateKeyFromDate,
  RAID_COLORS,
  useStatsData,
} from "./statsData";
import "./Stats2.css";

function GuildAvatar({ guild }) {
  if (guild.guildIconUrl) {
    return <img src={guild.guildIconUrl} alt="" />;
  }

  return <img src={horizonMark} alt="" />;
}

export default function Stats2() {
  const [selectedGuildId, setSelectedGuildId] = useState(null);
  const { error, guilds, isLoading, raidsByType, totalGuilds, totalRaids, raidsToday } = useStatsData();
  const mostActive = guilds
    .slice()
    .sort((a, b) => b.raids.length - a.raids.length || b.raidsThisWeek - a.raidsThisWeek)
    .slice(0, 28);
  const maxTotal = Math.max(1, ...mostActive.map((guild) => guild.raids.length));
  const selectedGuild = useMemo(
    () => guilds.find((guild) => guild.guild_id === selectedGuildId) || mostActive[0] || null,
    [guilds, mostActive, selectedGuildId]
  );
  const selectedRaids = useMemo(() => {
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

  return (
    <main className="stats2-page">
      <section className="stats2-hero">
        <div>
          <p className="stats2-kicker">Experiment 01</p>
          <h1>Guild Activity</h1>
          <p>
            Icon size is based on total tracked raids. The ring
            color shows each guild's most common raid type.
          </p>
        </div>
        <div className="stats2-totals" aria-label="Summary">
          <span><strong>{totalGuilds}</strong> guilds</span>
          <span><strong>{totalRaids}</strong> raids</span>
          <span><strong>{raidsToday}</strong> today</span>
        </div>
      </section>

      {error && <p className="stats2-error">Could not load stats.</p>}

      <section className="stats2-type-strip" aria-label="Raid type totals">
        {raidsByType.map((type) => (
          <div
            className="stats2-type"
            key={type.raidType}
            style={{ "--raid-color": RAID_COLORS[type.raidType] }}
          >
            <span>{type.raidType}</span>
            <strong>{type.count}</strong>
          </div>
        ))}
      </section>

      <section className="stats2-board" aria-busy={isLoading}>
        <div className="stats2-board-head">
          <div>
            <span>Most active guilds</span>
            <strong>All time</strong>
          </div>
          <p>Large icons have more tracked raids. Click a guild to inspect its upcoming raid list.</p>
        </div>

        <div className="stats2-wall">
          {mostActive.map((guild, index) => {
            const activity = guild.raids.length / maxTotal;
            const size = 46 + Math.round(activity * 48);
            const color = RAID_COLORS[guild.dominantType];
            const isSelected = selectedGuild?.guild_id === guild.guild_id;

            return (
              <button
                type="button"
                className={isSelected ? "stats2-guild-node stats2-guild-node--selected" : "stats2-guild-node"}
                key={guild.guild_id}
                onClick={() => setSelectedGuildId(guild.guild_id)}
                style={{
                  "--node-size": `${size}px`,
                  "--node-color": color,
                  "--delay": `${index * 35}ms`,
                }}
              >
                <div className="stats2-guild-orb">
                  <GuildAvatar guild={guild} />
                </div>
                <div className="stats2-guild-label">
                  <strong>{guild.guildName || "Unknown guild"}</strong>
                  <span>{guild.raids.length} total</span>
                </div>
                <div className="stats2-guild-info">
                  <strong>{guild.guildName || "Unknown guild"}</strong>
                  <span>{guild.raids.length} total tracked raids</span>
                  <span>{guild.raidsThisWeek} raids in the next 7 days</span>
                  {guild.nextRaid && (
                  <em>{guild.nextRaid.raidType} next: {formatRaidDateTime(guild.nextRaid)}</em>
                )}
              </div>
            </button>
            );
          })}
        </div>
      </section>

      <section className="stats2-selected">
        <div className="stats2-selected-head">
          <div>
            <span>Selected guild</span>
            <strong>{selectedGuild?.guildName || "Choose a guild"}</strong>
          </div>
          {selectedGuild && (
            <p>
              {selectedGuild.raids.length} total tracked / {selectedGuild.raidsThisWeek} this week
            </p>
          )}
        </div>

        <div className="stats2-raid-list">
          {selectedRaids.length > 0 ? (
            selectedRaids.map((raid) => (
              <a
                className="stats2-raid-row"
                href={`https://discord.com/channels/${raid.guild_id}/${raid.channel_id}`}
                key={raid.raidhelper_event_id}
                rel="noreferrer"
                target="_blank"
                style={{ "--raid-color": RAID_COLORS[raid.raidType] }}
              >
                <span>{raid.raidType}</span>
                <strong>{raid.raid_name || raid.title}</strong>
                <em>{formatRaidDateTime(raid)}</em>
              </a>
            ))
          ) : (
            <p className="stats2-empty">No tracked raids found for this guild.</p>
          )}
        </div>
      </section>
    </main>
  );
}

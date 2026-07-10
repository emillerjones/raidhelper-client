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
import "./HorizonSplash2.css";

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
  const scatter = (((index * 41) % 23) - 11) / 11;
  const angle = sliceStart + sliceSize / 2 + scatter * Math.min(14, sliceSize * 0.34);
  const raidTimes = raids.map(getRaidScheduleValue);
  const firstRaidTime = Math.min(...raidTimes);
  const lastRaidTime = Math.max(...raidTimes);
  const span = Math.max(1, lastRaidTime - firstRaidTime);
  const progress = raids.length <= 1 ? 0.5 : Math.min(1, Math.max(0, (getRaidScheduleValue(raid) - firstRaidTime) / span));
  const sameTypeOffset = raids.slice(0, index).filter((item) => item.raidType === raid.raidType).length;
  const radius = Math.min(45, 12 + progress * 33 + (sameTypeOffset % 3) * 1.4);
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

export default function HorizonSplash2() {
  const { error, events, guilds, isLoading, raidsByType, totalGuilds, totalRaids, raidsToday } = useStatsData();
  const today = getDateKeyFromDate(new Date());
  const scopeEnd = getScopeEnd(2);
  const radarRaids = events
    .filter((raid) => raid.localDate && raid.localDate >= today && raid.localDate <= scopeEnd)
    .sort(compareRaidScheduleAsc)
    .slice(0, 18);
  const feedRaids = radarRaids.slice(0, 7);
  const topGuilds = guilds
    .slice()
    .sort((a, b) => b.raids.length - a.raids.length || b.raidsToday - a.raidsToday)
    .slice(0, 14);
  const maxRaidType = Math.max(1, ...raidsByType.map((type) => type.count));
  const nextRaid = radarRaids[0] || null;
  const peakType = raidsByType.slice().sort((a, b) => b.count - a.count)[0];

  return (
    <main className="splash2-page">
      <section className="splash2-hero">
        <div className="splash2-hero-copy">
          <p className="splash2-kicker">CENTCOM Presents</p>
          <h1>Horizon Radar</h1>
          <p>
            Track incoming raid contacts across the horizon, identified by guild origin, raid type,
            and time to arrival.
          </p>

          <div className="splash2-cta-row">
            <Link className="splash2-btn splash2-btn--primary" to="/stats5">
              Open Radar
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="splash2-btn splash2-btn--secondary" to="/calendar">
              View Calendar
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>

          <div className="splash2-status-strip" aria-label="Live status">
            <span><strong>{totalGuilds || "--"}</strong> guilds</span>
            <span><strong>{totalRaids || "--"}</strong> raids tracked</span>
            <span><strong>{raidsToday || 0}</strong> today</span>
          </div>
        </div>

        <div className="splash2-command-preview" aria-busy={isLoading}>
          <div className="splash2-radar-card">
            <div className="splash2-radar-header">
              <span>Live scan</span>
              <strong>{radarRaids.length} contacts</strong>
            </div>
            <div className="splash2-radar" aria-label="Raid radar preview">
              <div className="splash2-radar-grid" />
              <div className="splash2-radar-sweep" />
              <div className="splash2-radar-core">
                <img src={horizonMark} alt="" />
              </div>
              {RAID_TYPE_ORDER.map((raidType, index) => {
                const angle = -90 + index * (360 / RAID_TYPE_ORDER.length) + 360 / RAID_TYPE_ORDER.length / 2;
                const radians = (angle * Math.PI) / 180;
                const radius = 55;
                return (
                  <span
                    className="splash2-radar-label"
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
                    className="splash2-blip"
                    href={getDiscordUrl(raid)}
                    key={raid.raidhelper_event_id}
                    rel="noreferrer"
                    style={{
                      "--x": `${point.x}%`,
                      "--y": `${point.y}%`,
                      "--raid-color": RAID_COLORS[raid.raidType],
                      "--delay": `${index * 28}ms`,
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

          <aside className="splash2-feed-card">
            <header>
              <span>Radar feed</span>
              <strong>Next contacts</strong>
            </header>
            <div className="splash2-feed-list">
              {feedRaids.map((raid) => (
                <a
                  className="splash2-feed-item"
                  href={getDiscordUrl(raid)}
                  key={raid.raidhelper_event_id}
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
              ))}
              {!isLoading && feedRaids.length === 0 && (
                <p className="splash2-empty">No incoming contacts in the preview window.</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="splash2-panels" aria-label="Radar and calendar overview">
        <article className="splash2-choice splash2-choice--radar">
          <span>Command view</span>
          <h2>Radar for what is happening next.</h2>
          <p>
            Sweep by range, filter by raid type or guild, then open the contact directly in Discord.
          </p>
          <Link to="/stats5">Open Radar</Link>
        </article>
        <article className="splash2-choice splash2-choice--calendar">
          <span>Planning view</span>
          <h2>Calendar for the whole schedule.</h2>
          <p>
            Use the full calendar when you want day-by-day planning across every tracked guild.
          </p>
          <Link to="/calendar">View Calendar</Link>
        </article>
      </section>

      <section className="splash2-intel">
        <div className="splash2-intel-copy">
          <span>Signal intelligence</span>
          <h2>One network, two ways to read it.</h2>
          <p>
            Radar turns urgency into a visual scan. Calendar turns the same data into a clean schedule.
            Both views stay fed by the same tracked Discord raid posts.
          </p>
          <div className="splash2-intel-metrics">
            <span><strong>{nextRaid ? formatRaidDateTime(nextRaid) : "Standby"}</strong> next contact</span>
            <span><strong>{peakType?.raidType || "None"}</strong> strongest signal</span>
          </div>
        </div>

        <div className="splash2-type-mix" aria-label="Raid type mix">
          {RAID_TYPE_ORDER.map((raidType) => {
            const type = raidsByType.find((item) => item.raidType === raidType);
            const count = type?.count || 0;
            return (
              <div
                className="splash2-type-row"
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

      <section className="splash2-guilds" aria-label="Tracked guilds">
        <header>
          <span>Guild origin registry</span>
          <strong>Real guild icons. Real raid traffic.</strong>
        </header>
        <div className="splash2-guild-wall">
          {topGuilds.map((guild, index) => (
            <Link
              className="splash2-guild"
              key={guild.guild_id}
              style={{
                "--guild-color": RAID_COLORS[guild.dominantType],
                "--delay": `${index * 26}ms`,
              }}
              to="/stats5"
            >
              <GuildAvatar guild={guild} />
              <span>{guild.guildName || "Unknown guild"}</span>
              <em>{guild.raids.length} raids</em>
            </Link>
          ))}
        </div>
        {error && <p className="splash2-empty">Live stats are temporarily unavailable.</p>}
      </section>
    </main>
  );
}

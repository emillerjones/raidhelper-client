import {
  formatRaidDateTime,
  RAID_COLORS,
  RAID_TYPE_ORDER,
  useStatsData,
} from "./statsData";
import "./Stats4.css";

function getTimelinePosition(raid, firstTime, spanMs) {
  const raidTime = new Date(raid.startTime).getTime();
  if (!Number.isFinite(raidTime) || spanMs <= 0) return 0;
  return Math.min(100, Math.max(0, ((raidTime - firstTime) / spanMs) * 100));
}

export default function Stats4() {
  const { upcomingRaids, raidsByType, totalRaids } = useStatsData();
  const visibleRaids = upcomingRaids.slice(0, 18);
  const firstTime = visibleRaids[0] ? new Date(visibleRaids[0].startTime).getTime() : Date.now();
  const lastTime = visibleRaids.at(-1) ? new Date(visibleRaids.at(-1).startTime).getTime() : firstTime + 1;
  const spanMs = Math.max(1, lastTime - firstTime);

  return (
    <main className="stats4-page">
      <section className="stats4-hero">
        <p>Experiment 03</p>
        <h1>Timeline Constellation</h1>
        <span>
          The next {visibleRaids.length} upcoming raids, plotted left to right by start time from {totalRaids} tracked raids.
        </span>
      </section>

      <section className="stats4-constellation" aria-label="Upcoming raid timeline constellation">
        <div className="stats4-axis">
          <span>{visibleRaids[0] ? formatRaidDateTime(visibleRaids[0]) : "Soon"}</span>
          <span>{visibleRaids.at(-1) ? formatRaidDateTime(visibleRaids.at(-1)) : "Later"}</span>
        </div>
        {visibleRaids.map((raid, index) => {
          const x = getTimelinePosition(raid, firstTime, spanMs);
          const row = index % 5;
          const y = 18 + row * 15;
          const color = RAID_COLORS[raid.raidType];

          return (
            <article
              className="stats4-star"
              key={raid.raidhelper_event_id}
              style={{
                "--x": `${x}%`,
                "--y": `${y}%`,
                "--raid-color": color,
                "--delay": `${index * 60}ms`,
              }}
            >
              <span />
              <div className="stats4-star-label">
                <strong>{raid.raidType}</strong>
                <em>{raid.guildName}</em>
                <small>{formatRaidDateTime(raid)}</small>
              </div>
              <div className="stats4-star-card">
                <strong>{raid.raid_name || raid.title}</strong>
                <em>{raid.guildName}</em>
                <small>{formatRaidDateTime(raid)}</small>
              </div>
            </article>
          );
        })}
      </section>

      <section className="stats4-upcoming-list">
        <header>
          <span>Upcoming sequence</span>
          <strong>Next raids by time</strong>
        </header>
        <div>
          {visibleRaids.slice(0, 8).map((raid) => (
            <a
              className="stats4-upcoming-item"
              href={`https://discord.com/channels/${raid.guild_id}/${raid.channel_id}`}
              key={raid.raidhelper_event_id}
              rel="noreferrer"
              target="_blank"
              style={{ "--raid-color": RAID_COLORS[raid.raidType] }}
            >
              <span>{raid.raidType}</span>
              <strong>{raid.raid_name || raid.title}</strong>
              <em>{raid.guildName}</em>
              <small>{formatRaidDateTime(raid)}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="stats4-lanes">
        <header className="stats4-lanes-head">
          <span>All tracked raids</span>
          <strong>Raid type mix</strong>
        </header>
        {RAID_TYPE_ORDER.map((raidType) => {
          const type = raidsByType.find((item) => item.raidType === raidType);
          const count = type?.count || 0;
          const maxCount = Math.max(1, ...raidsByType.map((item) => item.count));

          return (
            <div
              className="stats4-lane"
              key={raidType}
              style={{
                "--raid-color": RAID_COLORS[raidType],
                "--lane-width": `${Math.max(5, (count / maxCount) * 100)}%`,
              }}
            >
              <span>{raidType}</span>
              <div><i /></div>
              <strong>{count}</strong>
            </div>
          );
        })}
      </section>
    </main>
  );
}

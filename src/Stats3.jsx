import horizonMark from "./assets/horizon-mark.png";
import {
  formatRaidDateTime,
  RAID_COLORS,
  useStatsData,
} from "./statsData";
import "./Stats3.css";

export default function Stats3() {
  const { upcomingRaids, raidsByType, totalGuilds, totalRaids } = useStatsData();
  const radarRaids = upcomingRaids.slice(0, 12);

  return (
    <main className="stats3-page">
      <section className="stats3-hero">
        <div className="stats3-copy">
          <p className="stats3-kicker">Experiment 02</p>
          <h1>Raid Radar</h1>
          <p>
            The next {radarRaids.length} upcoming raids. Inner rings are sooner,
            outer rings are farther out. Labels stay visible so the radar reads
            without hover.
          </p>
        </div>
        <div className="stats3-summary">
          <span><strong>{totalGuilds}</strong> guilds</span>
          <span><strong>{totalRaids}</strong> raids tracked</span>
        </div>
      </section>

      <section className="stats3-legend">
        <span>Radar scope</span>
        <strong>Today and upcoming raids</strong>
        <p>Raid labels show type, guild, and local time. Hover a blip for the full title.</p>
      </section>

      <section className="stats3-shell">
        <div className="stats3-radar" aria-label="Upcoming raid radar">
          <div className="stats3-ring stats3-ring--one" />
          <div className="stats3-ring stats3-ring--two" />
          <div className="stats3-ring stats3-ring--three" />
          <div className="stats3-sweep" />
          <div className="stats3-center">
            <img src={horizonMark} alt="" />
          </div>

          {radarRaids.map((raid, index) => {
            const angle = -82 + index * (360 / Math.max(1, radarRaids.length));
            const radius = 21 + (index % 4) * 12;
            const radians = (angle * Math.PI) / 180;
            const x = 50 + Math.cos(radians) * radius;
            const y = 50 + Math.sin(radians) * radius;
            const color = RAID_COLORS[raid.raidType];
            const labelSide = x > 56 ? "right" : x < 44 ? "left" : "center";

            return (
              <article
                className={`stats3-blip stats3-blip--${labelSide}`}
                key={raid.raidhelper_event_id}
                style={{
                  "--x": `${x}%`,
                  "--y": `${y}%`,
                  "--raid-color": color,
                  "--delay": `${index * 70}ms`,
                }}
              >
                <span />
                <div className="stats3-blip-label">
                  <strong>{raid.raidType}</strong>
                  <em>{raid.guildName}</em>
                  <small>{formatRaidDateTime(raid)}</small>
                </div>
                <div className="stats3-blip-card">
                  <strong>{raid.raid_name || raid.title}</strong>
                  <em>{raid.guildName}</em>
                  <small>{formatRaidDateTime(raid)}</small>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="stats3-next-list">
          <span>Radar feed</span>
          <strong>Next raids</strong>
          {radarRaids.slice(0, 8).map((raid) => (
            <div
              className="stats3-next-item"
              key={raid.raidhelper_event_id}
              style={{ "--raid-color": RAID_COLORS[raid.raidType] }}
            >
              <i>{raid.raidType}</i>
              <p>{raid.raid_name || raid.title}</p>
              <em>{raid.guildName} / {formatRaidDateTime(raid)}</em>
            </div>
          ))}
        </aside>
      </section>

      <section className="stats3-type-panel">
        {raidsByType.map((type) => (
          <div
            className="stats3-type"
            key={type.raidType}
            style={{ "--raid-color": RAID_COLORS[type.raidType] }}
          >
            <span>{type.raidType}</span>
            <strong>{type.count}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}

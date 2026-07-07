export default function GuildBadge({ guildName, guildIconUrl, allGuildNames }) {
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

function getGuildColor(guildName, allGuildNames) {
  if (!guildName) return "hsl(0, 0%, 50%)";
  const index = allGuildNames.indexOf(guildName);
  const total = allGuildNames.length || 1;
  const hue = (index / total) * 360;
  return `hsl(${hue}, 65%, 55%)`;
}


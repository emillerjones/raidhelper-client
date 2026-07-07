import { useEffect, useState } from "react";
import "./RaidEventDetailsModal.css";
import GuildBadge from "./components/GuildBadge";

const API = import.meta.env.VITE_API;

export default function RaidEventDetails({event, onClose}) {
  const [raidEventDetails, setRaidEventDetails] = useState(null);

  // if (!raidEventDetails) return <p>Loading Event...</p>;
  if (!event) return null;
  
  return (
    <div className="raid-event-modal-backdrop">
      <section className="raid-event-modal">
        <button
          type="button"
          className="raid-event-modal__close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="raid-event-modal__header">
          <GuildBadge
            guildName={event.guildName || event.guild_name}
            guildIconUrl={event.guildIconUrl || event.guild_icon_url}
            allGuildNames={[event.guildName || event.guild_name]}
          />

          <div className="raid-event-modal__header-text">
            <h3>{event.guildName || event.guild_name}</h3>
            <h2>{event.raid_name || event.title}</h2>
          </div>
        </div>


        <div className="raid-event-modal__fields">

          {/* <div className="raid-event-modal__field">
            <strong>Title</strong>
            <span>{event.title}</span>
          </div> */}

          <div className="raid-event-modal__field">
            <strong>Raid Leader</strong>
            <span>{event.raid_leader}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>Raid Notes</strong>
            <span>{event.raid_notes}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>Start Time</strong>
            <span>
              {new Date(event.start_time).toLocaleString()}
            </span>
          </div>

          <div className="raid-event-modal__field">
            <strong>Signup Count</strong>
            <span>{event.signup_count}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>Signup Max</strong>
            <span>{event.signup_max}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>RaidHelper URL</strong>
            <span>{event.raidhelper_url}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>SoftRes URL</strong>
            <span>{event.softres_url}</span>
          </div>



          <div className="raid-event-modal__field">
            <strong>Guild</strong>
            <span>{event.guild_name}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>Guild ID</strong>
            <span>{event.guild_id}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>Channel ID</strong>
            <span>{event.channel_id}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>Event ID</strong>
            <span>{event.event_id}</span>
          </div>

          <div className="raid-event-modal__field">
            <strong>RaidHelper Event ID</strong>
            <span>{event.raidhelper_event_id}</span>
          </div>

          {/* <div className="raid-event-modal__field">
            <strong>Raid Name</strong>
            <span>{event.raid_name}</span>
          </div> */}

          

          <div className="raid-event-modal__field">
            <strong>Created At</strong>
            <span>
              {new Date(event.created_at).toLocaleString()}
            </span>
          </div>

          <div className="raid-event-modal__field">
            <strong>Updated At</strong>
            <span>
              {new Date(event.updated_at).toLocaleString()}
            </span>
          </div>

          {/* <div className="raid-event-modal__field">
            <strong>Raw JSON</strong>
            <pre>{JSON.stringify(event.raw_json, null, 2)}</pre>
          </div> */}

        </div>
      </section>
    </div>
  );

}

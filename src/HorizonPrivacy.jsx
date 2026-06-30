import "./HorizonPrivacy.css";

export default function HorizonPrivacy() {
  return (
    <div className="priv-page">
      <section className="priv-hero">
        <p className="priv-eyebrow">LEGAL</p>
        <h1 className="priv-headline">Privacy Policy</h1>
        <p className="priv-updated">Last updated: June 30, 2026</p>
      </section>

      <section className="priv-card">
        <h2>What Horizon Collects</h2>
        <p>
          The Horizon Chrome extension only collects raid event data that is
          already publicly visible in the Discord servers you choose to scan
          — specifically, messages posted by the Raid-Helper bot (raid name,
          time, raid type, creator, signup counts, and channel link). The
          extension does not collect personal messages, account credentials,
          browsing history, or any data outside of Raid-Helper event posts.
        </p>
      </section>

      <section className="priv-card">
        <h2>How It's Used</h2>
        <p>
          Scraped event data is sent to Horizon's servers and displayed on
          the public Horizon calendar so players can browse upcoming raids
          across guilds. No data is sold or shared with third parties for
          advertising or marketing purposes.
        </p>
      </section>

      <section className="priv-card">
        <h2>Storage</h2>
        <p>
          Event data is stored in Horizon's database for as long as needed
          to power the calendar. We don't store Discord credentials, tokens,
          or any data that could identify you personally as a user of the
          extension.
        </p>
      </section>

      <section className="priv-card">
        <h2>Your Choices</h2>
        <p>
          The extension only scans servers you actively browse to while it's
          enabled. You can disable or remove it at any time from Chrome's
          extensions page, which immediately stops any further data
          collection.
        </p>
      </section>

      <section className="priv-card">
        <h2>Contact</h2>
        <p>
          Questions about this policy? Reach out at{" "}
          <a href="mailto:support@horizonraids.app">
            support@horizonraids.app
          </a>
          .
        </p>
      </section>
    </div>
  );
}

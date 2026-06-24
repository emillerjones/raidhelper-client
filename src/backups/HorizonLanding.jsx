import "./HorizonLanding.css";

export default function HorizonLanding() {
  return (
    <div className="horizon-page">

      <nav className="horizon-nav">
        <div className="horizon-logo">
          <div className="horizon-logo-icon"></div>
          <span>HORIZON</span>
        </div>

        <div className="horizon-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="horizon-nav-actions">
          <button className="horizon-btn-secondary">
            Sign In
          </button>

          <button className="horizon-btn-primary">
            Get Started
          </button>
        </div>
      </nav>

      <section className="horizon-hero">

        <div className="horizon-hero-left">

          <div className="horizon-tag">
            Discord Event Calendar
          </div>

          <h1>
            See everything
            <br />
            ahead.
          </h1>

          <p>
            Horizon brings every event from your Discord
            communities into one powerful calendar so
            you never miss what matters.
          </p>

          <div className="horizon-hero-buttons">
            <button className="horizon-btn-primary">
              Get Started Free
            </button>

            <button className="horizon-btn-outline">
              See How It Works
            </button>
          </div>

        </div>

        <div className="horizon-hero-right">

          <div className="mock-calendar">

            <div className="mock-calendar-header">
              Upcoming Events
            </div>

            <div className="mock-calendar-grid">

              <div className="event-card aq40">
                AQ40
              </div>

              <div className="event-card bwl">
                BWL
              </div>

              <div className="event-card zg">
                ZG
              </div>

              <div className="event-card mc">
                MC
              </div>

            </div>

          </div>

        </div>

      </section>

      <section
        id="features"
        className="horizon-features"
      >

        <div className="feature-card">
          <h3>Unified Calendar</h3>
          <p>
            All your Discord communities in one place.
          </p>
        </div>

        <div className="feature-card">
          <h3>Real-Time Updates</h3>
          <p>
            Always up to date.
          </p>
        </div>

        <div className="feature-card">
          <h3>Filters</h3>
          <p>
            Find exactly what matters.
          </p>
        </div>

        <div className="feature-card">
          <h3>Conflict Detection</h3>
          <p>
            Spot overlapping events instantly.
          </p>
        </div>

      </section>

    </div>
  );
}
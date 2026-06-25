import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import horizonLogo from "../assets/horizon-logo.png";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Raid Calendar", path: "/calendar" },
  { label: "Features", path: "/features" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Stats", path: "/stats" },
  { label: "FAQ", path: "/faq" },
];

export default function HorizonNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="horizon-navbar">
      <Link to="/" className="horizon-navbar-brand" onClick={closeMenu}>
        <img src={horizonLogo} alt="Horizon" className="horizon-navbar-logo" />
      </Link>

      <nav className="horizon-navbar-links">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => isActive ? "horizon-navbar-link-active" : ""}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="horizon-navbar-actions">
        <Link to="/calendar" className="horizon-btn horizon-btn-light">Get Started</Link>
      </div>

      <button
        type="button"
        className="horizon-navbar-toggle"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {menuOpen ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {menuOpen && (
        <div className="horizon-navbar-mobile-menu">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) => isActive ? "horizon-navbar-link-active" : ""}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/calendar" className="horizon-btn horizon-btn-light" onClick={closeMenu}>
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}

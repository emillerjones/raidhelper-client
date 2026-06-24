import React from "react";
import { Link } from "react-router-dom";
import horizonLogo from "../assets/horizon-logo.png";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Raid Calendar", path: "/calendar" },
  { label: "Features", path: "/features" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "FAQ", path: "/faq" },
];

export default function HorizonNav() {
  return (
    <header className="horizon-navbar">
      <Link to="/" className="horizon-navbar-brand">
        <img src={horizonLogo} alt="Horizon" className="horizon-navbar-logo" />
      </Link>
      <nav className="horizon-navbar-links">
        {NAV_LINKS.map((link) => (
          <Link key={link.path} to={link.path}>{link.label}</Link>
        ))}
      </nav>
      <div className="horizon-navbar-actions">
        <Link to="/sign-in" className="horizon-signin">Sign In</Link>
        <Link to="/calendar" className="horizon-btn horizon-btn-light">Get Started</Link>
      </div>
    </header>
  );
}

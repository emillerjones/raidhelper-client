import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import earthBg from "../assets/earth-bg.jpg";
import "./MainLayout.css";

export default function MainLayout({ heroHeight = "820px" }) {
  return (
    <div className="main-layout" style={{ position: "relative" }}>
      <div
        className="main-layout-bg"
        style={{ backgroundImage: `url(${earthBg})`, height: heroHeight }}
        aria-hidden="true"
      />
      <div
        className="main-layout-bg-fade"
        style={{ height: heroHeight }}
        aria-hidden="true"
      />

      <Navbar />
      <Outlet />
    </div>
  );
}

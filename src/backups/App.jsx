import { Routes, Route } from "react-router-dom";
import RaidHelperEvents from "./raidhelperevents";

import MainLayout from "./layout/MainLayout";
import AppLayout from "./layout/AppLayout";
import HorizonSplash from "./HorizonSplash";
import HowItWorks from "./HowItWorks";
import Features from "./Features";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/" element={<HorizonSplash />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/features" element={<Features />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/calendar" element={<RaidHelperEvents />} />
      </Route>
    </Routes>
  );
}

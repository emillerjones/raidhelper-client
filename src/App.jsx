import { Routes, Route } from "react-router-dom";
import RaidHelperEvents from "./raidhelperevents";

import MainLayout from "./layout/MainLayout";
import AppLayout from "./layout/AppLayout";
import HorizonSplash from "./HorizonSplash";
import Stats from "./Stats";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import FAQ from "./FAQ";
import HorizonPrivacy  from "./HorizonPrivacy";

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

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/stats" element={<Stats />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/faq" element={<FAQ />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/privacy" element={<HorizonPrivacy />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/calendar" element={<RaidHelperEvents />} />
      </Route>
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import RaidHelperEvents from "./raidhelperevents";

import MainLayout from "./layout/MainLayout";
import AppLayout from "./layout/AppLayout";
import HorizonSplash from "./HorizonSplash";
import HorizonSplash2 from "./HorizonSplash2";
import HorizonSplash3 from "./HorizonSplash3";
import Stats from "./Stats";
// import Stats2 from "./Stats2";
// import Stats3 from "./Stats3";
// import Stats4 from "./Stats4";
import Stats5 from "./Stats5";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import FAQ from "./FAQ";
import HorizonPrivacy  from "./HorizonPrivacy";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/" element={<HorizonSplash3 />} />
      </Route>

      {/* <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/home2" element={<HorizonSplash2 />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/home3" element={<HorizonSplash3 />} />
      </Route> */}

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/features" element={<Features />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/stats" element={<Stats />} />
      </Route>

      {/* <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/stats2" element={<Stats2 />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/stats3" element={<Stats3 />} />
      </Route>

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/stats4" element={<Stats4 />} />
      </Route> */}

      <Route element={<MainLayout heroHeight="820px" />}>
        <Route path="/stats5" element={<Stats5 />} />
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

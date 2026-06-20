import { Routes, Route } from "react-router-dom";
import RaidHelperEvents from "./raidhelperevents";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RaidHelperEvents />} />
    </Routes>
  );
}
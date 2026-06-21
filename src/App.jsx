import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CyberLoader from "./components/CyberLoader";

const Home = lazy(() => import("./pages/Home"));
const Scan = lazy(() => import("./pages/Scan"));
const Coach = lazy(() => import("./pages/Coach"));
const Simulate = lazy(() => import("./pages/Simulate"));
const Activity = lazy(() => import("./pages/Activity"));
const Profile = lazy(() => import("./pages/Profile"));
const Vision = lazy(() => import("./pages/Vision"));
const League = lazy(() => import("./pages/League"));

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<CyberLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="activity" element={<Activity />} />
            <Route path="scan" element={<Scan />} />
            <Route path="coach" element={<Coach />} />
            <Route path="simulate" element={<Simulate />} />
            <Route path="profile" element={<Profile />} />
            <Route path="vision" element={<Vision />} />
            <Route path="league" element={<League />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;

import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import Coach from "./pages/Coach";
import Simulate from "./pages/Simulate";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import Vision from "./pages/Vision";
import League from "./pages/League";

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;

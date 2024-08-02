import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import Main from "./components/custom/Main";
import Register from "./components/custom/authentication/Register";
import Login from "./components/custom/authentication/Login";
import { Toaster } from "react-hot-toast";
import Home from "./components/custom/main/Home";
import Roadmaps from "./components/custom/main/Roadmaps";
import Leaderboards from "./components/custom/main/Leaderboards";
import AdminPanel from "./components/custom/admin/AdminPanel";
import AdminCourseCreate from "./components/custom/admin/AdminCourseCreate";
import Roadmap from "./components/custom/main/Roadmap";
import Study from "./components/custom/main/Study";
import Section from "./components/custom/main/Section";

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <div className="h-screen">
        <Routes>
          <Route path="/" element={<Main component={<Home />} />} />
          <Route path="/roadmaps" element={<Main component={<Roadmaps />} />} />
          <Route
            path="/roadmaps/:id"
            element={<Main component={<Roadmap />} />}
          />

          <Route path="/study/:id" element={<Main component={<Study />} />} />
          <Route
            path="/study/:roadmapId/:sectionId"
            element={<Main component={<Section />} />}
          />

          <Route
            path="/leaderboards"
            element={<Main component={<Leaderboards />} />}
          />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/admin" element={<Main component={<AdminPanel />} />} />
          <Route
            path="/admin/create"
            element={<Main component={<AdminCourseCreate />} />}
          />
        </Routes>
      <Toaster />
    </div>
  );
};

export default App;

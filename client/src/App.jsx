import React, { useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
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

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <div className="h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Main component={<Home />} />} />
          <Route path="/roadmaps" element={<Main component={<Roadmaps />} />} />
          <Route
            path="/roadmaps/:id"
            element={<Main component={<Roadmap />} />}
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
      </Router>
      <Toaster />
    </div>
  );
};

export default App;

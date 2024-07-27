import React, { useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Main from "./components/custom/Main";
import Register from "./components/custom/authentication/Register";
import Login from "./components/custom/authentication/Login";
import { Toaster } from "react-hot-toast";
import { useApolloClient } from "@apollo/client";
import Home from "./components/custom/main/Home";
import Roadmaps from "./components/custom/main/Roadmaps";
import Leaderboards from "./components/custom/main/Leaderboards";

const App = () => {
  const [token, setToken] = useState(null);


  return (
    <div className="h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Main component={<Home />} />} />
          <Route path="/roadmaps" element={<Main component={<Roadmaps />} />} />
          <Route path="/leaderboards" element={<Main component={<Leaderboards />} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
};

export default App;

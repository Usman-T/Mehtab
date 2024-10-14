import React, { useEffect } from "react";
import Header from "./navigation/Header";
import Sidebar from "./navigation/Sidebar";
import { ScrollArea } from "../ui/scroll-area";
import { useLocation } from "react-router-dom";

const Main = ({ component }) => {
  const location = useLocation();

  const isStudyPage = location.pathname.startsWith("/study") || location.pathname === '/' || location.pathname === '/community' || location.pathname === '/roadmaps' || location.pathname === '/assignments';

  return (
    <div
      className={`h-screen bg-secondary ${isStudyPage ? "bg-white" : "bg-secondary"}`}
    >
      <Header />

      <div className="flex h-full">
        <Sidebar className="hidden w-72 flex-col overflow-auto border-r bg-white lg:flex" />

        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full pt-16">
            <div className="mb-14">{component}</div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Main;

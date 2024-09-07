import React, { useEffect } from "react";
import Header from "./navigation/Header";
import Sidebar from "./navigation/Sidebar";
import { ScrollArea } from "../ui/scroll-area";
import { useLocation } from "react-router-dom";

const Main = ({ component }) => {
  const location = useLocation(); 

  const isStudyPage = location.pathname.startsWith("/study");

  return (
    <div className={`h-screen overflow-hidden bg-secondary ${isStudyPage ? "bg-white" : "bg-secondary"}`}>
      <Header />
      <div className="flex h-full w-full grid-cols-8">
        <Sidebar className="hidden h-full w-72 flex-col overflow-auto border-r bg-white lg:flex" />
        <ScrollArea className="max-h-full flex-1 overflow-y-hidden">
          <div className="mb-14 h-full">{component}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Main;

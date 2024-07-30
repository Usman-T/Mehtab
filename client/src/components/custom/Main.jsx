import { gql, useQuery } from "@apollo/client";
import React from "react";
import Header from "./navigation/Header";
import Sidebar from "./navigation/Sidebar";
import { ScrollArea } from "../ui/scroll-area";

const ME = gql`
  query {
    me {
      username
    }
  }
`;

const Main = ({ component }) => {
  const result = useQuery(ME);

  return (
    <div className="h-screen overflow-hidden bg-secondary">
      <Header />
      <div className="flex h-full w-full grid-cols-8">
        <Sidebar className="hidden h-full w-72 flex-col overflow-auto border-r bg-white lg:flex" />
        <ScrollArea className="flex-1 overflow-y-hidden max-h-full">
          <div className="h-full mb-14">{component}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Main;

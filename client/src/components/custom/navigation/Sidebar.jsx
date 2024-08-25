import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import {
  UserIcon,
  CompassIcon,
  HomeIcon,
  EllipsisVertical,
  LogOutIcon,
  CrownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { ME } from "@/queries";

const Sidebar = ({ className }) => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const { data } = useQuery(ME);

  const sidebarItems = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Roadmaps", path: "/roadmaps", icon: <CompassIcon /> },
    {
      name: "Leaderboards",
      path: "/leaderboards",
      icon: <UserIcon />,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    client.resetStore();
    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/onboarding");
    }, 1000);
  };

  const { pathname } = useLocation();
  const activeTab = sidebarItems.find((item) => item.path === pathname);
  const [active, setActive] = useState(activeTab ? activeTab.name : "");

  return (
    <div className={`${className} flex-between flex h-screen flex-col p-4`}>
      <div className="flex w-full flex-col space-y-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            item={item}
            key={item.name}
            active={active}
            setActive={setActive}
          />
        ))}

        {localStorage.getItem("mehtab-user-token") && (
          <>
            <Separator className="my-4" />
            <Button
              onClick={() => handleLogout()}
              className="flex items-center justify-start space-x-2 px-6"
              variant={"ghost"}
            >
              <LogOutIcon className="h-4 w-4" />
              <p>Logout</p>
            </Button>
          </>
        )}

        {localStorage.getItem("mehtab-user-token") &&
          data &&
          data?.me?.isAdmin === true && (
            <>
              <Button
                className={`flex items-center justify-start space-x-2 px-6`}
                onClick={() => navigate("/admin")}
                variant={"ghost"}
              >
                <CrownIcon className="h-4 w-4" />
                <p>Admin</p>
              </Button>
            </>
          )}
      </div>
      <footer className="mb-12 mt-auto flex w-full items-center justify-between border-t py-4">
        <div className="px-4 py-2 text-xs text-muted-foreground lg:flex-1">
          © 2024 Usman Tanveer.
        </div>
        <Button variant={"ghost"} className="h-12 w-12 text-muted-foreground">
          <EllipsisVertical />
        </Button>
      </footer>
    </div>
  );
};

export default Sidebar;

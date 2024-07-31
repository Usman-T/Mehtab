import { Button } from "@/components/ui/button";
import SidebarItem from "./SidebarItem";
import {
  UserIcon,
  CompassIcon,
  HomeIcon,
  EllipsisVertical,
  MenuIcon,
  LightbulbIcon,
  LogOutIcon,
  SearchIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useApolloClient } from "@apollo/client";

const MobileSidebar = () => {
  const client = useApolloClient();
  const sidebarItems = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Roadmaps", path: "/roadmaps", icon: <CompassIcon /> },
    {
      name: "Leaderboards",
      path: "/leaderboards",
      icon: <UserIcon />,
    },
  ];

  const navigate = useNavigate();

  const { pathname } = useLocation();
  const activeTab = sidebarItems.find((item) => item.path === pathname);
  const [active, setActive] = useState(activeTab ? activeTab.name : "");
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleSidebarItemClick = (itemName) => {
    setActive(itemName);
    setSheetOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    client.resetStore();
    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="block h-6 w-6 items-center hover:cursor-pointer lg:hidden">
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <MenuIcon
            className="hover:cursor-pointer"
            onClick={() => setSheetOpen(true)}
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex-between flex h-screen flex-col p-4"
        >
          <div className="flex items-center space-x-2 border-b px-2 py-4">
            <LightbulbIcon className="block h-6 w-6 text-secondary-foreground" />
            <span className="inline text-xl font-semibold text-secondary-foreground">
              Vertex
            </span>
          </div>
          <div className="flex w-full flex-col space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.name}
                item={item}
                active={active}
                setActive={handleSidebarItemClick}
              />
            ))}

            <Separator className="my-4" />
            {localStorage.getItem("vertex-user-token") ? (
              <>
                <Button
                  onClick={() => handleLogout()}
                  className="flex items-center justify-start space-x-2 px-6"
                  variant={"ghost"}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <p>Logout</p>
                </Button>
                <div className="ml-4 flex items-center rounded-md border">
                  <Input
                    type="text"
                    placeholder="Search for a course"
                    className="border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button type="submit" className="rounded-l-none">
                    <SearchIcon className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="flex items-center justify-start space-x-2 px-6"
                variant={"ghost"}
              >
                <LogOutIcon className="h-4 w-4" />
                <p>Login</p>
              </Button>
            )}
          </div>
          <SheetFooter className="mt-auto">
            <div className="flex w-full items-center justify-between border-t">
              <div className="px-4 py-2 text-xs text-muted-foreground lg:flex-1">
                © 2024 Usman Tanveer.
              </div>
              <Button
                variant="ghost"
                className="h-12 w-12 text-muted-foreground"
              >
                <EllipsisVertical />
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;

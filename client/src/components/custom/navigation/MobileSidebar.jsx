import { Button } from "@/components/ui/button";
import SidebarItem from "./SidebarItem";
import {
  UserIcon,
  CompassIcon,
  HomeIcon,
  EllipsisVertical,
  MenuIcon,
  MoonIcon,
  LogOutIcon,
  UsersIcon,
  BarChart2Icon,
  FileTextIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import {Separator} from "@/components/ui/separator"

const MobileSidebar = () => {
  const client = useApolloClient();

  const sidebarItems = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Roadmaps", path: "/roadmaps", icon: <CompassIcon /> },
    {
      name: "Assignments",
      path: "/assignments",
      icon: <FileTextIcon />,
    },
    {
      name: "Community",
      path: "/community",
      icon: <UsersIcon />,
    },
    {
      name: "Leaderboards",
      path: "/leaderboards",
      icon: <BarChart2Icon />,
    },
  ];
  const navigate = useNavigate();

  const { pathname } = useLocation();
  console.log(sidebarItems)
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
      navigate("/onboarding");
    }, 1000);
  };

  return (
    <div className="block h-6 w-6 items-center hover:cursor-pointer lg:hidden">
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <MenuIcon
            className="z-50 hover:cursor-pointer"
            onClick={() => setSheetOpen(true)}
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex-between flex h-screen flex-col p-4"
        >
          <SheetTitle></SheetTitle>
          <div className="flex items-center space-x-2 border-b px-2 py-4">
            <MoonIcon className="block h-6 w-6 text-secondary-foreground" />
            <span className="inline text-xl font-semibold text-secondary-foreground">
              Mehtab
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

            <Separator className='my-4' />

            {localStorage.getItem("mehtab-user-token") ? (
              <>
                <Button
                  onClick={() => handleLogout()}
                  className="flex items-center justify-start space-x-2 px-6"
                  variant={"ghost"}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <p>Logout</p>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-start space-x-2 px-6"
                  variant={"ghost"}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <p>Login</p>
                </Button>
              </>
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

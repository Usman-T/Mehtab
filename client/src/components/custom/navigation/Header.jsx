import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LightbulbIcon, LogOutIcon, MenuIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import MobileSidebar from "./MobileSidebar";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const loggedIn = localStorage.getItem("vertex-user-token") ? true : false;
  const navigate = useNavigate()
  return (
    <div className="flex h-16 w-screen items-center justify-between border-b bg-white px-4">
      <div className="flex items-center space-x-2">
        <LightbulbIcon className="hidden h-6 w-6 text-secondary-foreground md:block" />
        <MobileSidebar className="block h-6 w-6 hover:cursor-pointer md:hidden" />
        <span className="hidden text-xl font-semibold text-secondary-foreground md:inline">
          Vertex
        </span>
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2 rounded-md border">
        <Input
          type="text"
          placeholder="Search for a course"
          className="border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" className="rounded-l-none">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="hidden md:block">
        {loggedIn ? (
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <Button onClick={() => navigate('/login')}className="flex space-x-2" variant={"outline"}>
            <LogOutIcon className="h-4 w-4" />
            <p>Login</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoonIcon, LogOutIcon, MenuIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import MobileSidebar from "./MobileSidebar";
import { useNavigate } from "react-router-dom";
import { ME } from "@/queries";
import { useQuery } from "@apollo/client";
import Loading from "../extras/Loading";

const Header = () => {
  const loggedIn = localStorage.getItem("mehtab-user-token") ? true : false;
  const navigate = useNavigate();

  const { data, loading } = useQuery(ME);

  return (
    <div className="flex h-16 w-screen items-center justify-between border-b bg-white px-4">
      <div className="flex items-center space-x-2 hover:cursor-pointer">
        <MoonIcon
          onClick={() => navigate("/")}
          className="hidden h-6 w-6 text-secondary-foreground lg:block"
        />
        <MobileSidebar className="block h-6 w-6 hover:cursor-pointer lg:hidden" />
        <span className="hidden text-xl font-semibold text-secondary-foreground lg:inline">
          Mehtab
        </span>
      </div>
      <div className="hidden w-full max-w-sm items-center space-x-2 rounded-md border">
        <Input
          type="text"
          placeholder="Search for a course"
          className="border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" className="rounded-l-none">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>
      <div>
        {loggedIn ? (
          <Avatar>
            <AvatarFallback>{data?.me?.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            className="flex space-x-2"
            variant={"outline"}
          >
            <LogOutIcon className="h-4 w-4" />
            <p>Login</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const SidebarItem = ({ item, active, setActive }) => {
  const [effect, setEffect] = useState(false);

  const handleClick = () => {
    setActive(item.name);
    setEffect(true);
  };

  return (
    <Link to={item.path} className="">
      <Button
        variant={active === item.name ? "secondary" : "ghost"}
        onClick={handleClick}
        className={`flex-start flex w-full ${!(active === item.name) ? "text-muted-foreground hover:text-muted-foreground" : ""} `}
      >
        <div className="mr-auto flex items-center space-x-2">
          <div
            className={`${effect && "duration-400 animate-wiggle"}`}
            onAnimationEnd={() => setEffect(false)}
          >
            {item.icon}
          </div>
          <p>{item.name}</p>
        </div>
      </Button>
    </Link>
  );
};

export default SidebarItem;

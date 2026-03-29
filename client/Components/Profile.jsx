import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/context/globalContext";
import { Badge } from "./ui/badge";

function Profile() {
  const { userProfile, setToken, setUserProfile, setIsAuthenticated } =
    useGlobalContext();
  const navigate = useNavigate();

  const { profilePicture, name, profession, email } = userProfile;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUserProfile({});
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <div className="flex items-center gap-4">
        <Badge>{profession}</Badge>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <img
            src={profilePicture ? profilePicture : "/user.png"}
            alt="avatar"
            style={{ width: 36, height: 36 }}
            className="rounded-lg"
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;

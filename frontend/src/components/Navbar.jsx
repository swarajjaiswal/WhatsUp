import { useState } from "react";
import useUserAuth from "../hooks/useUserAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutFn } from "../lib/api";
import { BellIcon, LoaderPinwheel, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import ProfileView from "./ProfileView";

const Navbar = () => {
  const { authUser } = useUserAuth();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const [showProfile, setShowProfile] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return (
    <>
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end w-full">
            {isChatPage && (
              <div className="pl-5">
                <Link to="/" className="flex items-center gap-2.5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png"
                    alt="WhatsUp Logo"
                    style={{ height: "50px" }}
                  />

                  <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    WhatsUp
                  </span>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              <Link to="/notifications">
                <button className="btn btn-ghost btn-circle">
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
              </Link>
            </div>

            <ThemeSelector />

            {/* Avatar Click */}
            <div
              className="avatar cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              <div className="w-9 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>

            {/* Logout button */}
            <button
              className="btn btn-ghost btn-circle"
              onClick={logoutMutation}
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </nav>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative p-6 rounded-xl shadow-lg">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-28 right-3   p-2 transition cursor-pointer"
              aria-label="Close Profile Modal"
            >
              ✕
            </button>

            <ProfileView />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

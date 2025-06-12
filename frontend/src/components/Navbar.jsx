import { useState } from "react";
import useUserAuth from "../hooks/useUserAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutFn } from "../lib/api";
import { BellIcon, LogOutIcon } from "lucide-react";
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
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">

            {/* Logo (always shown on small devices, only on chat page for larger) */}
            <div className="flex items-center">
              {(isChatPage || window.innerWidth < 640) && (
                <Link to="/" className="flex items-center gap-2.5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png"
                    alt="WhatsUp Logo"
                    className="h-10 w-10"
                  />
                  <span className="hidden sm:inline text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
                    WhatsUp
                  </span>
                </Link>
              )}
            </div>

            {/* Right-side icons */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              {/* Notifications */}
              <Link to="/notifications">
                <button className="btn btn-ghost btn-circle">
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
              </Link>

              {/* Theme Selector */}
              <ThemeSelector />

              {/* Avatar */}
              <div
                className="avatar cursor-pointer"
                onClick={() => setShowProfile(true)}
              >
                <div className="w-9 rounded-full">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Logout */}
              <button
                className="btn btn-ghost btn-circle"
                onClick={logoutMutation}
              >
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative p-6 rounded-xl shadow-lg w-[90vw] max-w-md">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-14 right-4 text-xl cursor-pointer"
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

import { ShuffleIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useUserAuth from "../hooks/useUserAuth";
import { updateProfilePic } from "../lib/api";

const ProfileView = () => {
  const queryClient = useQueryClient();
  const { authUser } = useUserAuth();

  if (!authUser) return null;

  const handleRandomAvatar = async () => {
    const randomAvatar = `https://avatar.iran.liara.run/public/${Math.floor(
      Math.random() * 100 + 1
    )}.png`;

    try {
      // Update backend
      await updateProfilePic({ profilePic: randomAvatar });

      // Update cache in React Query
      queryClient.setQueryData(["authUser"], (oldData) => ({
        ...oldData,
        user: {
          ...oldData.user,
          profilePic: randomAvatar,
        },
      }));

      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 text-white text-center">
        <div className="flex flex-col items-center mb-6">
          <img
            src={authUser.profilePic || "/default-avatar.png"}
            alt={authUser.fullname || "User Avatar"}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white/30 shadow-md mb-4 hover:scale-105 transition-transform duration-300"
          />
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              onClick={handleRandomAvatar}
              className="btn btn-accent"
            >
              <ShuffleIcon className="size-4 mr-2" />
              Change Avatar
            </button> */}
            <button
              type="button"
              onClick={handleRandomAvatar}
              disabled={window.location.pathname.startsWith("/call/")}
              className={`btn btn-accent ${
                window.location.pathname.startsWith("/call/")
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ShuffleIcon className="size-4 mr-2" />
              Change Avatar
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mt-4">
            {authUser.fullname || "Unnamed User"}
          </h2>
          <p className="text-sm sm:text-base text-gray-300 break-words">
            {authUser.email || "No email available"}
          </p>
        </div>

        {/* User Info Section */}
        <div className="text-left bg-white/5 p-4 sm:p-6 rounded-xl w-full space-y-3 sm:space-y-4 text-sm sm:text-lg text-gray-100">
          <p>
            <span className="font-semibold text-white">Bio:</span>{" "}
            {authUser.bio || "No bio available"}
          </p>
          <p>
            <span className="font-semibold text-white">Location:</span>{" "}
            {authUser.location || "No location specified"}
          </p>
          <p>
            <span className="font-semibold text-white">Native Language:</span>{" "}
            {authUser.nativeLanguage || "Not specified"}
          </p>
          <p>
            <span className="font-semibold text-white">Learning Language:</span>{" "}
            {authUser.learningLanguage || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

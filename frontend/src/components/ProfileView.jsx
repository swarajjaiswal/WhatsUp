
import useUserAuth from "../hooks/useUserAuth";

const ProfileView = () => {
  const { authUser } = useUserAuth();

  if (!authUser) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 text-white text-center">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={authUser.profilePic || "/default-avatar.png"}
            alt={authUser.fullname || "User Avatar"}
            className="w-28 h-28 rounded-full object-cover border-4 border-white/30 shadow-md mb-4 hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-3xl font-bold">
            {authUser.fullname || "Unnamed User"}
          </h2>
          <p className="text-base text-gray-300">
            {authUser.email || "No email available"}
          </p>
        </div>

        {/* User Info Section */}
        <div className="text-left bg-white/5 p-6 rounded-xl w-full space-y-4 text-lg text-gray-100">
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

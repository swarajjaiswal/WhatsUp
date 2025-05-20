
import { useState } from "react";
import useUserAuth from "../hooks/useUserAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnBoarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LoaderPinwheel } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnBoardingPage = () => {
  const { isLoading, authUser } = useUserAuth();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate, isPending,error } = useMutation({
    mutationFn: completeOnBoarding,
    onSuccess: () => {
      toast.success("Onboarding completed successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formState);
  };
  const handleRandomAvatar = () => {
    const randomAvatar = `https://avatar.iran.liara.run/public/${Math.floor(
      Math.random() * 100 + 1
    )}.png`;
    setFormState((prev) => ({
      ...prev,
      profilePic: randomAvatar,
    }));
    toast.success("Random avatar generated");
  };

  return (
    <div className="min h-screen flex items-center justify-center bg-base-100 p-4">
      <div className=" card bg-base-200 shadow-xl w-full max-w-3xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Pic"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full ">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                className="input input-bordered w-full"
                placeholder="Your Full Name"
                value={formState.fullname}
                onChange={(e) => {
                  formState.fullname = e.target.value;
                  setFormState({ ...formState });
                }}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                type="text"
                name="bio"
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Tell us about yourself and your interests"
                value={formState.bio}
                onChange={(e) => {
                  formState.bio = e.target.value;
                  setFormState({ ...formState });
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    Select your native language
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    Select your learning language
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white size-5 opacity-70" />
                <input
                  type="text"
                  name="location"
                  className="input input-bordered w-full pl-10"
                  placeholder="Your Location"
                  value={formState.location}
                  onChange={(e) => {
                    formState.location = e.target.value;
                    setFormState({ ...formState });
                  }}
                />
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
           
            >
              {" "}
              {!isPending ? (
                <>
                  <LoaderPinwheel className="size-5 mr-2" /> Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Loading...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;

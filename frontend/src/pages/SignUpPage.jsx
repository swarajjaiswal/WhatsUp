import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderPinwheel } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupFn } from "../lib/api";
import { useThemeStore } from "../store/useThemeStore";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const { theme } = useThemeStore();

  const queryClient = useQueryClient();

  // useMutation is used instead of useQuery as useQuery is generally used for fetching data from backend while
  //useMutation is used for creating, updating or deleting data in backend.
  // In this case we are creating a new user in the backend so we will use useMutation.
  const {
    mutate: signUpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signupFn,
    onSuccess: () =>
      // This tells React Query:
      // “The data for the query key ["authUser"] might be stale — refetch it!”
      // This is useful because after a new user signs up, you likely want to update the app with their authenticated data.
      // Without this, the useQuery(["authUser"]) hook wouldn’t automatically know that the user has signed up and is now logged in.
      queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation(signupData);
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen p-4 sm:p-6 md:p-8"
      data-theme={theme}
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 shadow-lg rounded-xl overflow-hidden">
        {/* Left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
           <img className="h-10" src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png" alt="WhatsUp Logo"  />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              WhatsUp
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create an account</h2>
                <p className="text-sm opacity-70">
                  Join WhatsUp and connect globally
                </p>
              </div>

              <div className="space-y-3">
                {/* Full Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full"
                    value={signupData.fullname}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        fullname: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="johndoe@gmail.com"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-xs opacity-70">
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Terms Checkbox */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      required
                    />
                    <span className="text-xs leading-tight">
                      I agree to the{" "}
                      <span className="text-primary hover:underline">
                        terms of service
                      </span>{" "}
                      and{" "}
                      <span className="text-primary hover:underline">
                        privacy policy
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button className="btn btn-primary w-full" type="submit">
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-sm opacity-70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/videocall.gif" alt="app" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

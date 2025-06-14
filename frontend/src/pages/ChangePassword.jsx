import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePasswordFn } from "../lib/api";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const { mutate: changePasswordMutation, isPending } = useMutation({
    mutationFn: changePasswordFn,
    onMutate: () => {
      toast.loading("Changing password...", { id: "change-password" });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully", {
        id: "change-password",
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: "change-password",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token missing in URL");
      return;
    }
    changePasswordMutation({ password, token });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#1F222A] p-8 rounded-xl w-full max-w-md shadow-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
        <p className="text-sm text-gray-400 mb-6">Enter your new password.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 bg-[#2B2E3C] text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                placeholder="New Password"
              />
              <div
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary w-full transition text-white font-semibold rounded-md cursor-pointer"
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Changing
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordFn } from "../lib/api";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationFn: forgotPasswordFn,
    onMutate: () => {
      toast.loading("Sending reset link...", { id: "reset-link" });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent successfully", { id: "reset-link" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: "reset-link",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation({ email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#1F222A] p-8 rounded-xl w-full max-w-md shadow-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-400 mb-6">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#2B2E3C] text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary w-full transition text-white font-semibold rounded-md cursor-pointer"
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Sending
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

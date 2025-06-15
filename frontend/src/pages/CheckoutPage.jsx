import { Crown, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createOrderMutationFn, verifyPaymentMutationFn } from "../lib/api";
import toast from "react-hot-toast";
import useUserAuth from "../hooks/useUserAuth";

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { authUser } = useUserAuth();
  const { plan, billingCycle } = state || {};

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!plan) return navigate("/");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [plan, navigate]);

  const baseAmount =
    billingCycle === "monthly" ? plan?.monthlyPrice : plan?.annualPrice;
  const finalAmount = Math.round(baseAmount * 1.18 * 100); // paise

  const createOrderMutation = useMutation({ mutationFn: createOrderMutationFn });

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPaymentMutationFn,
    onSuccess: (data) => {
      if (data.success && authUser?._id) {
        const credits = plan.name === "Gold" ? 200 : plan.name === "Silver" ? 50 : 10;
        localStorage.setItem(`ai_credits_${authUser._id}`, credits.toString());
        localStorage.removeItem(`ai_last_reset_${authUser._id}`);
        toast.success("🎉 Payment successful!");
        navigate("/");
      } else {
        toast.error("❌ Payment verification failed.");
      }
    },
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const data = await createOrderMutation.mutateAsync({ plan, billingCycle });
      if (!data?.orderId) return toast.error("❌ Order creation failed.");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "WhatsUp",
        description: `${plan.name} Plan Subscription`,
        image: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png",
        order_id: data.orderId,
        handler: (response) => verifyPaymentMutation.mutate(response),
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#1E40AF" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error("❌ Order creation failed.");
    }
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-lg grid md:grid-cols-2 gap-8 p-8">
        {/* Form Section */}
        <div>
          <button
            onClick={() => navigate("/premium")}
            className="text-sm text-gray-400 hover:underline mb-4"
          >
            ← Back to plans
          </button>
          <h1 className="text-3xl font-bold mb-2">Complete Your Order</h1>
          <p className="text-gray-400 mb-6">
            You're just one step away from unlocking your AI assistant
          </p>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {["firstName", "lastName"].map((field) => (
      <div key={field}>
        <label className="block text-sm font-medium mb-1">
          {field === "firstName" ? "First Name" : "Last Name"}
        </label>
        <input
          type="text"
          name={field}
          value={form[field]}
          onChange={handleChange}
          placeholder={field === "firstName" ? "John" : "Doe"}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />
        {errors[field] && (
          <p className="text-red-400 text-xs">{errors[field]}</p>
        )}
      </div>
    ))}
  </div>

  {["email", "phone"].map((field) => (
    <div key={field}>
      <label className="block text-sm font-medium mb-1">
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </label>
      <input
        type={field === "email" ? "email" : "tel"}
        name={field}
        value={form[field]}
        onChange={handleChange}
        placeholder={
          field === "email" ? "john@example.com" : "+91 9876543210"
        }
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
      />
      {errors[field] && (
        <p className="text-red-400 text-xs">{errors[field]}</p>
      )}
    </div>
  ))}

  <button
    type="submit"
    disabled={createOrderMutation.isPending}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
  >
    {createOrderMutation.isPending
      ? "Creating Order..."
      : "Continue to Payment"}
  </button>
</form>

        </div>

        {/* Summary Section */}
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="border border-gray-600 rounded-lg p-4 mb-6 bg-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-yellow-400 text-2xl">
                {plan.name === "Silver" ? <Star size={28} /> :
                 plan.name === "Gold" ? <Crown size={28} /> : "👑"}
              </div>
              <div>
                <h3 className="font-bold text-white">{plan.name} Plan</h3>
                <p className="text-sm text-gray-400">Ultimate package for maximum results</p>
              </div>
            </div>

            <ul className="text-sm text-gray-300 space-y-1 ml-8 list-disc">
              {plan.name === "Silver" && (
                <>
                  <li>50 AI chat credits daily</li>
                  <li>Premium AI models (GPT-4)</li>
                  <li>Priority response time</li>
                  <li>Unlimited chat history</li>
                </>
              )}
              {plan.name === "Gold" && (
                <>
                  <li>200 AI chat credits daily</li>
                  <li>All premium AI models (GPT-4, Claude)</li>
                  <li>Instant response time</li>
                  <li>API access</li>
                </>
              )}
            </ul>
          </div>

          <div className="text-sm text-white space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{baseAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{(baseAmount * 0.18).toFixed(2)}</span>
            </div>
            <hr className="border-gray-600" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{(baseAmount * 1.18).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-400 space-y-1">
            <p>✔ 30-day money back guarantee</p>
            <p>✔ Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

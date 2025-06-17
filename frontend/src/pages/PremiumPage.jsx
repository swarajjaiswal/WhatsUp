import React, { useState } from "react";
import {
  Check,
  Star,
  MessageCircle,
  Crown,
  ArrowRight,
  Bot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PremiumPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started with AI chat",
      monthlyPrice: 0,
      annualPrice: 0,
      credits: 10,
      icon: MessageCircle,
      features: [
        "10 AI chat credits daily",
        "Basic AI models",
        "Standard response time",
        "Community support",
        "Chat history (7 days)",
      ],
      popular: false,
      buttonText: "Current Plan",
      buttonStyle:
        "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600",
    },
    {
      name: "Silver",
      description: "More conversations with better AI",
      monthlyPrice: 199,
      annualPrice: 1799,
      credits: 50,
      icon: Star,
      features: [
        "50 AI chat credits daily",
        "Premium AI models (GPT-4)",
        "Priority response time",
        "Unlimited chat history",
        "Custom AI personalities",
        "Advanced conversation modes",
      ],
      popular: true,
      buttonText: "Upgrade to Silver",
      buttonStyle:
        "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    },
    {
      name: "Gold",
      description: "Unlimited conversations with premium AI",
      monthlyPrice: 399,
      annualPrice: 3999,
      credits: 200,
      icon: Crown,
      features: [
        "200 AI chat credits daily",
        "All premium AI models (GPT-4, Claude)",
        "Instant response time",
        "Priority support",
        "Unlimited chat history",
        "Custom AI personalities",
        "Advanced conversation modes",
        "API access",
      ],
      popular: false,
      buttonText: "Upgrade to Gold",
      buttonStyle:
        "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white",
    },
  ];

  const testimonials = [
    {
      name: "Arjun Mehta",
      role: "AI Researcher",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content:
        "The premium features have transformed how I work with AI daily!",
    },
    {
      name: "Sanya Kapoor",
      role: "Content Strategist",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content:
        "Super responsive and accurate results. The Gold plan is totally worth it!",
    },
    {
      name: "Rahul Sen",
      role: "Developer",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      content:
        "Loving the advanced models and export features. Made my life so easy!",
    },
  ];

const handleSelectPlan = (plan) => {
  if (plan.name === "Free") return;

  const { icon, ...planData } = plan;
  navigate("/checkout", {
    state: {
      plan: {
        ...planData,
        price:
          billingCycle === "monthly"
            ? plan.monthlyPrice
            : plan.annualPrice,
        iconName: plan.name.toLowerCase(),
      },
      billingCycle,
    },
  });
};



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-75"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-full p-3">
                  <Bot className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
              Supercharge Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Conversations
              </span>
            </h1>

            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Get more daily credits, access premium AI models, and unlock
              advanced features to enhance your chat experience.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      billingCycle === "monthly"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-300 hover:text-blue-300"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      billingCycle === "annual"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-300 hover:text-blue-300"
                    }`}
                  >
                    Annual
                    <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 -mt-16 relative z-10">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;

            return (
              <div
                key={plan.name}
                className={`relative bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border ${
                  plan.popular ? "border-blue-500 scale-105" : "border-gray-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-xl ${
                        plan.name === "Gold"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : plan.popular
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gray-700"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          plan.popular || plan.name === "Gold"
                            ? "text-white"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                    {plan.popular && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 mb-3 text-sm">
                    {plan.description}
                  </p>

                  <div className="mb-3">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-white">
                        {price === 0 ? "Free" : `₹${price}`}
                      </span>

                      {price > 0 && (
                        <span className="text-gray-400 ml-2 text-sm">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className="text-blue-400 font-semibold">
                        {plan.credits} credits
                      </span>
                      <span className="text-gray-500 text-sm">/daily</span>
                    </div>
                    {billingCycle === "annual" && price > 0 && (
                      <p className="text-sm text-green-400 mt-1">
                        Save ₹{plan.monthlyPrice * 12 - plan.annualPrice}{" "}
                        annually
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${plan.buttonStyle} shadow-lg hover:shadow-xl text-sm cursor-pointer`}
                  >
                    {plan.buttonText}
                    {plan.name !== "Free" && (
                      <ArrowRight className="w-4 h-4 inline-block ml-2" />
                    )}
                  </button>

                  <div className="mt-4">
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      Features included:
                    </h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Loved by AI Enthusiasts
            </h2>
            <p className="text-lg text-gray-400">
              See what our users say about their premium experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic text-sm">
                  "{testimonial.content}"
                </p>
                <div className="flex mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;

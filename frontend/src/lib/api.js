import { axiosInstance } from "./axios";

export const signupFn = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};
export const loginFn = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const forgotPasswordFn = async ({ email }) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const changePasswordFn = async ({ password, token }) => {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};

export const logoutFn = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    return null;
  }
};

export const completeOnBoarding = async (userData) => {
  const res = await axiosInstance.post("/auth/onboarding", userData);
  return res.data;
};

export const getUserFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};
export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};
export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
};
export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
};
export const acceptFriendRequest = async (userId) => {
  const res = await axiosInstance.put(`/users/friend-request/${userId}/accept`);
  return res.data;
};
export const rejectFriendRequest = async (userId) => {
  const res = await axiosInstance.post(
    `/users/friend-request/${userId}/reject`
  );
  return res.data;
};

export async function getStreamToken() {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
}

export const updateProfilePic = async (profilePicData) => {
  const res = await axiosInstance.put("/users/profilepic", profilePicData);
  return res.data;
};

export const chatAiFn = async ({ userId, message }) => {
  const response = await axiosInstance.post("/nexa", { userId, message });
  return response.data;
};

export const unfriendUserFn = async (userId) => {
  const res = await axiosInstance.post(`/users/friends/${userId}/unfriend`);
  return res.data;
};

export const createOrderMutationFn = async ({ plan, billingCycle }) => {
  const baseAmount =
    billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  const finalAmount = Math.round(baseAmount * 1.18 * 100); // in paise

  try {
    const res = await axiosInstance.post("/razorpay/create-order", {
      amount: finalAmount / 100, // in rupees
    });

    return res.data;
  } catch (err) {
    console.error("Order creation failed:", err);
    throw new Error("Failed to create Razorpay order");
  }
};


export const verifyPaymentMutationFn = async (paymentData) => {
  const res = await axiosInstance.post("/razorpay/verify", paymentData);
  return res.data;
};

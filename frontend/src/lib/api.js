import { axiosInstance } from "./axios";

export const signupFn = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};
export const loginFn = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
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
}
export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
}
export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
}

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
}
export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
} 
export const acceptFriendRequest = async (userId) => {
  const res = await axiosInstance.put(`/users/friend-request/${userId}/accept`);
  return res.data;
}
export const rejectFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}/reject`);
  return res.data;
}

export async function getStreamToken(){
  const res = await axiosInstance.get("/chat/token");
  return res.data;
}

export const updateProfilePic=async(profilePicData)=>{
  const res = await axiosInstance.put("/users/profilepic", profilePicData);
  return res.data;
}
import express from "express";
import User from "../models/user.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //  not equal to curr user Exclude the current user
        { _id: { $nin: currentUser.friends } }, // not in curr user.frineds Exclude friends
        { isOnboarded: true }, // only include users who are on board
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommended users" });
  }
}
export async function getMyFriends(req, res) {
  try {
    const currentUserId = req.user._id;
    const user = await User.findById(currentUserId)
      .select("friends")
      .populate(
        "friends",
        "fullname location profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friends" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const friendId = req.params.id;
    if (currentUserId === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself." });
    }
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }
    if (friend.friends.includes(currentUserId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: friendId },
        { sender: friendId, recipient: currentUserId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friendRequest = await FriendRequest.create({
      sender: currentUserId,
      recipient: friendId,
    });
    await friendRequest.save();
    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending friend request" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const friendRequestId = req.params.id;

    const friendRequest = await FriendRequest.findById(friendRequestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (!friendRequest.recipient.equals(currentUserId)) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    console.log("Current User:", req.user._id);
    console.log(
      "Friend Request Recipient:",
      friendRequest.recipient.toString()
    );

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Error accepting friend request" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate(
      "sender",
      "fullname profilePic nativeLanguage learningLanguage"
    );

    const acceptedRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullname profilePic ");
    res.status(200).json({
      incomingRequests,
      acceptedRequests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend requests" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json(outgoingRequests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching outgoing friend requests" });
  }
}

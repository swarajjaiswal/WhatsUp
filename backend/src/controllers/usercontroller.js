import express from "express";
import User from "../models/user.js";
import FriendRequest from "../models/FriendRequest.js";
import transporter from "../mailer.js";
import dotenv from "dotenv";
dotenv.config();

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

    console.log("Sending request from", currentUserId, "to", friendId);

    const sender = await User.findById(currentUserId);
    const recipient = await User.findById(friendId);

    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendRequest = await FriendRequest.create({
      sender: currentUserId,
      recipient: friendId,
    });

    console.log("Success:", friendRequest);

    // Email Notification
    try {
      const friendRequestLink =
        process.env.NODE_ENV === "development"
          ? "http://localhost:5173"
          : "https://whatsup-d95h.onrender.com/notifications";

      await transporter.sendMail({
        from: `"WhatsUp Friend Requests" <${process.env.NODE_MAILER_USER}>`,
        to: recipient.email,
        subject: `${sender.fullname} wants to be your friend on WhatsUp!`,
        html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
      <img src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png" alt="WhatsUp Logo" style="height: 50px;" />
      <h1 style="color: #2e7d32;">WhatsUp</h1>
      <h2 style="color: #333;">Friend Request from <span style="color: #2e7d32;">${
        sender.fullname
      }</span></h2>
    </div>
    <div style="padding: 20px; color: #333;">
      <p>Hi <strong>${recipient.fullname}</strong>,</p>
      <p><strong>${sender.fullname}</strong> has sent you a friend request on <strong>WhatsUp</strong> 🎉</p>
      <p>Click the button below to view and respond to the request:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${friendRequestLink}" style="
          background-color: #2e7d32;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          display: inline-block;">
          View Friend Requests
        </a>
      </p>
      <p>If you didn’t expect this request, you can safely ignore this email.</p>
    </div>
    <div style="background-color: #f0f0f0; padding: 15px; font-size: 12px; text-align: center; border-top: 1px solid #ccc;">
      <p>&copy; ${new Date().getFullYear()} WhatsUp Inc. All rights reserved.</p>
      <p>
        <a href="#" onclick="return false;" style="color: #2e7d32; text-decoration: none;">Privacy Policy</a> |
        <a href="#" onclick="return false;" style="color: #2e7d32; text-decoration: none;">Support</a>
      </p>
    </div>
  </div>
        `,
      });

      console.log(`Friend request email sent to ${recipient.email}`);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (err) {
    console.error("Friend request error:", err);
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

export async function rejectFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const friendRequestId = req.params.id;

    const friendRequest = await FriendRequest.findById(friendRequestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (!friendRequest.recipient.equals(currentUserId)) {
      return res.status(403).json({
        message: "You are not authorized to reject this friend request",
      });
    }

    await FriendRequest.findByIdAndDelete(friendRequestId);
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting friend request" });
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

export async function updateProfilePic(req, res) {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture URL is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile picture" });
  }
}

export const unfriendUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.id;

    // Remove friendId from current user's friends
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId }
    });

    // Remove current user from friend's friends
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId }
    });

    res.status(200).json({ message: "Unfriended successfully" });
  } catch (error) {
    console.error("Unfriend error:", error);
    res.status(500).json({ message: "Server error during unfriending" });
  }
};

import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";
import transporter from "../mailer.js";

async function signupfn(req, res) {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const id = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${id}.png`;
    const newUser = new User({
      fullname,
      email,
      password,
      profilePic: randomAvatar,
    });
    await newUser.save();

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || "",
        email: newUser.email,
      });
      console.log(`Stream user successfully upserted for ${newUser.fullname}`);
    } catch (error) {
      console.error("Error upserting Stream user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png" alt="WhatsUp Logo" style="height: 50px;" />
          <h2 style="color: #333;">Welcome to <span style="color: #2e7d32;">WhatsUp</span>!</h2>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Hi <strong>${newUser.fullname}</strong>,</p>
          <p>Thanks for joining <strong>WhatsUp</strong>! We're thrilled to have you with us 🎉</p>
          <p>You can now chat with friends,learn new languages, and enjoy an engaging messaging experience.</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Cheers,<br />The WhatsUp Team</p>
        </div>
        <div style="background-color: #f0f0f0; padding: 15px; font-size: 12px; text-align: center; border-top: 1px solid #ccc;">
          <p>&copy; 2025 WhatsUp Inc. All rights reserved.</p>
          <p>
        <a href="#" onclick="return false;" style="color: #2e7d32; text-decoration: none;">Privacy Policy</a> |
<a href="#" onclick="return false;" style="color: #2e7d32; text-decoration: none;">Support</a>

          </p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"WhatsUp Support" <${process.env.NODE_MAILER_USER}>`,
        to: newUser.email,
        subject: "Welcome to WhatsUp!",
        html: emailBody,
      });
      console.log(`Welcome email sent to ${newUser.email}`);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginfn(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutfn(req, res) {
  // console.log(req.cookies.token);
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullname, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullname ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullname && "fullname",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        isOnboarded: true,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user successfully upserted for ${updatedUser.fullname}`
      );
    } catch (error) {
      console.error("Error upserting Stream user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res
      .status(200)
      .json({ message: "Onboarding successful", user: updatedUser });
  } catch (error) {
    console.error("Error during onboarding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function forgotPasswordFn(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  const resetPath = `/reset-password/${resetToken}`;
  const resetUrl = `${req.protocol}://${req.get("host")}${resetPath}`;

  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png" alt="WhatsUp Logo" style="height: 50px;" />
        <h2 style="color: #333;">Reset Your <span style="color: #2e7d32;">WhatsUp</span> Password</h2>
      </div>
      <div style="padding: 20px; color: #333;">
        <p>Hi <strong>${user.fullname}</strong>,</p>
        <p>You requested a password reset for your WhatsUp account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align:center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color:#2e7d32; color:#fff; padding:10px 20px; border-radius:4px; text-decoration:none;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="word-break:break-word; color:#555;">${resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn’t request this, just ignore this email.</p>
        <p>– The WhatsUp Team</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; font-size: 12px; text-align: center; border-top: 1px solid #ccc;">
        <p>&copy; 2025 WhatsUp Inc. All rights reserved.</p>
        <p>
          <a href="#" onclick="return false;" style="color: #2e7d32; text-decoration: none;">Privacy Policy</a> |
          <a href="#" onclick="return false;" style="color: #2e7d32; text-decoration: none;">Support</a>
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"WhatsUp Support" <${process.env.NODE_MAILER_USER}>`,
    to: email,
    subject: "Reset Your WhatsUp Password",
    html: emailBody,
  });

  res.status(200).json({ message: "Password reset link sent" });
}

async function resetPasswordFn(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    return res
      .status(400)
      .json({ message: "New password must be different from the old one" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
}

export {
  signupfn,
  loginfn,
  logoutfn,
  onboard,
  forgotPasswordFn,
  resetPasswordFn,
};

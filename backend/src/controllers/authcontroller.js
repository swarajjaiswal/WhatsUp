import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
import transporter from "../mailer.js"

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

    try {
      await transporter.sendMail({
        from: `"WhatsUp Support" <${process.env.NODE_MAILER_USER}>`,
        to: newUser.email,
        subject: "Welcome to WhatsUp!",
        html: `<h3>Hi ${newUser.fullname},</h3>
               <p>Welcome to WhatsUp! We're excited to have you on board 🎉</p>
               <p>Start chatting with your friends right away!</p>
               <br>
               <p>– The WhatsUp Team</p>`,
      });
      console.log(`Welcome email sent to ${newUser.email}`);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Optional: continue without failing signup
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

export { signupfn, loginfn, logoutfn, onboard };

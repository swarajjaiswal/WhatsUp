import express from "express";
import {
  signupfn,
  loginfn,
  logoutfn,
  onboard,
  forgotPasswordFn,
  resetPasswordFn,
} from "../controllers/authcontroller.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupfn);

router.post("/login", loginfn);

router.post("/logout", logoutfn);

router.post("/onboarding", protectRoute, onboard);

router.post("/forgot-password", forgotPasswordFn);

router.post("/reset-password/:token", resetPasswordFn);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;

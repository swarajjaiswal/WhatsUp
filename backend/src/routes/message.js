import express from "express";
import { askNexaFn } from "../controllers/messagecontroller.js";

const router = express.Router();

router.post("/", askNexaFn);

export default router;

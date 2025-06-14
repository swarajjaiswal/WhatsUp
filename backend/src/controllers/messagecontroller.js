import { askNexa } from "../lib/askNexa.js"; 
import User from "../models/user.js";
import Message from "../models/messageModel.js";

export async function askNexaFn(req, res) {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const reply = await askNexa(message, user.fullname);

    await Message.create({
      sender: userId,
      receiver: null,
      content: message,
      isFromUser: true,
    });

    await Message.create({
      sender: null,
      receiver: userId,
      content: reply,
      isFromUser: false,
    });

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

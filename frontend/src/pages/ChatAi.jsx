import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatAiFn } from "../lib/api";
import useUserAuth from "../hooks/useUserAuth";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ChatAi = () => {
  const { authUser } = useUserAuth();
  const bottomRef = useRef(null);

  const messagesKey = `chat_ai_messages_${authUser?._id}`;
  const creditsKey = `ai_credits_${authUser?._id}`;
  const resetKey = `ai_last_reset_${authUser?._id}`;

  const [credits, setCredits] = useState(10);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { mutate: chatAiMutation, isPending } = useMutation({
    mutationFn: chatAiFn,
    onSuccess: (data) => {
      const replyText = data?.reply || "Sorry, I didn't understand that.";
      const newMessage = { from: "nexa", text: replyText };
      setMessages((prev) => {
        const updated = [...prev, newMessage];
        localStorage.setItem(messagesKey, JSON.stringify(updated));
        return updated;
      });
    },
    onError: () => {
      const errorMessage = {
        from: "nexa",
        text: "Sorry, something went wrong.",
      };
      setMessages((prev) => {
        const updated = [...prev, errorMessage];
        localStorage.setItem(messagesKey, JSON.stringify(updated));
        return updated;
      });
    },
  });

  const handleSend = () => {
    if (!input.trim() || !authUser?._id || credits <= 0) return;

    const question = input.trim();
    const newCredits = credits - 1;

    const newMessage = { from: "user", text: question };
    setMessages((prev) => {
      const updated = [...prev, newMessage];
      localStorage.setItem(messagesKey, JSON.stringify(updated));
      return updated;
    });

    setCredits(newCredits);
    localStorage.setItem(creditsKey, newCredits.toString());

    if (newCredits === 0) {
      localStorage.setItem(resetKey, new Date().toISOString());
    }

    setInput("");
    chatAiMutation({ userId: authUser._id, message: question });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!authUser?._id) return;

    // Load messages
    const storedMessages = localStorage.getItem(messagesKey);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      const defaultMsg = [
        {
          from: "nexa",
          text: "Hey! This is Nexa. How may I help you today?",
        },
      ];
      setMessages(defaultMsg);
      localStorage.setItem(messagesKey, JSON.stringify(defaultMsg));
    }

    // Load/reset credits
    const storedCredits = localStorage.getItem(creditsKey);
    const lastReset = localStorage.getItem(resetKey);
    const now = new Date();

    if (storedCredits && parseInt(storedCredits, 10) === 0 && lastReset) {
      const last = new Date(lastReset);
      const isNewDay =
        last.getDate() !== now.getDate() ||
        last.getMonth() !== now.getMonth() ||
        last.getFullYear() !== now.getFullYear();

      if (isNewDay) {
        localStorage.setItem(creditsKey, "10");
        setCredits(10);
        localStorage.removeItem(resetKey);
      } else {
        setCredits(0);
      }
    } else {
      setCredits(storedCredits ? parseInt(storedCredits, 10) : 10);
    }
  }, [authUser?._id]);

  return (
    <div className="flex flex-col bg-black text-white h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="p-4 bg-white text-black flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </Link>
          <img
            src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/78e88f76-29bf-4289-9624-719aec0f7bcb/e516f677-4846-4a28-9707-ba00ffa49479.png"
            alt="Nexa"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-lg font-semibold">Nexa</h2>
        </div>
        <div className="text-sm font-medium">Credits: {credits}</div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-zinc-900 px-4 py-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-end gap-2 max-w-xs">
              {msg.from === "nexa" && (
                <img
                  src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/78e88f76-29bf-4289-9624-719aec0f7bcb/e516f677-4846-4a28-9707-ba00ffa49479.png"
                  alt="Nexa"
                  className="w-7 h-7 rounded-full"
                />
              )}
              <div
                className={`px-3 py-2 rounded-lg text-sm ${
                  msg.from === "user"
                    ? "bg-blue-200 text-black"
                    : "bg-zinc-800 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isPending && (
          <div className="text-gray-400 text-sm ml-2">Nexa is typing...</div>
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* Credits Message */}
      {credits <= 0 && (
        <div className="text-center text-sm mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-900 to-black text-purple-200 shadow-md">
          <p className="mb-1">🚫 You’ve used all free messages for today.</p>
          <p>
            Come back tomorrow or{" "}
            <span
              className="text-purple-400 hover:text-purple-300 underline cursor-pointer font-semibold transition"
              onClick={() => (window.location.href = "/premium")}
            >
              upgrade to premium
            </span>
            .
          </p>
        </div>
      )}

      {/* Input Section */}
      <div className="p-4 bg-gray-100 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message"
          className="flex-1 px-4 py-2 rounded-full text-black focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className={`px-4 py-2 rounded-full ${
            credits <= 0
              ? "bg-black text-purple-200 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatAi;

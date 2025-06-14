import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatAiFn } from "../lib/api";
import useUserAuth from "../hooks/useUserAuth";

const ChatAi = () => {
  const { authUser } = useUserAuth();
  const bottomRef = useRef(null);

  const [credits, setCredits] = useState(() => {
    const stored = localStorage.getItem("ai_credits");
    return stored ? parseInt(stored, 10) : 10;
  });

  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("chat_ai_messages");
    return stored ? JSON.parse(stored) : [
      {
        from: "nexa",
        text: "Hey! This is Nexa. How may I help you today?",
      },
    ];
  });

  const [input, setInput] = useState("");

  const { mutate: chatAiMutation, isPending } = useMutation({
    mutationFn: chatAiFn,
    onSuccess: (data) => {
      const replyText = data?.reply
        ? data.reply
        : "Sorry, I didn't understand that.";

      const newMessage = { from: "nexa", text: replyText };
      setMessages((prev) => {
        const updated = [...prev, newMessage];
        localStorage.setItem("chat_ai_messages", JSON.stringify(updated));
        return updated;
      });
    },
    onError: () => {
      const errorMessage = { from: "nexa", text: "Sorry, something went wrong." };
      setMessages((prev) => {
        const updated = [...prev, errorMessage];
        localStorage.setItem("chat_ai_messages", JSON.stringify(updated));
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
      localStorage.setItem("chat_ai_messages", JSON.stringify(updated));
      return updated;
    });

    setCredits(newCredits);
    localStorage.setItem("ai_credits", newCredits.toString());
    setInput("");

    chatAiMutation({ userId: authUser._id, message: question });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col bg-black text-white h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="p-4 bg-white text-black flex items-center justify-between shadow">
        {/* Nexa on left */}
        <div className="flex items-center gap-3">
          <img
            src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/78e88f76-29bf-4289-9624-719aec0f7bcb/e516f677-4846-4a28-9707-ba00ffa49479.png"
            alt="Nexa"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-lg font-semibold">Nexa</h2>
        </div>

        {/* Credits on right */}
        <div className="text-sm font-medium">Credits: {credits}</div>
      </div>

      {/* Chat messages */}
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

      {/* Input */}
      <div className="p-4 bg-gray-100 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message"
          className="flex-1 px-4 py-2 rounded-full text-black focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={credits <= 0}
        />
        <button
          onClick={handleSend}
          className={`px-4 py-2 rounded-full ${
            credits <= 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-black text-white"
          }`}
          disabled={credits <= 0}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatAi;

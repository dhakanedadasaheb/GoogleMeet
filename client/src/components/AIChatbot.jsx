import { Bot, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your AI meeting assistant. Ask me anything about your meeting.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Temporary frontend response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "AI response will appear here after connecting the Spring Boot backend.",
        },
      ]);
    }, 500);

    setInput("");
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-slate-900 text-white">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-700 p-4">
        <div className="rounded-lg bg-purple-600 p-2">
          <Sparkles size={20} />
        </div>

        <div>
          <h2 className="font-semibold">AI Meeting Assistant</h2>
          <p className="text-xs text-slate-400">
            Ask anything about your meeting
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user"
                ? "flex-row-reverse"
                : "flex-row"
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700">
              {message.role === "user" ? (
                <User size={16} />
              ) : (
                <Bot size={16} />
              )}
            </div>

            <div
              className={`max-w-[80%] rounded-xl p-3 text-sm ${
                message.role === "user"
                  ? "bg-blue-600"
                  : "bg-slate-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex gap-2 rounded-lg bg-slate-800 p-2">

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
            placeholder="Ask about this meeting..."
            className="flex-1 bg-transparent px-2 text-sm outline-none"
          />

          <button
            onClick={handleSend}
            className="rounded-lg bg-blue-600 p-2 hover:bg-blue-700"
          >
            <Send size={18} />
          </button>

        </div>
      </div>

    </div>
  );
};

export default AIChatbot;
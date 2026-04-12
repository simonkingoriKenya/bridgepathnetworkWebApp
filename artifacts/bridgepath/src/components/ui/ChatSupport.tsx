import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

type Message = { from: "bot" | "user"; text: string };

const WELCOME_MSGS: Message[] = [
  { from: "bot", text: "👋 Hi there! I'm the BridgePath support assistant. How can I help you today?" },
];

const QUICK_OPTIONS = [
  "How do I post a job?",
  "How does AI CV Review work?",
  "Which countries do you operate in?",
  "How do I apply for a job?",
];

const AUTO_REPLIES: Record<string, string> = {
  "How do I post a job?": "To post a job, sign up as an employer, go to your dashboard, and click 'Post a Job'. It's free and takes under 5 minutes!",
  "How does AI CV Review work?": "Upload your CV in the 'AI CV Review' section. Our AI analyzes it in seconds and gives you a detailed score, strengths, improvements, and recommended roles.",
  "Which countries do you operate in?": "BridgePath is launching platform access in Ghana and Kenya first, while our HR advisory experience supports organizations planning wider African expansion.",
  "How do I apply for a job?": "Create a free account, browse jobs, and click 'Apply Now'. Your application is tracked in your dashboard.",
};

export function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(WELCOME_MSGS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = (text: string) => {
    const userMsg: Message = { from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = AUTO_REPLIES[text] || "Thanks for reaching out! Our team typically responds within a few hours. You can also email us at info@bridgepath.africa.";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setTyping(false);
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input.trim());
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            style={{ backgroundColor: "#fff" }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: DARK }}>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: GREEN }}>
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">BridgePath Support</p>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.from === "user"
                        ? { backgroundColor: GREEN, color: "white", borderBottomRightRadius: 4 }
                        : { backgroundColor: "white", color: "#374151", border: "1px solid #e5e7eb", borderBottomLeftRadius: 4 }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl bg-white border border-gray-100 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-gray-400"
                        style={{ animation: `bounce 1s infinite ${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="px-3 pb-2 flex flex-wrap gap-2 bg-gray-50">
                {QUICK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => sendMessage(opt)}
                    className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
                style={{ backgroundColor: GREEN }}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all"
        style={{ backgroundColor: DARK }}
        aria-label="Chat support"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle className="h-6 w-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: GREEN }}>
            1
          </span>
        )}
      </motion.button>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}

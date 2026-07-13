"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher-client";
import { sendMessage } from "@/app/actions/chat";

type Message = {
  id: string;
  projectId: string;
  sender: string;
  content: string;
  createdAt: string | Date | null;
};

export function ProjectChat({
  projectId,
  initialMessages,
  currentRole, // "AGENCY" or "CLIENT"
}: {
  projectId: string;
  initialMessages: Message[];
  currentRole: "AGENCY" | "CLIENT";
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on load or new message
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Subscribe to pusher channel
    const channel = pusherClient.subscribe(`project-${projectId}`);

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => {
        // Prevent duplicates if we already added it locally
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      pusherClient.unsubscribe(`project-${projectId}`);
    };
  }, [projectId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const content = newMessage;
    setNewMessage("");

    try {
      const savedMsg = await sendMessage(projectId, currentRole, content);
      if (savedMsg) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === savedMsg.id)) return prev;
          return [...prev, savedMsg];
        });
      }
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-900">Project Chat</h3>
        <p className="text-xs text-slate-500">
          Communicate directly with your{" "}
          {currentRole === "AGENCY" ? "client" : "agency"}.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400 italic">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === currentRole;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {msg.sender}
                  </span>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${isMe ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm"}`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors"
          />
          <Button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-auto py-2"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

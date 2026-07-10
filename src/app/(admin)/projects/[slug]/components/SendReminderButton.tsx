"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Check, Loader2 } from "lucide-react";
import { sendReminderAction } from "@/app/actions/project";

export function SendReminderButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      await sendReminderAction(slug);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Failed to send reminder", err);
      alert("Failed to send reminder email. Make sure the client has an email address set up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSend}
      disabled={loading || sent}
      className={`h-10 font-medium transition-all ${
        sent ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : sent ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <Send className="w-4 h-4 mr-2" />
      )}
      {sent ? "Reminder Sent" : "Send Reminder"}
    </Button>
  );
}

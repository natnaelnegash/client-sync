"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { verifyPortalPin } from "@/app/actions/portal";

export function PinGate({
  projectSlug,
  agencyName,
}: {
  projectSlug: string;
  agencyName: string;
}) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) {
      const newPin = [...pin];
      newPin[index] = "";
      setPin(newPin);
      return;
    }

    // Handle paste of multiple characters
    if (value.length > 1) {
      const chars = value.split("").slice(0, 4);
      const newPin = ["", "", "", ""];
      chars.forEach((char, i) => {
        newPin[i] = char;
      });
      setPin(newPin);
      if (chars.length < 4) {
        inputRefs.current[chars.length]?.focus();
      } else {
        inputRefs.current[3]?.focus();
      }
      return;
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-advance
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullPin = pin.join("");
    if (fullPin.length < 4) return;

    try {
      setLoading(true);
      setError("");
      await verifyPortalPin(projectSlug, fullPin);
      window.location.reload(); // Reload to let server component read the cookie
    } catch (err: any) {
      setError("Incorrect PIN. Please try again.");
      setPin(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Secure Client Portal</h1>
        <p className="text-slate-500 text-sm mb-8">
          Enter the 4-digit PIN provided by {agencyName} to access your project workspace.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors ${
                  error ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              />
            ))}
          </div>

          {error && <p className="text-sm font-bold text-red-500">{error}</p>}

          <Button 
            type="submit" 
            disabled={loading || pin.join("").length < 4}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-base shadow-sm transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Access Portal <ArrowRight className="w-4 h-4 ml-2" /></>}
          </Button>
        </form>
      </div>
    </div>
  );
}

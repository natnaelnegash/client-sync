"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/p/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <Button 
      onClick={handleCopy}
      variant="outline" 
      className="h-10 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 w-[160px]"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2 text-emerald-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy Magic Link
        </>
      )}
    </Button>
  );
}

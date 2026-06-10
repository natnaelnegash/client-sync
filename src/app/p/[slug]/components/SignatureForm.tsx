"use client";

import { signProject } from "@/app/actions/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function SignatureForm({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async (data) => {
        setLoading(true);
        await signProject(slug, data);
        setLoading(false);
      }}
      className="mt-6 space-y-4 bg-white p-6 rounded-xl border shadow-sm border-neutral-200"
    >
      <div className="space-y-2">
        <Label htmlFor="clientSignature">
          Type your full name to linearly agree to the terms above
        </Label>
        <Input
          id="clientSignature"
          name="clientSignature"
          placeholder="John Doe"
          required
          className="text-lg py-6"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full text-md font-medium"
        disabled={loading}
      >
        {loading ? "Signing securely..." : "Sign & Accept Scope"}
      </Button>
    </form>
  );
}

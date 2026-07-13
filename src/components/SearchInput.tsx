"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect, useCallback } from "react";

export function SearchInput({
  placeholder = "Search...",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") || "";
  const [value, setValue] = useState(currentQuery);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      // only replace if query changed
      if (currentQuery !== value) {
        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`);
        });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [value, searchParams, pathname, router, currentQuery]);

  return (
    <div className="relative w-full max-w-xs shrink-0 flex justify-center items-center">
      <Search className="w-4 h-4 absolute left-3 -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-10 bg-white border-slate-200 focus-visible:ring-indigo-600 rounded-lg text-sm w-full shadow-sm"
      />
    </div>
  );
}

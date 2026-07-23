import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitBranch, LayoutDashboard } from "lucide-react";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans bg-slate-50">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden md:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
        {/* Background gradient/glow effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/50 to-slate-900 opacity-80" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              ClientSync OS
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-auto pt-24 pb-12">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-6">
             <LayoutDashboard className="w-8 h-8" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-medium leading-snug mb-6 text-slate-100">
            An open-source operating system designed to eliminate client friction.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Provision workspaces, generate scopes with AI, and manage deliverables—all from a single, centralized dashboard.
          </p>
        </div>

        <div className="relative z-10 flex gap-12 mt-auto pt-8 border-t border-slate-800">
          <div>
            <p className="text-3xl font-bold text-white">100%</p>
            <p className="text-slate-400 text-sm mt-1">Open Source</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">Next.js</p>
            <p className="text-slate-400 text-sm mt-1">App Router</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">Gemini</p>
            <p className="text-slate-400 text-sm mt-1">AI Integrated</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white relative">
        <div className="absolute top-8 right-8">
          <a href="https://github.com/natnaelnegash/client-sync" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> View Source
          </a>
        </div>

        <div className="w-full max-w-md space-y-10">
          <div className="text-center md:text-left">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center md:hidden mb-6 mx-auto">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Welcome back
            </h1>
            <p className="text-slate-500 text-lg">Sign in to access your workspace.</p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
            className="pt-4"
          >
            <Button
              type="submit"
              className="h-14 w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-base rounded-xl shadow-lg shadow-slate-200 transition-all"
            >
              <GitBranch className="w-5 h-5 mr-3" />
              Continue with GitHub
            </Button>
          </form>

          <div className="text-center md:text-left">
            <p className="text-sm text-slate-500 mt-8 leading-relaxed">
              By signing in, you agree to the open-source MIT license of this repository. Access requires a valid GitHub account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

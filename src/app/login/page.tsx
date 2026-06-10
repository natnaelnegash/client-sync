import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, Eye } from "lucide-react";

import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans bg-slate-50">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden md:flex flex-col justify-between bg-indigo-600 text-white p-12 relative overflow-hidden">
        {/* Background gradient/glow effect if needed */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-50" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              ClientSync OS
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-auto pt-24 pb-12">
          <h2 className="text-3xl lg:text-4xl font-medium leading-snug mb-8">
            "We onboarded 14 new clients last quarter and not one asked a
            question about the process. That's the power of a great client
            experience."
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-300 rounded-full flex items-center justify-center overflow-hidden">
              <span className="text-indigo-700 font-bold">JO</span>
              {/* Actual Avatar goes here */}
            </div>
            <div>
              <p className="font-bold text-white">James O'Brien</p>
              <p className="text-indigo-200 text-sm">
                Creative Director, Volta Agency
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-12 mt-auto pt-8 border-t border-indigo-400/30">
          <div>
            <p className="text-3xl font-bold">2,400+</p>
            <p className="text-indigo-200 text-sm">Agencies</p>
          </div>
          <div>
            <p className="text-3xl font-bold">$12M+</p>
            <p className="text-indigo-200 text-sm">Invoiced</p>
          </div>
          <div>
            <p className="text-3xl font-bold">99.9%</p>
            <p className="text-indigo-200 text-sm">Uptime</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500">Sign in to your workspace</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12 w-full text-slate-700 font-medium border-slate-200 hover:bg-slate-50"
            >
              {/* Google SVG Icon */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/dashboard" });
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="h-12 w-full text-slate-700 font-medium border-slate-200 hover:bg-slate-50"
              >
                <GitBranch className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-400">
                or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@agency.com"
                className="h-12 border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base rounded-lg"
            >
              Sign in to workspace
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

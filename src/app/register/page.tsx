"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, Check, ArrowRight } from "lucide-react";
import { signInWithGithub } from "@/app/actions/auth";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-4">
      <div className="w-full max-w-[480px] bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            ClientSync OS
          </span>
        </Link>

        <div className="text-center mb-8 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Create your workspace
          </h1>
          <p className="text-slate-500 text-sm">
            14-day free trial · No credit card required
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center w-full mb-8 max-w-xs">
          {/* Step 1 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 relative ${step > 1 ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"}`}
          >
            {step > 1 ? <Check className="w-4 h-4" strokeWidth={3} /> : "1"}
          </div>
          <div
            className={`flex-1 h-px -mx-1 ${step > 1 ? "bg-emerald-500" : "bg-slate-200"}`}
          />

          {/* Step 2 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 relative ${step > 2 ? "bg-emerald-500 text-white" : step === 2 ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-400"}`}
          >
            {step > 2 ? <Check className="w-4 h-4" strokeWidth={3} /> : "2"}
          </div>
          <div
            className={`flex-1 h-px -mx-1 ${step > 2 ? "bg-emerald-500" : "bg-slate-200"}`}
          />

          {/* Step 3 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 relative ${step === 3 ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-400"}`}
          >
            {step === 3 ? <Check className="w-4 h-4" strokeWidth={3} /> : "3"}
          </div>
        </div>

        {/* Step 1 Content */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <Button
                variant="outline"
                className="h-12 w-full text-slate-700 font-medium border-slate-200 hover:bg-slate-50"
                onClick={() => setStep(2)}
              >
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
              <form action={signInWithGithub} className="w-full">
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

            <div className="relative w-full mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider font-medium">
                <span className="bg-white px-4 text-slate-400">
                  or with email
                </span>
              </div>
            </div>

            <form
              className="space-y-5 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Your name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Johnson"
                  className="h-12 border-slate-200 focus-visible:ring-indigo-600 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Work email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@agency.com"
                  className="h-12 border-slate-200 focus-visible:ring-indigo-600 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  className="h-12 border-slate-200 focus-visible:ring-indigo-600 bg-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base rounded-lg mt-2"
              >
                Continue
              </Button>
            </form>
          </>
        )}

        {/* Step 2 Content */}
        {step === 2 && (
          <form
            className="w-full space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="agency" className="text-slate-700 font-medium">
                Agency / Studio name
              </Label>
              <Input
                id="agency"
                type="text"
                placeholder="Northlight Studio"
                className="h-12 border-slate-200 focus-visible:ring-indigo-600 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize" className="text-slate-700 font-medium">
                Team size
              </Label>
              <select
                id="teamSize"
                className="w-full h-12 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-sm text-slate-700"
              >
                <option value="just_me">Just me</option>
                <option value="2_5">2 - 5</option>
                <option value="6_10">6 - 10</option>
                <option value="11_plus">11+</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 font-medium">
                How do you work with clients?
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Web Design",
                  "Branding",
                  "Development",
                  "Copywriting",
                  "Video / Photo",
                  "Consulting",
                ].map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-1/3 h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base rounded-lg"
              >
                Create workspace
              </Button>
            </div>
          </form>
        )}

        {/* Step 3 Content */}
        {step === 3 && (
          <div className="w-full flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-emerald-500" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Workspace ready!
            </h2>
            <p className="text-slate-500 text-center mb-8">
              Your 14-day free trial has started.
            </p>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base rounded-lg">
                Enter workspace <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {step < 3 && (
          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

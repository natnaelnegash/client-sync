import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-4">
      
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">ClientSync OS</span>
      </Link>

      <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
          <Mail className="w-6 h-6 text-indigo-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset your password</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form className="space-y-6 w-full">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@agency.com" 
              className="h-12 border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50" 
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base rounded-lg">
            Send reset link
          </Button>
        </form>
      </div>

      <div className="mt-8">
        <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>

    </div>
  );
}

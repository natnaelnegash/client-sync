import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  PlayCircle,
  FileText,
  Send,
  CheckCircle2,
  Menu,
  Wand2,
  LayoutTemplate,
  Lock,
  Layers,
  GitBranchPlus,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              ClientSync OS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              href="#features"
              className="hover:text-indigo-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-indigo-600 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#workspace"
              className="hover:text-indigo-600 transition-colors"
            >
              The Workspace
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign in
            </Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
          <button className="md:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center pt-16 pb-24">
          <a
            href="https://github.com/natnaelnegash/client-sync"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge
              variant="secondary"
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-full px-4 py-1.5 mb-8 border border-indigo-200 transition-colors cursor-pointer"
            >
              <GitBranchPlus className="w-4 h-4 mr-2 inline" /> Open Source &
              Free on GitHub <ArrowRight className="w-3 h-3 ml-2 inline" />
            </Badge>
          </a>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            The open-source operating system for{" "}
            <br className="hidden md:block" />
            <span className="text-indigo-600">agencies & freelancers.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            ClientSync OS gives you a complete engine to provision projects,
            enhance scopes with AI, and collaborate with clients via
            passwordless magic links.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 text-base w-full sm:w-auto shadow-lg shadow-indigo-200"
              >
                Start your workspace <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href="https://github.com/natnaelnegash/client-sync"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-14 text-base border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
              >
                <GitBranchPlus className="w-5 h-5 mr-2" /> View Source
              </Button>
            </a>
          </div>

          {/* Hero Image / Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200/50 bg-white shadow-2xl p-2 sm:p-4 rotate-0 sm:-rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-100 aspect-video relative flex items-center justify-center">
              <img
                src="/Dashboard.png"
                alt="ClientSync OS Dashboard"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 to-transparent" />

              <div
                className="absolute top-8 left-8 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-slate-100 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <Wand2 className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-slate-700">
                  Scope Enhanced
                </span>
              </div>
              <div
                className="absolute bottom-8 right-8 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-slate-100 animate-bounce"
                style={{ animationDuration: "4s", animationDelay: "1s" }}
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">
                  File uploaded!
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-slate-200/50 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase mb-6">
              Built specifically for modern freelancers, boutique agencies, and
              indie developers
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
              <div className="font-semibold text-lg flex items-center gap-2">
                <span className="text-black">Next.js</span> App Router
              </div>
              <div className="font-semibold text-lg flex items-center gap-2">
                <span className="text-blue-500">PostgreSQL</span>
              </div>
              <div className="font-semibold text-lg flex items-center gap-2">
                Drizzle <span className="text-lime-500">ORM</span>
              </div>
              <div className="font-semibold text-lg text-lime-700 flex items-center gap-2">
                Chapa Gateway
              </div>
              <div className="font-semibold text-lg flex items-center gap-2">
                <span className="text-blue-600">Docker</span>
              </div>
              <div className="font-semibold text-lg flex items-center gap-2">
                <span className="text-sky-500">Tailwind</span> CSS
              </div>
              <div className="font-semibold text-lg flex items-center gap-2">
                Google <span className="text-purple-500">Gemini</span>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section
          id="how-it-works"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">
              How it works
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">
              Provision projects in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <LayoutTemplate className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Select a Template</h3>
              <p className="text-slate-500 leading-relaxed">
                Choose from predefined templates like 'Corporate Website' or
                'Branding'. The Workspace Engine automatically deep-copies
                milestones and deliverables.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                <Wand2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Enhancement</h3>
              <p className="text-slate-500 leading-relaxed">
                Provide a rough project name or brief, and let the integrated
                Gemini AI expand it into a professional, comprehensive Scope of
                Work.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Magic Link Portal</h3>
              <p className="text-slate-500 leading-relaxed">
                Clients receive a passwordless magic link to their secure portal
                where they can chat, upload assets, and track progress.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50"
        >
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">
              Core Infrastructure
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              A platform built for scale
            </p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Everything you need to manage the client lifecycle, from initial
              agreement to final delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <LayoutTemplate className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Workspace Provisioning
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  A relational templating engine that clones complex milestone
                  and deliverable hierarchies instantly into live execution
                  environments.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                <Wand2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Scope Generation</h3>
                <p className="text-slate-500 leading-relaxed">
                  Integrated directly with Gemini AI to transform simple project
                  briefs into highly detailed, client-ready proposals.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Passwordless Authentication
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Zero friction for your clients. Secure, PIN-protected magic
                  links ensure they can access their portal without managing
                  passwords.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Nested Workflows</h3>
                <p className="text-slate-500 leading-relaxed">
                  Track progress at the macro and micro level with deeply nested
                  relational tracking (Project → Milestone → Deliverable →
                  Task).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* UI Showcase instead of Testimonials */}
        <section
          id="workspace"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">
              Inside the Workspace
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">
              A premium experience for you and your clients
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-4 sm:p-8 shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-left text-white space-y-6 max-w-lg">
                <h3 className="text-2xl font-bold">Centralized Dashboard</h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  Get a bird's eye view of all active projects, pending
                  deliverables, and recent client activity. The minimalist
                  interface ensures you focus on what matters most—doing great
                  work.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span className="text-slate-200">
                      Real-time status updates
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span className="text-slate-200">Client action center</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span className="text-slate-200">
                      Integrated communications
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800 aspect-square lg:aspect-[4/3] shadow-2xl">
                {/* Decorative UI Mockup replacing actual image if it's missing, but we'll try to use thumbnail */}
                <img
                  src="/Dashboard.png"
                  alt="Workspace UI"
                  className="absolute inset-0 w-full h-full object-cover object-left-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-24">
          <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-indigo-500" />
            <div className="relative z-10">
              <GitBranchPlus className="w-12 h-12 mx-auto text-indigo-200 mb-6" />
              <h2 className="text-4xl font-bold mb-4">
                Start deploying your OS today.
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                Fork the repository, clone it locally, or sign in to the live
                demo to experience the workflow.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-slate-50 rounded-full px-8 h-14 text-base"
                  >
                    View Live Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="font-bold text-lg tracking-tight">
                ClientSync OS
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">
              An open-source client management platform built for modern
              agencies.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="#features" className="hover:text-indigo-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-indigo-600">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Open Source</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a
                  href="https://github.com/natnaelnegash/client-sync"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/natnaelnegash/client-sync/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} ClientSync OS. Open Source.
          </p>
        </div>
      </footer>
    </div>
  );
}

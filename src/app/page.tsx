import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  PlayCircle,
  FileText,
  Send,
  CheckCircle2,
  Users,
  CreditCard,
  Briefcase,
  PenTool,
  CheckCircle,
  Clock,
  Menu,
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
            <span className="font-bold text-xl tracking-tight">ClientSync OS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Sign in</Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
                Start for free
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
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-full px-4 py-1.5 mb-8 border border-indigo-200">
            New: Stripe Integration Available <ArrowRight className="w-3 h-3 ml-2 inline" />
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Client onboarding that <br className="hidden md:block" />
            <span className="text-indigo-600">doesn't embarrass you.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            ClientSync OS gives agencies and freelancers a complete operating system to collect assets, signatures, and get paid. One link, zero chaos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/login">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 text-base w-full sm:w-auto">
                Start free - no credit card <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto">
              <PlayCircle className="w-5 h-5 mr-2 text-slate-500" /> See how it works
            </Button>
          </div>
          <p className="text-sm text-slate-500 mb-16">
            No credit card required • 14 day free trial
          </p>

          {/* Hero Image / Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200/50 bg-white shadow-2xl p-2 sm:p-4 rotate-0 sm:-rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-100 aspect-video relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-white opacity-50" />
              <div className="text-slate-400 font-medium">Dashboard Mockup (Client view)</div>
              
              <div className="absolute top-8 left-8 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-slate-100 animate-bounce" style={{animationDuration: '3s'}}>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-slate-700">Scope Signed</span>
              </div>
              <div className="absolute bottom-8 right-8 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-slate-100 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">File uploaded!</span>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-slate-200/50 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase mb-8">
              Trusted by forward-thinking teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
              <div className="font-bold text-xl">Acme Corp</div>
              <div className="font-bold text-xl">GlobalTech</div>
              <div className="font-bold text-xl">Nexus</div>
              <div className="font-bold text-xl">Stark Ind</div>
              <div className="font-bold text-xl">Umbrella</div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">How it works</h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">Three steps from signed to paid</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Create Your Portal</h3>
              <p className="text-slate-500 leading-relaxed">
                Define scope, deliverables, and payment terms in one place. Generate a beautiful, white-labeled client portal in seconds.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <Send className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Send a Magic Link</h3>
              <p className="text-slate-500 leading-relaxed">
                Share a secure, passwordless magic link. Your client clicks, reviews the agreement, and signs it seamlessly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Collect & Deliver</h3>
              <p className="text-slate-500 leading-relaxed">
                Clients easily upload necessary files. Deliver your work through the same portal and get paid effortlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">Features</h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything in one platform</p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Stop piecing together six different tools just to manage client relationships and collect what you need to start working.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: PenTool, title: "Custom Proposals", desc: "Write beautiful SOWs in a clean, notion-like editor." },
              { icon: CheckCircle, title: "Legal Signatures", desc: "Legally binding electronic signatures included automatically." },
              { icon: FileText, title: "Asset Collection", desc: "Drag-and-drop file requests with automatic client reminders." },
              { icon: Briefcase, title: "Project Tracking", desc: "Keep clients in the loop with a clear visual timeline of milestones." },
              { icon: Users, title: "Client CRM", desc: "A centralized directory for all your client contacts and history." },
              { icon: CreditCard, title: "Invoicing & Pay", desc: "Integrated invoicing so you can deliver files and get paid in one click." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">Testimonials</h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">Agencies that made the switch</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { text: "ClientSync OS replaced our messy mix of Google Docs, email threads, and Dropbox links. It's incredibly professional.", author: "Sarah Jenkins", role: "Founder, Studio Nova" },
              { text: "The magic link onboarding flow is a game changer. My clients constantly compliment how easy it is to work with us.", author: "Marcus Chen", role: "Freelance Developer" },
              { text: "I was losing days chasing down brand assets. Now it's all automated and I can actually focus on designing.", author: "Elena Rodriguez", role: "Creative Director" },
              { text: "Simple, beautiful, and does exactly what it promises. It makes my agency look 10x larger than we actually are.", author: "David Kim", role: "Managing Partner, Elevate" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(star => <span key={star} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-slate-700 font-medium text-lg mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{t.author}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">Pricing</h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, predictable pricing</p>
            <p className="text-lg text-slate-500">Pay once, use forever. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Solo */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg mb-2">Solo</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for solo freelancers just starting out.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$29</span><span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Up to 5 projects</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Basic onboarding</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> File uploads</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Standard support</li>
              </ul>
              <Button variant="outline" className="w-full rounded-full h-12">Start free trial</Button>
            </div>

            {/* Pro */}
            <div className="bg-indigo-600 p-8 rounded-3xl border border-indigo-500 shadow-xl text-white flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-200 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="font-bold text-lg mb-2">Pro / Agency</h3>
              <p className="text-indigo-200 text-sm mb-6">For growing agencies that need to impress.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$69</span><span className="text-indigo-200">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-indigo-50">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" /> Unlimited projects</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" /> Custom branding</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" /> Client CRM</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" /> Stripe integration</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" /> Priority support</li>
              </ul>
              <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50 rounded-full h-12">Get started free</Button>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">For large teams needing advanced control.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$159</span><span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Everything in Pro</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Custom domain</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Team roles</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> White-label emails</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Dedicated account rep</li>
              </ul>
              <Button variant="outline" className="w-full rounded-full h-12">Talk to sales</Button>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-24">
          <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-indigo-500" />
            <div className="relative z-10">
              <Clock className="w-12 h-12 mx-auto text-indigo-200 mb-6" />
              <h2 className="text-4xl font-bold mb-4">Stop losing hours to client chaos.</h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                Join 1,000+ agencies who use ClientSync OS to impress clients, win back time, and get paid faster.
              </p>
              <Link href="/login">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-50 rounded-full px-8 h-14 text-base">
                  Get started free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="font-bold text-lg tracking-tight">ClientSync OS</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">
              The complete client management OS for modern agencies and freelancers.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="#features" className="hover:text-indigo-600">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-indigo-600">Pricing</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-indigo-600">About</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Blog</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2026 ClientSync OS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-400 text-sm">All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

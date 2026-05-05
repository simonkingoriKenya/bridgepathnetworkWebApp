import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { blogPosts } from "@/pages/blog/index";
import { DEMO_JOBSEEKER, DEMO_EMPLOYER } from "@/lib/demoAuth";
import {
  Users, FileText, Briefcase, Globe, Award, BarChart3,
  UserCheck, Calculator, ChevronDown, ChevronUp,
  TrendingUp, ShieldCheck, Star, CheckCircle2, ArrowRight, Clock,
  Code2, Landmark, Headphones, Crown, Search, Sparkles,
  Building2, MapPin, Zap, Target, Loader2
} from "lucide-react";
import heroImage from "@assets/Hero_1778003129768.png";
import credibilityImage from "@assets/unnamed_(6)_1776009115712.jpg";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

const focusAreas = [
  { icon: <Code2 className="h-6 w-6" />, label: "Technology" },
  { icon: <Landmark className="h-6 w-6" />, label: "Finance" },
  { icon: <Briefcase className="h-6 w-6" />, label: "HR & Operations" },
  { icon: <Headphones className="h-6 w-6" />, label: "Customer Success" },
  { icon: <Crown className="h-6 w-6" />, label: "Leadership" },
];

const whyPartner = [
  { icon: <TrendingUp className="h-7 w-7" />, title: "Global HR Leadership", desc: "Guidance shaped by senior hiring experience across African and international markets." },
  { icon: <ShieldCheck className="h-7 w-7" />, title: "15+ Years Experience", desc: "Built on practical workforce, recruitment, compliance, and people operations expertise." },
  { icon: <Users className="h-7 w-7" />, title: "Multi-Industry Reach", desc: "Supporting hiring across technology, finance, HR, operations, customer success, and leadership." },
  { icon: <Star className="h-7 w-7" />, title: "Diaspora + Local Talent", desc: "Connecting employers with returning diaspora professionals and strong local talent pools." },
];

const africaStats = [
  { value: "700M+", label: "Working-age Africans by 2030", context: "The world's fastest-growing labour force, driving global demand for African talent." },
  { value: "60%", label: "of Africa is under 25", context: "A youthful, tech-savvy workforce ready to power the next generation of business." },
  { value: "$3T+", label: "Africa's combined GDP by 2030", context: "A continent-sized opportunity that forward-looking companies are already capitalising on." },
  { value: "11M", label: "New professionals annually", context: "Africa adds more young workers to the global economy than any other region each year." },
  { value: "54", label: "Countries, one talent pool", context: "With the right HR partner, pan-African hiring is no longer complex — it's your advantage." },
  { value: "2", label: "Launch markets: Ghana & Kenya", context: "Starting carefully with two strong markets before growing into a broader African network." },
];

const platformStats = [
  { value: "Ghana", label: "Launch Market" },
  { value: "Kenya", label: "Launch Market" },
  { value: "2026", label: "MVP Launch" },
  { value: "Early", label: "Access Open" },
  { value: "15+", label: "Yrs Experience" },
];

const jobSeekerSteps = [
  { icon: <FileText className="h-5 w-5" />, step: "1", title: "Create Your Profile", desc: "Sign up and build a professional profile that showcases your skills, experience, and career goals." },
  { icon: <Search className="h-5 w-5" />, step: "2", title: "Discover Opportunities", desc: "Browse vetted roles across Ghana and Kenya, or remote positions open to African talent." },
  { icon: <Sparkles className="h-5 w-5" />, step: "3", title: "Get AI CV Review", desc: "Use our AI-powered CV tool to sharpen your application and stand out to top employers." },
  { icon: <Target className="h-5 w-5" />, step: "4", title: "Apply & Advance", desc: "Apply with confidence. Track your applications and grow your career with BridgePath." },
];

const employerSteps = [
  { icon: <Building2 className="h-5 w-5" />, step: "1", title: "Create an Employer Account", desc: "Sign up as an employer to access Africa's most qualified diaspora and local professionals." },
  { icon: <Zap className="h-5 w-5" />, step: "2", title: "Post Your Role", desc: "Describe the position, required experience, and location. We'll surface the right candidates fast." },
  { icon: <Users className="h-5 w-5" />, step: "3", title: "Browse & Shortlist", desc: "Review pre-screened candidate profiles, assess CVs, and build your shortlist in one place." },
  { icon: <CheckCircle2 className="h-5 w-5" />, step: "4", title: "Hire with Confidence", desc: "Engage talent directly or let our HR team manage the full hiring and onboarding process." },
];

const newsArticles = blogPosts.slice(0, 4).map((p) => ({
  slug: p.slug,
  tag: p.tag,
  title: p.title,
  excerpt: p.excerpt,
  date: p.date,
  image: p.image,
}));

const faqs = [
  { q: "What does Bridgepath Network do?", a: "Bridgepath Network is a Human Resources Management Solutions and Executive Recruitment company headquartered in Accra, Ghana. With over 15 years of experience, we connect African talent with quality employers and provide comprehensive outsourced HR services across Africa." },
  { q: "Who is BridgePath for?", a: "BridgePath serves two groups: professionals (diaspora and local talent) looking for quality careers in Ghana and Kenya, and employers seeking to hire verified African talent — locally or remotely." },
  { q: "What services does Bridgepath Network offer beyond recruitment?", a: "We offer Employment of Record, HR Consultancy, Payroll & Tax Administration, Psychometric Assessments, Staff Outsourcing, Interim Management, and Secondment Services." },
  { q: "Which countries is Bridgepath Network launching in?", a: "We are launching platform access in Ghana and Kenya first, with a clear roadmap to expand across Africa as the network grows." },
  { q: "How does the AI CV Review work?", a: "Our AI CV Review tool analyses your CV against current hiring standards and provides structured feedback to improve your chances of getting shortlisted. Available to all registered professionals." },
  { q: "How can I get in touch with Bridgepath Network?", a: "You can reach us via email at info@bridgepathnetwork.com or by submitting an enquiry through the contact form below. Our headquarters is in Accra, Ghana." },
];

export default function Home() {
  const { toast } = useToast();
  const { signInWithPassword } = useAuth();
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", company: "", email: "", phone: "", type: "Hiring talent", message: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleTryDemo = async () => {
    setDemoLoading(true);
    const result = await signInWithPassword(DEMO_JOBSEEKER.email, DEMO_JOBSEEKER.password);
    setDemoLoading(false);
    if (!result.error) {
      setLocation("/onboarding/jobseeker");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) {
      toast({ variant: "destructive", title: "Name and email are required" });
      return;
    }
    setContactSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setContactSubmitting(false);
    toast({ title: "Request received", description: "Our team will get back to you within 24 hours." });
    setContactForm({ name: "", company: "", email: "", phone: "", type: "Hiring talent", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white premium-grid-bg">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[640px] max-h-[900px] flex items-end overflow-hidden">
        {/* Full-bleed image — let it breathe */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="African professionals collaborating in a modern boardroom"
            className="w-full h-full object-cover object-center"
          />
          {/* Very light vignette — image is the star */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,18,40,0.82) 0%, rgba(10,18,40,0.35) 45%, rgba(10,18,40,0.08) 100%)" }} />
          {/* Subtle left edge fade for text legibility */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,18,40,0.55) 0%, transparent 55%)" }} />
        </div>

        {/* Text anchored to bottom-left — SaaS premium layout */}
        <div className="relative z-10 w-full pb-12 md:pb-16">
          <div className="container mx-auto px-6 md:px-10">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm" style={{ backgroundColor: "rgba(140,198,63,0.18)", border: "1px solid rgba(140,198,63,0.35)" }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }} />
                <span className="text-xs font-semibold tracking-wide" style={{ color: GREEN }}>Early access open · Ghana &amp; Kenya</span>
              </div>

              {/* Headline — confident, concise */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4">
                Africa's talent.<br />
                <span style={{ color: GREEN }}>Placed with purpose.</span>
              </h1>

              <p className="text-white/70 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
                The premium careers and hiring platform connecting Africa's brightest professionals with ambitious employers — starting in Ghana and Kenya.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/jobs">
                  <button className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
                    <Search className="h-4 w-4" />
                    Find Opportunities
                  </button>
                </Link>
                <Link href="/employers">
                  <button className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-[1.03] active:scale-[0.98]">
                    <Building2 className="h-4 w-4" />
                    Hire Talent
                  </button>
                </Link>
                <button
                  onClick={handleTryDemo}
                  disabled={demoLoading}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "rgba(140,198,63,0.15)", color: GREEN }}
                >
                  {demoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Try Demo
                </button>
              </div>

              {/* Minimal trust line */}
              <div className="flex items-center gap-5 mt-8">
                <div className="h-px flex-1 max-w-[60px] bg-white/20" />
                {[
                  { v: "Ghana", l: "Launch" },
                  { v: "Kenya", l: "Launch" },
                  { v: "15+yrs", l: "Experience" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-white leading-none">{s.v}</div>
                      <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider">{s.l}</div>
                    </div>
                    {i < 2 && <div className="h-6 w-px bg-white/15" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DUAL USER JOURNEY ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 py-20 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>Two paths. One platform.</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: DARK }}>
              How BridgePath <span style={{ color: GREEN }}>works for you</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Whether you're growing your career or building a team, BridgePath is built for your journey.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            {/* Job Seeker Journey */}
            <div className="rounded-3xl border-2 overflow-hidden" style={{ borderColor: GREEN + "40" }}>
              <div className="px-7 py-5 flex items-center gap-3" style={{ backgroundColor: GREEN + "12" }}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: GREEN }}>
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GREEN }}>For Professionals</p>
                  <h3 className="font-bold text-lg" style={{ color: DARK }}>Build Your Career in Africa</h3>
                </div>
              </div>
              <div className="px-7 py-6 space-y-5">
                {jobSeekerSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ backgroundColor: GREEN }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: DARK }}>{s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-7 py-5 border-t border-gray-100">
                <Link href="/auth/signup">
                  <button className="w-full py-3 font-bold text-white rounded-xl text-sm transition-all hover:opacity-90" style={{ backgroundColor: GREEN }}>
                    Create Your Profile — It's Free
                  </button>
                </Link>
                <Link href="/jobs">
                  <p className="text-center text-xs mt-2 font-medium hover:underline" style={{ color: GREEN }}>
                    Browse open roles →
                  </p>
                </Link>
              </div>
            </div>

            {/* Employer Journey */}
            <div className="rounded-3xl border-2 overflow-hidden" style={{ borderColor: DARK + "25" }}>
              <div className="px-7 py-5 flex items-center gap-3" style={{ backgroundColor: DARK + "08" }}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: DARK }}>
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">For Employers</p>
                  <h3 className="font-bold text-lg" style={{ color: DARK }}>Hire Africa's Best Talent</h3>
                </div>
              </div>
              <div className="px-7 py-6 space-y-5">
                {employerSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ backgroundColor: DARK }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: DARK }}>{s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-7 py-5 border-t border-gray-100">
                <Link href="/auth/signup?role=employer">
                  <button className="w-full py-3 font-bold text-white rounded-xl text-sm transition-all hover:opacity-90" style={{ backgroundColor: DARK }}>
                    Create an Employer Account
                  </button>
                </Link>
                <Link href="/services">
                  <p className="text-center text-xs mt-2 font-medium text-gray-500 hover:text-gray-800 hover:underline">
                    Explore HR services →
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOCUS AREAS ── */}
      <section className="py-20 bg-gray-50 premium-grid-bg border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>Where we hire</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: DARK }}>
              Focus areas for <span style={{ color: GREEN }}>high-quality hiring</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">BridgePath focuses on roles and talent communities where Africa's next wave of growth is already happening.</p>
          </div>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {focusAreas.map((s, i) => (
              <motion.div
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="relative rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden"
              >
                <div className="flex flex-col items-center justify-between text-center p-7 min-h-44 group h-full hover:bg-white transition-all">
                  <div className="absolute inset-x-8 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />
                  <div className="h-14 w-14 rounded-2xl border flex items-center justify-center mb-4 transition-all group-hover:scale-110" style={{ borderColor: GREEN + "55", color: GREEN, background: `linear-gradient(135deg, ${GREEN}14, white)` }}>
                    {s.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors">{s.label}</p>
                  <span className="mt-3 h-1 w-8 rounded-full opacity-30 group-hover:opacity-100 group-hover:w-12 transition-all" style={{ backgroundColor: GREEN }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link href="/jobs">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all hover:text-white hover:shadow-md"
                style={{ borderColor: GREEN, color: GREEN }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = GREEN; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = GREEN; }}
              >
                Browse open roles <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY BRIDGEPATH ── */}
      <section className="bg-white premium-grid-bg border-b border-gray-100">
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-12 border-b border-gray-100 text-center">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>Why BridgePath</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: DARK }}>
              Built on <span style={{ color: GREEN }}>Real Hiring Experience</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-3 text-sm">
              BridgePath combines global HR leadership, 15+ years of African workforce experience, and a deep understanding of what great hiring looks like.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {whyPartner.map((w, i) => (
              <div
                key={w.title}
                className="p-8 md:p-10 text-center"
                style={{ borderRight: i < whyPartner.length - 1 ? "1px solid #e5e7eb" : "none" }}
              >
                <div className="h-14 w-14 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: GREEN + "15", color: GREEN }}>
                  {w.icon}
                </div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: DARK }}>{w.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGIONAL PRESENCE ── */}
      <section className="py-20" style={{ backgroundColor: "#1e2f1a", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-6xl mx-auto">
            <div className="flex-1 w-full">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>Where we operate</span>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mt-3 mb-6 text-white">
                Launching in Ghana<br />and <span style={{ color: GREEN }}>Kenya</span>
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed text-base md:text-lg max-w-xl">
                BridgePath is launching with a clear focus on Ghana and Kenya — two of Africa's fastest-growing talent markets — before expanding to a broader pan-African network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <button className="px-6 py-3 font-semibold text-white rounded-lg transition-all hover:opacity-90" style={{ backgroundColor: GREEN }}>
                    Join early access
                  </button>
                </Link>
                <Link href="/about">
                  <button className="px-6 py-3 font-semibold text-white rounded-lg border border-white/30 hover:bg-white/10 transition-colors">
                    Learn our story →
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[4/3]">
                <img
                  src={credibilityImage}
                  alt="African women professionals collaborating in a bright modern office"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AFRICA OPPORTUNITY STATS ── */}
      <section className="bg-white premium-grid-bg border-b border-gray-100">
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-12 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>The Africa Opportunity</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: DARK }}>
                  Why Africa is the world's<br />
                  <span style={{ color: GREEN }}>next talent frontier</span>
                </h2>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                The numbers tell a story of unstoppable growth. BridgePath positions you at the centre of it.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {africaStats.map((stat, i) => (
              <div
                key={stat.label}
                className="p-8 md:p-10 group hover:bg-gray-50/60 transition-colors"
                style={{
                  borderRight: (i + 1) % 3 !== 0 ? "1px solid #e5e7eb" : "none",
                  borderBottom: i < 3 ? "1px solid #e5e7eb" : "none",
                }}
              >
                <div className="text-4xl font-bold mb-1" style={{ color: GREEN }}>{stat.value}</div>
                <div className="text-sm font-semibold mb-2" style={{ color: DARK }}>{stat.label}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{stat.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM STATS BAR ── */}
      <section style={{ backgroundColor: "#3a5a36", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="grid grid-cols-2 md:grid-cols-5" style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid rgba(255,255,255,0.08)", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          {platformStats.map((s, i) => (
            <div
              key={`stat-${i}-${s.label}`}
              className="py-14 text-center"
              style={{ borderRight: i < platformStats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white">{s.value}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-gray-300 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="bg-gray-50 border-b border-gray-100">
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-12 border-b border-gray-100 text-center">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>Get in touch</span>
            <h2 className="text-3xl font-bold mt-2" style={{ color: DARK }}>Start building with BridgePath</h2>
            <p className="text-gray-500 mt-2 text-sm">Tell us whether you want to find opportunities or hire top talent — we'll get back within 24 hours.</p>
          </div>
          <div className="px-8 md:px-10 py-12">
            <div className="max-w-2xl mx-auto">
              <form className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                    <input className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Your full name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Company Name <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Your company" value={contactForm.company} onChange={e => setContactForm({ ...contactForm, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
                    <input type="email" className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="you@example.com" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="tel" className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="+233 …" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">I am looking to…</label>
                    <select className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300" value={contactForm.type} onChange={e => setContactForm({ ...contactForm, type: e.target.value })}>
                      <option>Hire talent</option>
                      <option>Find a job or career opportunity</option>
                      <option>Outsource HR / payroll</option>
                      <option>Explore a partnership</option>
                      <option>Get more information</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Message <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" rows={4} placeholder="Tell us a bit more about what you need…" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} />
                </div>
                <button type="submit" disabled={contactSubmitting} className="w-full py-3 font-semibold text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60" style={{ backgroundColor: GREEN }}>
                  {contactSubmitting ? "Sending…" : "Submit Enquiry"}
                </button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  Prefer email? Reach us at <a href="mailto:info@bridgepathnetwork.com" className="font-semibold underline" style={{ color: GREEN }}>info@bridgepathnetwork.com</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS & INSIGHTS ── */}
      <section className="bg-white border-b border-gray-100">
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-10 border-b border-gray-100 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>Knowledge hub</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-1" style={{ color: DARK }}>News &amp; Insights</h2>
              <p className="text-gray-500 mt-1 text-sm">For organisations and professionals across Africa</p>
            </div>
            <Link href="/blog" className="text-xs font-semibold flex items-center gap-1 shrink-0" style={{ color: GREEN }}>
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {newsArticles.map((article, i) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <div
                  className="group cursor-pointer h-full flex flex-col hover:bg-gray-50/60 transition-colors"
                  style={{ borderRight: i < newsArticles.length - 1 ? "1px solid #e5e7eb" : "none" }}
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 border-t border-gray-100">
                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded w-fit" style={{ backgroundColor: GREEN + "20", color: GREEN }}>{article.tag}</span>
                    <h3 className="font-bold text-gray-900 mt-3 mb-2 text-sm leading-snug group-hover:text-green-700 transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <p className="text-xs text-gray-400">{article.date}</p>
                      <span className="text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: GREEN }}>Read <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-12 border-b border-gray-100 text-center">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>FAQs</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: DARK }}>Frequently asked questions</h2>
          </div>
          <div className="px-8 md:px-10 py-10 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left text-sm font-semibold hover:text-green-700 transition-colors"
                  style={{ color: DARK }}
                >
                  <span>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 shrink-0 ml-4" style={{ color: GREEN }} />
                    : <ChevronDown className="h-4 w-4 shrink-0 ml-4 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="pb-5 text-xs text-gray-600 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

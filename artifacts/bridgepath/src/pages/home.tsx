import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { blogPosts } from "@/pages/blog/index";
import {
  Users, FileText, Briefcase, Globe, Award, BarChart3,
  UserCheck, Calculator, ChevronDown, ChevronUp,
  TrendingUp, ShieldCheck, Star, CheckCircle2, ArrowRight, Clock,
  Code2, Landmark, Headphones, Crown, Search, Sparkles,
  Building2, MapPin, Zap, Target, ArrowUpRight, Play
} from "lucide-react";
import heroImage from "@assets/Hero_1778003129768.png";

const GREEN = "#8CC63F";
const DARK = "#0D1B2A";
const AMBER = "#F97316";

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
  { icon: <FileText className="h-5 w-5" />, step: "01", title: "Create Your Profile", desc: "Sign up and build a professional profile that showcases your skills, experience, and career goals." },
  { icon: <Search className="h-5 w-5" />, step: "02", title: "Discover Opportunities", desc: "Browse vetted roles across Ghana and Kenya, or remote positions open to African talent." },
  { icon: <Sparkles className="h-5 w-5" />, step: "03", title: "Get AI CV Review", desc: "Use our AI-powered CV tool to sharpen your application and stand out to top employers." },
  { icon: <Target className="h-5 w-5" />, step: "04", title: "Apply & Advance", desc: "Apply with confidence. Track your applications and grow your career with Bridgepath Africa." },
];

const employerSteps = [
  { icon: <Building2 className="h-5 w-5" />, step: "01", title: "Create an Employer Account", desc: "Sign up as an employer to access Africa's most qualified diaspora and local professionals." },
  { icon: <Zap className="h-5 w-5" />, step: "02", title: "Post Your Role", desc: "Describe the position, required experience, and location. We'll surface the right candidates fast." },
  { icon: <Users className="h-5 w-5" />, step: "03", title: "Browse & Shortlist", desc: "Review pre-screened candidate profiles, assess CVs, and build your shortlist in one place." },
  { icon: <CheckCircle2 className="h-5 w-5" />, step: "04", title: "Hire with Confidence", desc: "Engage talent directly or let our HR team manage the full hiring and onboarding process." },
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
  { q: "What does Bridgepath Africa do?", a: "Bridgepath Africa is a Human Resources Management Solutions and Executive Recruitment company headquartered in Accra, Ghana. With over 15 years of experience, we connect African talent with quality employers and provide comprehensive outsourced HR services across Africa." },
  { q: "Who is Bridgepath Africa for?", a: "Bridgepath Africa serves two groups: professionals (diaspora and local talent) looking for quality careers in Ghana and Kenya, and employers seeking to hire verified African talent — locally or remotely." },
  { q: "What services does Bridgepath Africa offer beyond recruitment?", a: "We offer Employment of Record, HR Consultancy, Payroll & Tax Administration, Psychometric Assessments, Staff Outsourcing, Interim Management, and Secondment Services." },
  { q: "Which countries is Bridgepath Africa launching in?", a: "We are launching platform access in Ghana and Kenya first, with a clear roadmap to expand across Africa as the network grows." },
  { q: "How does the AI CV Review work?", a: "Our AI CV Review tool analyses your CV against current hiring standards and provides structured feedback to improve your chances of getting shortlisted. Available to all registered professionals." },
  { q: "How can I get in touch with Bridgepath Africa?", a: "You can reach us via email at pkumanyc@gmail.com or by submitting an enquiry through the contact form below. Our headquarters is in Accra, Ghana." },
];

export default function Home() {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", company: "", email: "", phone: "", type: "Hiring talent", message: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) {
      toast({ variant: "destructive", title: "Name and email are required" });
      return;
    }
    setContactSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || "Failed to send");
      }
      toast({ title: "Enquiry received!", description: "Our team will get back to you within 1–2 business days." });
      setContactForm({ name: "", company: "", email: "", phone: "", type: "Hiring talent", message: "" });
    } catch (err) {
      toast({ variant: "destructive", title: "Could not send enquiry", description: err instanceof Error ? err.message : "Please try again or email us directly." });
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── HERO — full bleed, image breathes ── */}
      <section className="relative h-screen min-h-[680px] max-h-[960px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="African professionals collaborating in a modern boardroom"
            className="w-full h-full object-cover object-top"
          />
          {/* Gradient only at bottom for text legibility — image is the star */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.45) 40%, rgba(13,27,42,0.0) 75%)" }} />
        </div>

        <div className="relative z-10 w-full pb-14 md:pb-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border" style={{ backgroundColor: "rgba(140,198,63,0.15)", borderColor: "rgba(140,198,63,0.4)" }}>
                  <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: GREEN }} />
                  <span className="text-xs font-bold tracking-wider uppercase" style={{ color: GREEN }}>Early access open · Ghana &amp; Kenya</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.0] tracking-tight mb-6">
                  Africa's talent.<br />
                  <span style={{ color: GREEN }}>Placed with<br />purpose.</span>
                </h1>

                <p className="text-white/75 text-lg md:text-xl max-w-xl mb-8 leading-relaxed font-medium">
                  The premium careers and hiring platform connecting Africa's brightest professionals with ambitious global employers.
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                  <Link href="/jobs">
                    <button
                      className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-98"
                      style={{ backgroundColor: GREEN }}
                    >
                      <Search className="h-4 w-4" />
                      Find Opportunities
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/employers">
                    <button className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm text-white border border-white/40 backdrop-blur-sm hover:bg-white/15 transition-all hover:scale-105">
                      <Building2 className="h-4 w-4" />
                      Hire Talent
                    </button>
                  </Link>
                </div>

                <div className="flex items-center gap-6">
                  {[
                    { v: "Ghana", l: "Launch" },
                    { v: "Kenya", l: "Launch" },
                    { v: "15+ yrs", l: "Experience" },
                    { v: "2026", l: "MVP" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-base font-extrabold text-white leading-none">{s.v}</div>
                        <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">{s.l}</div>
                      </div>
                      {i < 3 && <div className="h-6 w-px bg-white/20" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOLD STATS BAR ── */}
      <div style={{ backgroundColor: GREEN }}>
        <div className="grid grid-cols-2 md:grid-cols-5 mx-auto max-w-7xl">
          {platformStats.map((s, i) => (
            <div
              key={`stat-${i}`}
              className="py-6 md:py-8 text-center"
              style={{ borderRight: i < platformStats.length - 1 ? "1px solid rgba(255,255,255,0.25)" : "none" }}
            >
              <div className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</div>
              <div className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white/70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DUAL USER JOURNEY ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: GREEN + "18", color: GREEN }}>Two paths. One platform.</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: DARK }}>
              How Bridgepath Africa<br /><span style={{ color: GREEN }}>works for you</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">Whether you're growing your career or building a team — we're built for your journey.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Job Seeker */}
            <div className="rounded-3xl overflow-hidden border-2" style={{ borderColor: GREEN }}>
              <div className="px-8 py-6 flex items-center gap-4" style={{ backgroundColor: GREEN }}>
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">For Professionals</p>
                  <h3 className="font-bold text-xl text-white">Build Your Career in Africa</h3>
                </div>
              </div>
              <div className="px-8 py-8 space-y-6 bg-white">
                {jobSeekerSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-5">
                    <div className="text-3xl font-extrabold shrink-0 leading-none" style={{ color: GREEN + "40" }}>{s.step}</div>
                    <div className="pt-1">
                      <p className="font-bold text-base" style={{ color: DARK }}>{s.title}</p>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-8 py-6 bg-white border-t border-gray-100">
                <Link href="/auth/signup">
                  <button className="w-full py-3.5 font-bold text-white rounded-xl text-sm transition-all hover:opacity-90 hover:scale-[1.01]" style={{ backgroundColor: GREEN }}>
                    Create Your Profile — It's Free
                  </button>
                </Link>
                <Link href="/jobs">
                  <p className="text-center text-xs mt-3 font-semibold hover:underline" style={{ color: GREEN }}>
                    Browse open roles →
                  </p>
                </Link>
              </div>
            </div>

            {/* Employer */}
            <div className="rounded-3xl overflow-hidden border-2" style={{ borderColor: DARK }}>
              <div className="px-8 py-6 flex items-center gap-4" style={{ backgroundColor: DARK }}>
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">For Employers</p>
                  <h3 className="font-bold text-xl text-white">Hire Africa's Best Talent</h3>
                </div>
              </div>
              <div className="px-8 py-8 space-y-6 bg-white">
                {employerSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-5">
                    <div className="text-3xl font-extrabold shrink-0 leading-none" style={{ color: DARK + "30" }}>{s.step}</div>
                    <div className="pt-1">
                      <p className="font-bold text-base" style={{ color: DARK }}>{s.title}</p>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-8 py-6 bg-white border-t border-gray-100">
                <Link href="/auth/signup?role=employer">
                  <button className="w-full py-3.5 font-bold text-white rounded-xl text-sm transition-all hover:opacity-90 hover:scale-[1.01]" style={{ backgroundColor: DARK }}>
                    Create an Employer Account
                  </button>
                </Link>
                <Link href="/services">
                  <p className="text-center text-xs mt-3 font-semibold text-gray-400 hover:text-gray-700 hover:underline">
                    Explore HR services →
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL-BLEED IMAGE SECTION: African Office Team ── */}
      <section className="relative h-[60vh] min-h-[420px] max-h-[640px] overflow-hidden">
        <img
          src="/photos/africa-office-team.png"
          alt="African professionals collaborating in a modern corporate office"
          className="w-full h-full object-cover object-center"
        />
        {/* Minimal overlay — let image shine */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,27,42,0.75) 0%, rgba(13,27,42,0.15) 60%, transparent 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-lg">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Where we hire</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Focus areas for <span style={{ color: GREEN }}>high-quality hiring</span>
              </h2>
              <div className="flex flex-wrap gap-3 mt-6">
                {focusAreas.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white backdrop-blur-sm border border-white/25" style={{ backgroundColor: "rgba(255,255,255,0.10)" }}>
                    <span style={{ color: GREEN }}>{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>
              <Link href="/jobs">
                <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105" style={{ backgroundColor: GREEN }}>
                  Browse open roles <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY BRIDGEPATH — bold dark section ── */}
      <section style={{ backgroundColor: DARK }} className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: "rgba(140,198,63,0.15)", color: GREEN }}>Why Bridgepath Africa</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
              Built on <span style={{ color: GREEN }}>Real Hiring Experience</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-lg">
              15+ years of African workforce experience, global HR leadership, and a deep understanding of what great hiring looks like.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            {whyPartner.map((w) => (
              <div
                key={w.title}
                className="p-8 md:p-10 text-center group hover:bg-white/5 transition-colors"
                style={{ backgroundColor: DARK }}
              >
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5 mx-auto transition-transform group-hover:scale-110" style={{ backgroundColor: GREEN + "20", color: GREEN }}>
                  {w.icon}
                </div>
                <h3 className="font-bold mb-3 text-base text-white">{w.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGIONAL: Bold image + copy, no shadow ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5" style={{ backgroundColor: GREEN + "18", color: GREEN }}>Where we operate</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: DARK }}>
                Launching in Ghana<br />and <span style={{ color: GREEN }}>Kenya</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed text-lg max-w-lg">
                Bridgepath Africa is launching with a clear focus on Ghana and Kenya — two of Africa's fastest-growing talent markets — before expanding to a broader pan-African network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <button className="px-7 py-4 font-bold text-white rounded-xl transition-all hover:opacity-90 hover:scale-105" style={{ backgroundColor: GREEN }}>
                    Join early access
                  </button>
                </Link>
                <Link href="/about">
                  <button className="px-7 py-4 font-bold rounded-xl border-2 transition-all hover:scale-105" style={{ borderColor: DARK, color: DARK }}>
                    Learn our story →
                  </button>
                </Link>
              </div>
            </div>
            {/* Clean image — no shadow, no overlay */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                <img
                  src="/photos/boardroom-meeting.png"
                  alt="African professionals in a corporate boardroom meeting"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bold accent badge */}
              <div className="absolute -bottom-4 -left-4 px-5 py-3 rounded-2xl font-bold text-sm text-white" style={{ backgroundColor: GREEN }}>
                🌍 Pan-African HR Expertise
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AFRICA OPPORTUNITY STATS — vibrant green section ── */}
      <section style={{ backgroundColor: "#0a1f0a" }} className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ backgroundColor: GREEN + "20", color: GREEN }}>The Africa Opportunity</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Why Africa is the world's<br /><span style={{ color: GREEN }}>next talent frontier</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              The numbers tell a story of unstoppable growth. Bridgepath Africa positions you at the centre of it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            {africaStats.map((stat) => (
              <div
                key={stat.label}
                className="p-8 md:p-10 group hover:bg-white/5 transition-colors"
                style={{ backgroundColor: "#0a1f0a" }}
              >
                <div className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: GREEN }}>{stat.value}</div>
                <div className="text-base font-bold mb-2 text-white">{stat.label}</div>
                <p className="text-sm text-gray-500 leading-relaxed">{stat.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HR PROFESSIONAL IMAGE SECTION ── */}
      <section className="relative h-[55vh] min-h-[380px] max-h-[600px] overflow-hidden">
        <img
          src="/photos/office-space.png"
          alt="Modern African corporate office space"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(13,27,42,0.80) 0%, rgba(13,27,42,0.20) 60%, transparent 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-md ml-auto">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Our services</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Full-service HR for the modern African workplace
              </h2>
              <p className="text-white/70 text-base mb-6">
                From EOR to payroll, outsourcing to psychometric assessments — we handle the complexity so you can focus on growth.
              </p>
              <Link href="/services">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/40 hover:bg-white/15 transition-all">
                  Explore HR services <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT — bold dark navy ── */}
      <section id="contact" style={{ backgroundColor: DARK }} className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6" style={{ backgroundColor: GREEN + "20", color: GREEN }}>Get in touch</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Start building with<br /><span style={{ color: GREEN }}>Bridgepath Africa</span>
              </h2>
              <p className="text-gray-400 mb-10 text-lg leading-relaxed">Tell us whether you want to find opportunities or hire top talent — we'll get back within 1–2 business days.</p>

              <div className="space-y-6">
                {[
                  { icon: <MapPin className="h-5 w-5" />, label: "Headquarters", value: "Accra, Ghana" },
                  { icon: <Globe className="h-5 w-5" />, label: "Operating in", value: "Ghana · Kenya · East & West Africa" },
                  { icon: <UserCheck className="h-5 w-5" />, label: "Contact", value: "pkumanyc@gmail.com" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN + "20", color: GREEN }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-200 mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <form
                className="rounded-3xl p-8 md:p-10"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onSubmit={handleContactSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Full Name</label>
                    <input className="w-full h-11 px-4 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }} placeholder="Your full name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Company</label>
                    <input className="w-full h-11 px-4 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }} placeholder="Your company" value={contactForm.company} onChange={e => setContactForm({ ...contactForm, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Email Address</label>
                    <input type="email" className="w-full h-11 px-4 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }} placeholder="you@example.com" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Phone</label>
                    <input type="tel" className="w-full h-11 px-4 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }} placeholder="+233 …" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">I am looking to…</label>
                    <select className="w-full h-11 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)" }} value={contactForm.type} onChange={e => setContactForm({ ...contactForm, type: e.target.value })}>
                      <option style={{ backgroundColor: DARK }}>Hire talent</option>
                      <option style={{ backgroundColor: DARK }}>Find a job or career opportunity</option>
                      <option style={{ backgroundColor: DARK }}>Outsource HR / payroll</option>
                      <option style={{ backgroundColor: DARK }}>Explore a partnership</option>
                      <option style={{ backgroundColor: DARK }}>Get more information</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Message</label>
                  <textarea className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }} rows={4} placeholder="Tell us a bit more about what you need…" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} />
                </div>
                <button type="submit" disabled={contactSubmitting} className="w-full py-4 font-bold text-white rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-60 hover:scale-[1.01]" style={{ backgroundColor: GREEN }}>
                  {contactSubmitting ? "Sending…" : "Submit Enquiry →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS & INSIGHTS ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex items-end justify-between gap-4 mb-12">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: GREEN + "18", color: GREEN }}>Knowledge hub</span>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ color: DARK }}>News &amp; Insights</h2>
              <p className="text-gray-500 mt-2 text-base">For organisations and professionals across Africa</p>
            </div>
            <Link href="/blog" className="flex items-center gap-1.5 text-sm font-bold shrink-0 hover:underline" style={{ color: GREEN }}>
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsArticles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <div className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 transition-all hover:-translate-y-1">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-3" style={{ backgroundColor: GREEN + "18", color: GREEN }}>{article.tag}</span>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug group-hover:text-green-700 transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400">{article.date}</p>
                      <span className="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: GREEN }}>Read <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 premium-grid-bg">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: GREEN + "18", color: GREEN }}>FAQs</span>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: DARK }}>Frequently asked questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: openFaq === i ? GREEN + "50" : "#e5e7eb" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-base hover:bg-gray-50 transition-colors"
                  style={{ color: openFaq === i ? GREEN : DARK }}
                >
                  <span>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-5 w-5 shrink-0 ml-4" style={{ color: GREEN }} />
                    : <ChevronDown className="h-5 w-5 shrink-0 ml-4 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BAND ── */}
      <section style={{ backgroundColor: GREEN }} className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ready to join Bridgepath Africa?</h2>
              <p className="text-white/75 text-lg">Early access is open in Ghana and Kenya. Get started today.</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <Link href="/auth/signup">
                <button className="px-8 py-4 font-bold text-sm rounded-xl bg-white hover:bg-gray-50 transition-all hover:scale-105" style={{ color: DARK }}>
                  Join the platform →
                </button>
              </Link>
              <Link href="/services">
                <button className="px-8 py-4 font-bold text-sm rounded-xl text-white border-2 border-white/40 hover:bg-white/15 transition-all">
                  Our services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

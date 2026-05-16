import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { blogPosts } from "@/pages/blog/index";
import {
  Users, FileText, Briefcase, Globe, Award, BarChart3,
  UserCheck, Calculator, ChevronDown, ChevronUp,
  TrendingUp, ShieldCheck, Star, CheckCircle2, ArrowRight, Clock,
  Code2, Landmark, Headphones, Crown, Search, Sparkles,
  Building2, MapPin, Zap, Target, ArrowUpRight, Play
} from "lucide-react";

const CORAL = "#C8461A";
const GOLD = "#E8962A";
const CHARCOAL = "#1C1917";
const CREAM = "#FFF8F2";

/* ── Reusable scroll-reveal wrapper ── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerChildren({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
        hidden: {}
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};

const focusAreas = [
  { icon: <Code2 className="h-6 w-6" />, label: "Technology" },
  { icon: <Landmark className="h-6 w-6" />, label: "Finance" },
  { icon: <Briefcase className="h-6 w-6" />, label: "HR & Operations" },
  { icon: <Headphones className="h-6 w-6" />, label: "Customer Success" },
  { icon: <Crown className="h-6 w-6" />, label: "Leadership" },
];

const whyPartner = [
  { icon: <TrendingUp className="h-7 w-7" />, title: "Global HR Leadership", desc: "Guidance shaped by senior hiring experience across African and international markets." },
  { icon: <ShieldCheck className="h-7 w-7" />, title: "20+ Years Experience", desc: "Built on practical workforce, recruitment, compliance, and people operations expertise." },
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
  { value: "20+", label: "Yrs Experience" },
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
  slug: p.slug, tag: p.tag, title: p.title, excerpt: p.excerpt, date: p.date, image: p.image,
}));

const faqs = [
  { q: "What does Bridgepath Africa do?", a: "Bridgepath Africa is a Human Resources Management Solutions and Executive Recruitment company headquartered in Accra, Ghana. With over 20 years of experience, we connect African talent with quality employers and provide comprehensive outsourced HR services across Africa." },
  { q: "Who is Bridgepath Africa for?", a: "Bridgepath Africa serves two groups: professionals (diaspora and local talent) looking for quality careers in Ghana and Kenya, and employers seeking to hire verified African talent — locally or remotely." },
  { q: "What services does Bridgepath Africa offer beyond recruitment?", a: "We offer Employment of Record, HR Consultancy, Payroll & Tax Administration, Psychometric Assessments, Staff Outsourcing, Interim Management, and Secondment Services." },
  { q: "Which countries is Bridgepath Africa launching in?", a: "We are launching platform access in Ghana and Kenya first, with a clear roadmap to expand across Africa as the network grows." },
  { q: "How does the AI CV Review work?", a: "Our AI CV Review tool analyses your CV against current hiring standards and provides structured feedback to improve your chances of getting shortlisted. Available to all registered professionals." },
  { q: "How can I get in touch with Bridgepath Africa?", a: "You can reach us via email at pkumanyc@gmail.com or by submitting an enquiry through the contact form below. Our headquarters is in Accra, Ghana." },
];

export default function Home() {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
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

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 620 }}>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 z-20 h-[3px]" style={{ backgroundColor: CORAL }} />

        {/* Hero image — WebP with PNG fallback, subtle zoom on scroll */}
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: heroImgScale }}>
          <picture>
            <source srcSet="/photos/hero-map-team.webp" type="image/webp" />
            <img
              src="/photos/hero-map-team.png"
              alt="Diverse professional team — Bridgepath Africa"
              className="w-full h-full object-cover object-center"
              loading="eager"
              decoding="async"
              style={{
                imageRendering: "auto",
                filter: "contrast(1.06) saturate(1.08) brightness(1.02)",
              }}
            />
          </picture>
        </motion.div>

        {/* Cinematic left-side gradient — dark, no cream tint */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: "linear-gradient(105deg, rgba(12,8,4,0.78) 0%, rgba(12,8,4,0.50) 38%, rgba(12,8,4,0.08) 65%, transparent 80%)",
          }}
        />
        {/* Subtle bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: "linear-gradient(to top, rgba(12,8,4,0.45) 0%, transparent 40%)" }}
        />

        {/* Hero content */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center z-10"
          style={{ y: heroContentY }}
        >
          <div className="container mx-auto px-5 sm:px-8 md:px-14 max-w-7xl">
            <div className="max-w-[520px] xl:max-w-[600px]">

              {/* Status pill */}
              <motion.div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 border"
                style={{ backgroundColor: "rgba(200,70,26,0.18)", borderColor: "rgba(200,70,26,0.45)", backdropFilter: "blur(10px)" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#FF7A52" }} />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-white/90">
                  Ghana Active · Kenya Opening Soon
                </span>
              </motion.div>

              {/* Main headline — white on dark overlay */}
              <motion.h1
                className="font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-white"
                style={{ fontSize: "clamp(1.85rem, 4.8vw, 3.9rem)", fontFamily: "var(--app-font-display)" }}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Work in Africa.
                <br />
                <span style={{ color: "#FF7A52" }}>Hire in Africa.</span>
                <br />
                From Anywhere.
              </motion.h1>

              {/* Kente accent bar */}
              <motion.div
                className="flex gap-1 mb-5"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 0.55, delay: 0.35 }}
              >
                {["#C8461A","#E8962A","#fff","#1F7A78"].map((c, i) => (
                  <div key={i} className="h-[3px] rounded-full" style={{ width: i === 0 ? 48 : i === 1 ? 28 : 16, backgroundColor: c, opacity: i === 2 ? 0.6 : 1 }} />
                ))}
              </motion.div>

              {/* Supporting line */}
              <motion.p
                className="mb-3 leading-[1.65] font-medium text-white/85"
                style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)", maxWidth: "460px", fontFamily: "var(--app-font-sans)" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.42 }}
              >
                BridgePath Africa connects diaspora and local professionals with employers across Africa, starting with Ghana and Kenya.
              </motion.p>

              {/* Status line */}
              <motion.div
                className="flex items-center gap-2 mb-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/90">
                  <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "#FF7A52" }} />
                  Ghana active.
                </span>
                <span className="text-[12px] font-medium text-white/50">Kenya opening soon.</span>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.58 }}
              >
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.04, brightness: 1.1 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white shadow-xl"
                    style={{ backgroundColor: CORAL, fontFamily: "var(--app-font-display)", boxShadow: "0 4px 24px rgba(200,70,26,0.45)" }}
                  >
                    <UserCheck className="h-4 w-4" />
                    Create Your Profile
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.button>
                </Link>
                <Link href="/employers">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white border-2 border-white/40 backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(255,255,255,0.10)", fontFamily: "var(--app-font-display)" }}
                  >
                    <Building2 className="h-4 w-4" />
                    Hire Talent
                  </motion.button>
                </Link>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-[3px]" style={{ backgroundColor: CORAL }} />
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: `linear-gradient(90deg, #1C1917 0%, #2A1810 40%, #1C1917 100%)` }}>
        <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mx-auto max-w-7xl" delay={0.1}>
          {platformStats.map((s, i) => (
            <motion.div
              key={`stat-${i}`}
              variants={cardVariant}
              className="py-7 md:py-9 text-center relative"
              style={{ borderRight: i < platformStats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
            >
              <div className="text-2xl md:text-3xl font-extrabold leading-none tracking-tight" style={{ fontFamily: "var(--app-font-display)", color: i % 2 === 0 ? "#E8962A" : "#fff" }}>
                {s.value}
              </div>
              <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 mt-1.5">{s.label}</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full" style={{ backgroundColor: i % 3 === 0 ? "#C8461A" : i % 3 === 1 ? "#E8962A" : "#1F7A78" }} />
            </motion.div>
          ))}
        </StaggerChildren>
      </div>

      {/* ── DUAL USER JOURNEY ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">
          <FadeUp className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: CORAL + "15", color: CORAL }}>Two paths. One platform.</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: CHARCOAL }}>
              How Bridgepath Africa<br /><span style={{ color: CORAL }}>works for you</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base sm:text-lg">Whether you're growing your career or building a team — we're built for your journey.</p>
          </FadeUp>

          <StaggerChildren className="grid md:grid-cols-2 gap-6 lg:gap-8" delay={0.1}>
            {/* Job Seeker */}
            <motion.div variants={cardVariant} className="rounded-3xl overflow-hidden border-2" style={{ borderColor: CORAL }}>
              <div className="px-6 sm:px-8 py-6 flex items-center gap-4" style={{ backgroundColor: CORAL }}>
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">For Professionals</p>
                  <h3 className="font-bold text-lg sm:text-xl text-white">Build Your Career in Africa</h3>
                </div>
              </div>
              <div className="px-6 sm:px-8 py-8 space-y-6 bg-white">
                {jobSeekerSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-4 sm:gap-5">
                    <div className="text-2xl sm:text-3xl font-extrabold shrink-0 leading-none" style={{ color: CORAL + "35" }}>{s.step}</div>
                    <div className="pt-1">
                      <p className="font-bold text-sm sm:text-base" style={{ color: CHARCOAL }}>{s.title}</p>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 sm:px-8 py-6 bg-white border-t border-orange-50">
                <Link href="/auth/signup">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 font-bold text-white rounded-xl text-sm" style={{ backgroundColor: CORAL }}>
                    Create Your Profile — It's Free
                  </motion.button>
                </Link>
                <Link href="/jobs">
                  <p className="text-center text-xs mt-3 font-semibold hover:underline" style={{ color: CORAL }}>Browse open roles →</p>
                </Link>
              </div>
            </motion.div>

            {/* Employer */}
            <motion.div variants={cardVariant} className="rounded-3xl overflow-hidden border-2" style={{ borderColor: CHARCOAL }}>
              <div className="px-6 sm:px-8 py-6 flex items-center gap-4" style={{ backgroundColor: CHARCOAL }}>
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">For Employers</p>
                  <h3 className="font-bold text-lg sm:text-xl text-white">Hire Africa's Best Talent</h3>
                </div>
              </div>
              <div className="px-6 sm:px-8 py-8 space-y-6 bg-white">
                {employerSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-4 sm:gap-5">
                    <div className="text-2xl sm:text-3xl font-extrabold shrink-0 leading-none" style={{ color: CHARCOAL + "28" }}>{s.step}</div>
                    <div className="pt-1">
                      <p className="font-bold text-sm sm:text-base" style={{ color: CHARCOAL }}>{s.title}</p>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 sm:px-8 py-6 bg-white border-t border-gray-100">
                <Link href="/auth/signup?role=employer">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 font-bold text-white rounded-xl text-sm" style={{ backgroundColor: CHARCOAL }}>
                    Create an Employer Account
                  </motion.button>
                </Link>
                <Link href="/services">
                  <p className="text-center text-xs mt-3 font-semibold text-gray-400 hover:text-gray-700 hover:underline">Explore HR services →</p>
                </Link>
              </div>
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* ── FULL-BLEED: Focus Areas ── */}
      <section className="relative h-[55vh] sm:h-[60vh] min-h-[380px] max-h-[640px] overflow-hidden">
        <motion.img
          src="/photos/coworking-team.png"
          alt="African professionals collaborating"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "contrast(1.08) saturate(1.1)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,25,23,0.88) 0%, rgba(28,25,23,0.22) 60%, transparent 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-5 sm:px-8 md:px-12">
            <div className="max-w-lg">
              <FadeUp delay={0.05}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>Where we hire</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                  Focus areas for <span style={{ color: GOLD }}>high-quality hiring</span>
                </h2>
              </FadeUp>
              <StaggerChildren className="flex flex-wrap gap-2 sm:gap-3 mt-5" delay={0.2}>
                {focusAreas.map((s) => (
                  <motion.div
                    key={s.label}
                    variants={cardVariant}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white border border-white/25"
                    style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
                  >
                    <span style={{ color: GOLD }}>{s.icon}</span>
                    {s.label}
                  </motion.div>
                ))}
              </StaggerChildren>
              <FadeUp delay={0.4}>
                <Link href="/jobs">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-bold text-sm text-white"
                    style={{ backgroundColor: CORAL }}
                  >
                    Browse open roles <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY BRIDGEPATH ── */}
      <section style={{ backgroundColor: CREAM }} className="py-16 md:py-24">
        <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">
          <FadeUp className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: CORAL + "18", color: CORAL }}>Why Bridgepath Africa</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2" style={{ color: CHARCOAL }}>
              Built on <span style={{ color: CORAL }}>Real Hiring Experience</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-base sm:text-lg">
              20+ years of African workforce experience, global HR leadership, and a deep understanding of what great hiring looks like.
            </p>
          </FadeUp>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6" delay={0.1}>
            {whyPartner.map((w) => (
              <motion.div
                key={w.title}
                variants={cardVariant}
                whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(200,70,26,0.12)" }}
                className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-orange-100/60 transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                  style={{ backgroundColor: CORAL + "15", color: CORAL }}
                >
                  {w.icon}
                </motion.div>
                <h3 className="font-bold mb-3 text-sm sm:text-base" style={{ color: CHARCOAL }}>{w.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── REGIONAL: Ghana & Kenya ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeUp delay={0.05}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5" style={{ backgroundColor: CORAL + "15", color: CORAL }}>Where we operate</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: CHARCOAL }}>
                Launching in Ghana<br />and <span style={{ color: CORAL }}>Kenya</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed text-base sm:text-lg max-w-lg">
                Bridgepath Africa is launching with a clear focus on Ghana and Kenya — two of Africa's fastest-growing talent markets — before expanding to a broader pan-African network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto px-7 py-4 font-bold text-white rounded-xl" style={{ backgroundColor: CORAL }}>
                    Join early access
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto px-7 py-4 font-bold rounded-xl border-2" style={{ borderColor: CHARCOAL, color: CHARCOAL }}>
                    Learn our story →
                  </motion.button>
                </Link>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                  <motion.img
                    src="/photos/boardroom-deal.png"
                    alt="African professionals closing a deal"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.5 }}
                    style={{ filter: "contrast(1.06) saturate(1.08)" }}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -bottom-4 -left-4 px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-lg"
                  style={{ backgroundColor: CORAL }}
                >
                  🌍 Pan-African HR Expertise
                </motion.div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── AFRICA OPPORTUNITY STATS ── */}
      <section style={{ background: `linear-gradient(135deg, ${CHARCOAL} 0%, #3D2A1E 100%)` }} className="py-16 md:py-24">
        <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ backgroundColor: CORAL + "25", color: GOLD }}>The Africa Opportunity</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Why Africa is the world's<br /><span style={{ color: GOLD }}>next talent frontier</span>
                </h2>
              </div>
              <p className="text-white/50 max-w-xs leading-relaxed text-sm sm:text-base">
                The numbers tell a story of unstoppable growth. Bridgepath Africa positions you at the centre of it.
              </p>
            </div>
          </FadeUp>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" } as any} delay={0.1}>
            {africaStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={cardVariant}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                className="p-7 sm:p-8 md:p-10 transition-colors"
                style={{ backgroundColor: "rgba(28,25,23,0.85)" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-4xl md:text-5xl font-extrabold mb-2"
                  style={{ color: CORAL }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm sm:text-base font-bold mb-2 text-white">{stat.label}</div>
                <p className="text-xs sm:text-sm text-white/40 leading-relaxed">{stat.context}</p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── HR IMAGE SECTION ── */}
      <section className="relative h-[50vh] sm:h-[55vh] min-h-[320px] max-h-[600px] overflow-hidden">
        <motion.img
          src="/photos/job-interview.png"
          alt="African professional HR interview"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "contrast(1.08) saturate(1.1)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(28,25,23,0.88) 0%, rgba(28,25,23,0.20) 60%, transparent 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="container mx-auto px-5 sm:px-8 md:px-12">
            <FadeUp className="max-w-md ml-auto" delay={0.1}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>Our services</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Full-service HR for the modern African workplace
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-6">
                From EOR to payroll, outsourcing to psychometric assessments — we handle the complexity so you can focus on growth.
              </p>
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/40 hover:bg-white/15 transition-all"
                >
                  Explore HR services <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: `linear-gradient(135deg, #8B2E0A 0%, ${CORAL} 40%, #D4621F 100%)` }} className="py-16 md:py-24">
        <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <FadeUp delay={0.05}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6" style={{ backgroundColor: "rgba(255,255,255,0.20)", color: "white" }}>Get in touch</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Start building with<br /><span style={{ color: GOLD }}>Bridgepath Africa</span>
              </h2>
              <p className="text-white/75 mb-10 text-base sm:text-lg leading-relaxed">Tell us whether you want to find opportunities or hire top talent — we'll get back within 1–2 business days.</p>
              <div className="space-y-5 sm:space-y-6">
                {[
                  { icon: <MapPin className="h-5 w-5" />, label: "Headquarters", value: "Accra, Ghana" },
                  { icon: <Globe className="h-5 w-5" />, label: "Operating in", value: "Ghana · Kenya · East & West Africa" },
                  { icon: <UserCheck className="h-5 w-5" />, label: "Contact", value: "pkumanyc@gmail.com" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.20)", color: "white" }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/60">{item.label}</p>
                      <p className="text-sm font-medium text-white mt-0.5">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <form className="rounded-3xl p-6 sm:p-8 md:p-10 bg-white shadow-2xl" onSubmit={handleContactSubmit}>
                <h3 className="font-bold text-xl mb-6" style={{ color: CHARCOAL }}>Send an enquiry</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Full Name</label>
                    <input className="w-full h-11 px-4 rounded-xl text-sm border border-orange-100 focus:outline-none focus:ring-2 focus:border-transparent" placeholder="Your full name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Company</label>
                    <input className="w-full h-11 px-4 rounded-xl text-sm border border-orange-100 focus:outline-none focus:ring-2" placeholder="Your company" value={contactForm.company} onChange={e => setContactForm({ ...contactForm, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Email Address</label>
                    <input type="email" className="w-full h-11 px-4 rounded-xl text-sm border border-orange-100 focus:outline-none focus:ring-2" placeholder="you@example.com" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Phone</label>
                    <input type="tel" className="w-full h-11 px-4 rounded-xl text-sm border border-orange-100 focus:outline-none focus:ring-2" placeholder="+233 …" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">I am looking to…</label>
                    <select className="w-full h-11 px-4 rounded-xl text-sm border border-orange-100 focus:outline-none focus:ring-2 bg-white text-gray-700" value={contactForm.type} onChange={e => setContactForm({ ...contactForm, type: e.target.value })}>
                      <option>Hire talent</option>
                      <option>Find a job or career opportunity</option>
                      <option>Outsource HR / payroll</option>
                      <option>Explore a partnership</option>
                      <option>Get more information</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Message</label>
                  <textarea className="w-full px-4 py-3 rounded-xl text-sm border border-orange-100 focus:outline-none focus:ring-2 resize-none" rows={4} placeholder="Tell us a bit more about what you need…" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} />
                </div>
                <motion.button
                  type="submit"
                  disabled={contactSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 font-bold text-white rounded-xl text-sm disabled:opacity-60"
                  style={{ backgroundColor: CORAL }}
                >
                  {contactSubmitting ? "Sending…" : "Submit Enquiry →"}
                </motion.button>
              </form>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── NEWS & INSIGHTS ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">
          <FadeUp>
            <div className="flex items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: CORAL + "15", color: CORAL }}>Knowledge hub</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: CHARCOAL }}>News &amp; Insights</h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">For organisations and professionals across Africa</p>
              </div>
              <Link href="/blog" className="flex items-center gap-1.5 text-sm font-bold shrink-0 hover:underline" style={{ color: CORAL }}>
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6" delay={0.1}>
            {newsArticles.map((article) => (
              <motion.div key={article.slug} variants={cardVariant}>
                <Link href={`/blog/${article.slug}`}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
                    className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden border border-orange-50 hover:border-orange-200 transition-all"
                  >
                    <div className="h-44 sm:h-48 overflow-hidden bg-orange-50">
                      <motion.img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-3" style={{ backgroundColor: CORAL + "15", color: CORAL }}>{article.tag}</span>
                      <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug group-hover:text-orange-700 transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-orange-50">
                        <p className="text-xs text-gray-400">{article.date}</p>
                        <span className="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: CORAL }}>Read <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: CREAM }}>
        <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-4xl">
          <FadeUp className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: CORAL + "15", color: CORAL }}>FAQs</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: CHARCOAL }}>Frequently asked questions</h2>
          </FadeUp>
          <StaggerChildren className="space-y-2" delay={0.05}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                className="rounded-2xl overflow-hidden border bg-white"
                style={{ borderColor: openFaq === i ? CORAL + "50" : "#F5E6D8" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-sm sm:text-base hover:bg-orange-50 transition-colors"
                  style={{ color: openFaq === i ? CORAL : CHARCOAL }}
                >
                  <span>{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-5 w-5 shrink-0 ml-4" style={{ color: openFaq === i ? CORAL : "#9CA3AF" }} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-gray-600 leading-relaxed border-t border-orange-50 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── FINAL CTA BAND ── */}
      <section style={{ backgroundColor: CORAL }} className="py-14 md:py-20">
        <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Ready to join Bridgepath Africa?</h2>
                <p className="text-white/75 text-base sm:text-lg">Early access is open in Ghana and Kenya. Get started today.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0 w-full sm:w-auto">
                <Link href="/auth/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-7 sm:px-8 py-4 font-bold text-sm rounded-xl bg-white hover:bg-orange-50 transition-all"
                    style={{ color: CORAL }}
                  >
                    Join the platform →
                  </motion.button>
                </Link>
                <Link href="/services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-7 sm:px-8 py-4 font-bold text-sm rounded-xl text-white border-2 border-white/40 hover:bg-white/15 transition-all"
                  >
                    Our services
                  </motion.button>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}

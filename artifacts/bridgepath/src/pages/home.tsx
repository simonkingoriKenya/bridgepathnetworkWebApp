import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { blogPosts } from "@/pages/blog/index";
import {
  Users, FileText, Briefcase, Globe, Award, BarChart3,
  UserCheck, Calculator, ChevronDown, ChevronUp,
  TrendingUp, ShieldCheck, Star, CheckCircle2, ArrowRight, Clock,
  Code2, Landmark, Headphones, Crown
} from "lucide-react";
import heroImage from "@assets/unnamed_(9)_1776009115710.jpg";
import credibilityImage from "@assets/unnamed_(6)_1776009115712.jpg";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

const services = [
  { icon: <Code2 className="h-6 w-6" />, label: "Technology" },
  { icon: <Landmark className="h-6 w-6" />, label: "Finance" },
  { icon: <Briefcase className="h-6 w-6" />, label: "HR & Operations" },
  { icon: <Headphones className="h-6 w-6" />, label: "Customer Success" },
  { icon: <Crown className="h-6 w-6" />, label: "Leadership" },
];

const whyPartner = [
  { icon: <TrendingUp className="h-7 w-7" />, title: "Global HR leadership", desc: "Guidance shaped by senior hiring experience across African and international markets." },
  { icon: <ShieldCheck className="h-7 w-7" />, title: "20+ years experience", desc: "Built on practical workforce, recruitment, compliance, and people operations expertise." },
  { icon: <Users className="h-7 w-7" />, title: "Multiple industries", desc: "Supporting hiring needs across technology, finance, HR, operations, customer success, and leadership." },
  { icon: <Star className="h-7 w-7" />, title: "Diaspora + local reach", desc: "Connecting employers with both returning diaspora professionals and strong local talent." },
];

const africaStats = [
  { value: "700M+", label: "Working-age Africans by 2030", context: "The world's fastest-growing labour force, driving global demand for African talent." },
  { value: "60%", label: "of Africa is under 25", context: "A youthful, tech-savvy workforce ready to power the next generation of business." },
  { value: "$3T+", label: "Africa's combined GDP by 2030", context: "A continent-sized opportunity that forward-looking companies are already capitalising on." },
  { value: "11M", label: "New professionals annually", context: "Africa adds more young workers to the global economy than any other region each year." },
  { value: "54", label: "Countries, one talent pool", context: "With the right HR partner, pan-African hiring is no longer complex — it's your advantage." },
  { value: "2", label: "Launch markets", context: "Starting with Ghana and Kenya, then growing carefully into a broader African talent network." },
];

const stats = [
  { value: "Ghana", label: "Launch Market" },
  { value: "Kenya", label: "Launch Market" },
  { value: "2026", label: "MVP Launch" },
  { value: "Early", label: "Access Open" },
  { value: "15+", label: "Years of Experience" },
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
  { q: "What does Bridgepath Network do?", a: "Bridgepath Network is a Human Resources Management Solutions and Executive Recruitment company headquartered in Accra, Ghana. With over 15 years of experience, we have established ourselves as a leader in providing comprehensive outsourced HR services across Africa." },
  { q: "What services does Bridgepath Network offer beyond recruitment?", a: "We offer employment of record, HR consultancy, payroll & tax administration, psychometric assessments, staff outsourcing, interim management, and secondment services." },
  { q: "Which countries is Bridgepath Network launching in?", a: "Bridgepath Network is launching platform access in Ghana and Kenya first, with a roadmap to expand across Africa as the network grows." },
  { q: "What industries does Bridgepath Network serve?", a: "We serve clients across technology, FMCG, manufacturing, financial services, healthcare, logistics, hospitality, and NGO sectors." },
  { q: "How can I get in touch with Bridgepath Network?", a: "You can reach us via email at info@bridgepathnetwork.com or by submitting an enquiry through the contact form below. Our headquarters is in Accra, Ghana." },
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
    const { error } = await supabase.from("contact_leads").insert({
      name: contactForm.name.trim(),
      company: contactForm.company.trim() || null,
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim() || null,
      enquiry_type: contactForm.type,
      message: contactForm.message.trim() || null,
    });
    setContactSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Could not send request", description: error.message });
      return;
    }
    toast({ title: "Request received", description: "Our team will get back to you within 24 hours." });
    setContactForm({ name: "", company: "", email: "", phone: "", type: "Hiring talent", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white premium-grid-bg">
      <Navbar />

      {/* Hero — Full-page vibrant */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Diverse African and international professionals in a boardroom meeting"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(26,35,64,0.88) 50%, rgba(26,35,64,0.3) 100%)" }} />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-medium" style={{ backgroundColor: GREEN + "25", color: GREEN }}>
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: GREEN }} />
              Launching in Ghana and Kenya
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Connecting Talent<br />
              to Opportunity<br />
              <span style={{ color: GREEN }}>Across Africa</span>
            </h1>
            <p className="text-gray-300 text-xl leading-relaxed mb-10 max-w-xl">
              BridgePath is a modern careers and hiring platform designed to connect diaspora and local professionals with high-quality opportunities across Africa — starting with Ghana and Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <button className="px-8 py-4 font-bold text-white rounded-xl text-lg transition-all hover:opacity-90 active:scale-95 shadow-lg" style={{ backgroundColor: GREEN }}>
                  Find Opportunities
                </button>
              </Link>
              <Link href="/employers">
                <button className="px-8 py-4 font-bold rounded-xl text-lg border-2 border-white text-white hover:bg-white/10 transition-all">
                  Hire Talent
                </button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-12">
              {[{ v: "Ghana", l: "Launch" }, { v: "Kenya", l: "Launch" }, { v: "Early", l: "Access" }].map(s => (
                <div key={s.l}>
                  <div className="text-2xl font-bold text-white">{s.v}</div>
                  <div className="text-xs text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is BridgePath — 4 columns grid panels */}
      <section id="about" className="bg-white/95 premium-grid-bg" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", maxWidth: "1280px", margin: "0 auto" }}>
          <div className="p-8 md:p-10" style={{ borderRight: "1px solid #e5e7eb" }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: DARK }}>What is BridgePath</h2>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">BridgePath is built to support the evolving workforce across Africa by making it easier for professionals and employers to find each other with clarity and trust.</p>
            <ul className="space-y-2">
              {["Diaspora professionals ready to build careers in Africa", "Local talent seeking quality opportunities in Ghana and Kenya", "Businesses looking for qualified, verified candidates"].map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: GREEN }} /> {item}
                </li>
              ))}
            </ul>
            <p className="text-xs font-medium mt-4 text-gray-700">All in one platform.</p>
          </div>

          <div className="p-8 md:p-10" style={{ borderRight: "1px solid #e5e7eb" }}>
            <h3 className="font-bold text-gray-800 mb-3 text-sm">For Professionals</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Build a profile, explore career growth, and apply easily to quality opportunities across Ghana, Kenya, and remote African markets.</p>
            <Link href="/auth/signup">
              <span className="text-xs font-semibold underline underline-offset-2 cursor-pointer" style={{ color: GREEN }}>
                Create Your Profile →
              </span>
            </Link>
          </div>

          <div className="p-8 md:p-10" style={{ borderRight: "1px solid #e5e7eb" }}>
            <h3 className="font-bold text-gray-800 mb-3 text-sm">For Employers</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Access diaspora and local professionals, review pre-screened talent, and move faster from search to shortlist.</p>
            <Link href="/auth/signup?role=employer">
              <button className="px-4 py-2 text-xs font-semibold text-white rounded-lg" style={{ backgroundColor: DARK }}>
                Post a Job
              </button>
            </Link>
          </div>

          <div className="p-8 md:p-10">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">How It Works</h3>
            <ol className="space-y-3">
              {["Create Profile", "Discover Opportunities or Talent", "Engage and Grow"].map((step, i) => (
                <li key={step} className="flex items-center gap-2.5 text-xs text-gray-600">
                  <span className="h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: GREEN }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white/95 premium-grid-bg" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
              Focus areas for <span style={{ color: GREEN }}>high-quality hiring</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">BridgePath focuses on roles and talent communities where Africa’s next wave of growth is already happening.</p>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {services.map((s, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                whileHover={{ y: -10, scale: 1.035, rotateX: -4, rotateY: i % 2 === 0 ? 4 : -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="relative rounded-3xl border border-white/80 bg-white/90 shadow-sm overflow-hidden focus-card-glow"
              >
                {"comingSoon" in s && s.comingSoon ? (
                  <div className="flex flex-col items-center text-center p-8 h-full opacity-50 cursor-not-allowed select-none">
                    <div className="h-14 w-14 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4 text-gray-300">
                      {s.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-400">{s.label}</p>
                    <span className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFF7ED", color: "#C2410C" }}>
                      <Clock className="h-2.5 w-2.5" /> Coming Soon
                    </span>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-between text-center p-7 min-h-48 hover:bg-white transition-all group h-full">
                    <div className="absolute inset-x-8 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />
                    <div className="h-16 w-16 rounded-2xl border flex items-center justify-center mb-5 transition-all group-hover:scale-110 group-hover:rotate-3" style={{ borderColor: GREEN + "55", color: GREEN, background: `linear-gradient(135deg, ${GREEN}14, white)` }}>
                      {s.icon}
                    </div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors">{s.label}</p>
                    <span className="mt-4 h-1 w-8 rounded-full opacity-40 group-hover:opacity-100 group-hover:w-12 transition-all" style={{ backgroundColor: GREEN }} />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link href="/services">
              <button className="flex items-center gap-2 mx-auto px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all hover:text-white hover:shadow-md" style={{ borderColor: GREEN, color: GREEN, backgroundColor: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = GREEN; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = GREEN; }}>
                Explore opportunities <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="bg-gray-50 premium-grid-bg" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-12 border-b border-gray-200 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
              Built on <span style={{ color: GREEN }}>Real Hiring Experience</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">BridgePath combines global HR leadership, 20+ years of experience, and practical knowledge across multiple industries.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {whyPartner.map((w, i) => (
              <div key={i} className="p-8 md:p-10 text-center"
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

      {/* Regional presence */}
      <section className="py-20 premium-grid-bg-dark" style={{ backgroundColor: "#2d3e2a", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-6xl mx-auto">
            <div className="flex-1 w-full text-left">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-white">
                Launching in Ghana<br />and <span style={{ color: GREEN }}>Kenya</span>
                <br />
                <span className="text-2xl md:text-3xl font-semibold text-gray-200">Connecting employers and talent</span>
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed text-base md:text-lg max-w-xl">
                BridgePath is launching with a clear focus on Ghana and Kenya, while building toward a broader African talent network that connects local and diaspora professionals with serious employers.
              </p>
              <Link href="/auth/signup">
                <button className="px-6 py-3 font-semibold text-white rounded-lg border border-white/30 hover:bg-white/10 transition-colors text-sm">
                  Join early access →
                </button>
              </Link>
            </div>
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[4/3] lg:aspect-[5/4]">
                <img
                  src={credibilityImage}
                  alt="African women professionals collaborating over laptops in a bright office"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Africa Opportunity — replaces fake testimonials */}
      <section className="bg-white/95 premium-grid-bg" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-12 border-b border-gray-200">
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
                key={i}
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

      {/* Stats */}
      <section style={{ backgroundColor: "#4a6741", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="grid grid-cols-2 md:grid-cols-5" style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid rgba(255,255,255,0.08)", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          {stats.map((s, i) => (
            <div key={i} className="py-14 text-center"
              style={{ borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white">{s.value}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-gray-300 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="bg-gray-50" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-12 border-b border-gray-200 text-center">
            <h2 className="text-3xl font-bold" style={{ color: DARK }}>Start building your future with BridgePath</h2>
            <p className="text-gray-500 mt-1 text-sm">Launching in Ghana and Kenya. Tell us whether you want to find opportunities or hire talent.</p>
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
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Company Name</label>
                  <input className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Company name" value={contactForm.company} onChange={e => setContactForm({ ...contactForm, company: e.target.value })} />
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
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Enquiry Type</label>
                  <select className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-300" value={contactForm.type} onChange={e => setContactForm({ ...contactForm, type: e.target.value })}>
                    <option>Hiring talent</option>
                    <option>Looking for a job</option>
                    <option>HR outsourcing</option>
                    <option>Partnership</option>
                    <option>Other enquiry</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" rows={4} placeholder="Tell us more..." value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} />
              </div>
              <button type="submit" disabled={contactSubmitting} className="w-full py-3 font-semibold text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60" style={{ backgroundColor: GREEN }}>
                {contactSubmitting ? "Sending…" : "Submit Request"}
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                Need to speak with us directly? <a href="mailto:info@bridgepathnetwork.com" className="font-semibold underline" style={{ color: GREEN }}>info@bridgepathnetwork.com</a>
              </p>
            </form>
          </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="bg-white" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-10 border-b border-gray-200 flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: DARK }}>News and Insights</h2>
              <p className="text-gray-500 mt-1 text-sm">For organisations and people</p>
            </div>
            <Link href="/blog" className="text-xs font-semibold flex items-center gap-1 shrink-0" style={{ color: GREEN }}>
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {newsArticles.map((article, i) => (
              <Link key={i} href={`/blog/${article.slug}`}>
                <div className="group cursor-pointer h-full flex flex-col hover:bg-gray-50/60 transition-colors"
                  style={{ borderRight: i < newsArticles.length - 1 ? "1px solid #e5e7eb" : "none" }}
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={article.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1" style={{ borderTop: "1px solid #e5e7eb" }}>
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

      {/* FAQ */}
      <section className="bg-gray-50" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-8 md:px-10 py-12 border-b border-gray-200 text-center">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: DARK }}>Frequently asked questions</h2>
          </div>
          <div className="px-8 md:px-10 py-10 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left text-sm font-semibold hover:text-green-700 transition-colors" style={{ color: DARK }}>
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 shrink-0 ml-4" style={{ color: GREEN }} /> : <ChevronDown className="h-4 w-4 shrink-0 ml-4 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="pb-5 text-xs text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
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

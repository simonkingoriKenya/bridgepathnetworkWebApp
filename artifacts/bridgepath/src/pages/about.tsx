import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { motion } from "framer-motion";
import { Linkedin, Quote, CheckCircle2, Target, Eye, Users, Award, Lightbulb, Handshake, ArrowRight, GraduationCap, Star } from "lucide-react";
import founderFallback from "@assets/unnamed_(7)_1776009115711.jpg";

const CORAL = "#C8461A";
const TEAL = "#1F7A78";
const CHARCOAL = "#1C1917";
const CREAM = "#FFF8F2";
const NAVY = "#16213E";

const PAMELA_FALLBACK = founderFallback;

function FounderPhoto() {
  const [src, setSrc] = useState("/pamela.png");
  return (
    <img
      src={src}
      onError={() => setSrc(PAMELA_FALLBACK)}
      alt="Pamela Kuma — Founder, Bridgepath Africa"
      className="relative w-full max-w-xs mx-auto rounded-2xl object-cover shadow-2xl"
      style={{ aspectRatio: "3/4" }}
    />
  );
}

const timeline = [
  { year: "2008", event: "Bridgepath Africa founded in Accra, Ghana with a focus on HR outsourcing." },
  { year: "2012", event: "Expanded into East Africa — launching operations in Kenya, Uganda, and Tanzania." },
  { year: "2015", event: "Launched our psychometric and talent assessment practice across 12 countries." },
  { year: "2018", event: "Deepened institutional HR consulting across education, energy, technology, and professional services." },
  { year: "2021", event: "Launched digital talent platform and AI-powered CV review tool." },
  { year: "2024", event: "Designed the Bridgepath Africa platform for diaspora and local talent communities." },
  { year: "2026", event: "Launching MVP access in Ghana and Kenya, with a growing pan-African roadmap." },
];

const pillars = [
  { icon: <Users className="h-6 w-6" />, title: "Talent Acquisition", desc: "We help define roles, train hiring teams, and improve interview processes to find the right people — not just fill vacancies." },
  { icon: <Handshake className="h-6 w-6" />, title: "Conflict Resolution & Staff Relations", desc: "We train teams to handle conflict and build trust, because most people quit due to poor manager relationships." },
  { icon: <Lightbulb className="h-6 w-6" />, title: "Staff Training & Development", desc: "Training assessments, workshops, and train-the-trainer programs that boost staff confidence, morale, and empowerment." },
  { icon: <Award className="h-6 w-6" />, title: "Organizational Excellence", desc: "Bringing HR and institutional processes together to create cultures of performance, inclusion, and sustainable growth." },
];

const whyUs = [
  { title: "African HR Expertise", desc: "20+ years of HR experience supporting institutions across Ghana, Nigeria, Kenya, South Africa, and other African countries." },
  { title: "Value-Aligned Partnership", desc: "We partner with organizations that prioritize diversity, inclusion, and excellence." },
  { title: "Flexible Service Delivery", desc: "In-person, virtual, and tailored consulting services to meet you where you are." },
  { title: "Proven Results", desc: "90%+ client satisfaction, measurable ROI on services, and significant staff retention improvements." },
];

const stats = [
  { value: "20+", label: "Years of Experience" },
  { value: "Ghana", label: "Launch Market" },
  { value: "Kenya", label: "Launch Market" },
  { value: "90%+", label: "Client Satisfaction" },
];

const certificates = [
  { title: "PSM I", body: "Professional Scrum Master I", area: "Agile & Scrum" },
  { title: "PSM II", body: "Professional Scrum Master II", area: "Advanced Scrum" },
  { title: "PSPO I", body: "Professional Scrum Product Owner I", area: "Product Ownership" },
  { title: "20+ Years Experience", body: "HR & Talent Acquisition Leadership", area: "Human Resources" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageSEO
        title="About Bridgepath Africa | 20+ Years of African HR Expertise"
        description="Learn about Bridgepath Africa's mission, founding team, and 20+ years of HR experience building African workforce solutions across Ghana, Kenya, and beyond."
        path="/about"
        breadcrumbs={[{ name: "About Us", path: "/about" }]}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] max-h-[780px] overflow-hidden flex items-end">
        <img
          src="/photos/hr-leader.webp"
          alt="African HR professional — Bridgepath Africa"
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="relative z-10 w-full pb-14 md:pb-20">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5" style={{ backgroundColor: "rgba(255,255,255,0.85)", color: CORAL, border: `1px solid rgba(200,70,26,0.3)`, backdropFilter: "blur(8px)" }}>About Bridgepath Africa</span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-tight" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)" }}>
                Shaping People.<br />
                <span style={{ color: "#F0A010", textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}>Strengthening Institutions.</span>
              </h1>
              <p className="text-white text-xl max-w-2xl leading-relaxed" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}>
                Your roadmap to organizational excellence — through people-first HR solutions across Africa and beyond.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 border-b" style={{ backgroundColor: "#FFF8F2", borderColor: "#F5E6D8" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-4xl font-bold mb-1" style={{ color: CORAL }}>{s.value}</div>
                <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "#7A6A5A" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row gap-14 items-start">
              <div className="md:w-2/5 shrink-0">
                <div className="relative">
                  <FounderPhoto />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[240px] rounded-xl p-3 text-white" style={{ backgroundColor: "rgba(28,25,23,0.92)" }}>
                    <p className="font-bold text-sm">Pamela Kuma</p>
                    <p className="text-xs text-gray-300">Founder & CEO</p>
                    <a href="https://www.linkedin.com/in/pamela-kuma" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs mt-1.5 hover:opacity-80 transition-opacity" style={{ color: CORAL }}>
                      <Linkedin className="h-3 w-3" /> linkedin.com/in/pamela-kuma
                    </a>
                  </div>
                </div>

                {/* Founder quote below photo */}
                <div className="mt-8 px-1">
                  <p className="text-sm italic leading-relaxed text-center font-medium" style={{ color: CORAL }}>
                    "Africa's talent is everywhere. BridgePath brings it home — and connects it to opportunity."
                  </p>
                  <p className="text-xs text-center mt-2 font-semibold text-gray-400">— Pamela Kuma, Founder & CEO</p>
                </div>
              </div>

              <div className="md:w-3/5 pt-4">
                <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: CORAL }}>About the Founder</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: CHARCOAL }}>Meet Pamela Kuma</h2>

                <p className="text-gray-600 leading-relaxed mb-4 text-base">
                  Pamela Kuma is a seasoned HR and Talent Acquisition leader with over 20 years of experience shaping workforce strategy across African and global markets — including Media, Technology, FinTech, and Energy.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4 text-base">
                  With a deep understanding of both local talent landscapes and international hiring standards, Pamela founded BridgePath to bridge a critical gap — connecting exceptional talent with meaningful opportunity across Africa.
                </p>

                <div className="flex items-start gap-3 p-5 rounded-xl mb-5" style={{ backgroundColor: CORAL + "08", border: `1px solid ${CORAL}25` }}>
                  <Quote className="h-6 w-6 shrink-0 mt-0.5" style={{ color: CORAL }} />
                  <blockquote className="text-gray-700 italic leading-relaxed font-medium text-base">
                    "Great organizations are built by great people — and the right connections make all the difference."
                  </blockquote>
                </div>

                <p className="text-gray-600 leading-relaxed mb-4 text-base">
                  Through BridgePath, she brings together global best practices and local insight to support organizations in hiring with clarity, building strong teams, and creating cultures that last.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 text-base">
                  Her experience spans executive recruitment, HR transformation, and capacity building, working with businesses and institutions across the continent, with BridgePath launching in Ghana and Kenya.
                </p>

                {/* Experience highlights */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Media & Broadcasting" },
                    { label: "Technology & FinTech" },
                    { label: "Energy & Extractives" },
                    { label: "Executive Recruitment" },
                  ].map((area) => (
                    <div key={area.label} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: CORAL }} />
                      {area.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certificates & Credentials */}
      <section className="py-20 md:py-24" style={{ backgroundColor: CREAM }}>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: CORAL }}>Credentials</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: CHARCOAL }}>Certifications &amp; Qualifications</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Pamela brings a breadth of internationally recognised HR certifications, underpinning Bridgepath Africa's commitment to world-class standards.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((cert, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all" style={{ borderColor: "#F5E6D8" }}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: CORAL + "15" }}>
                  <GraduationCap className="h-5 w-5" style={{ color: CORAL }} />
                </div>
                <p className="font-bold text-base mb-1" style={{ color: CHARCOAL }}>{cert.title}</p>
                <p className="text-xs text-gray-500 mb-2">{cert.body}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: TEAL + "18", color: TEAL }}>
                  {cert.area}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: CORAL }}>Our Purpose</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: CHARCOAL }}>Mission &amp; Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl p-8 text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${CORAL}, #A83510)` }}>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(255,255,255,0.20)" }}>
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/85 leading-relaxed text-base">
                To shape Africa's workforce by connecting talented professionals — whether at home or in the diaspora — with employers who value them, while equipping institutions with the HR systems, leadership, and culture they need to grow with confidence.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl p-8 border-2 bg-white shadow-sm" style={{ borderColor: TEAL + "40" }}>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: TEAL + "12" }}>
                <Eye className="h-6 w-6" style={{ color: TEAL }} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: CHARCOAL }}>Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                To become Africa's most trusted bridge between people and opportunity — a continent-wide network where every professional finds work that fits their potential, and every institution finds the people who will define its future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20" style={{ backgroundColor: CREAM }}>
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: CORAL }}>Our Journey</p>
            <h2 className="text-3xl font-bold" style={{ color: CHARCOAL }}>Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ backgroundColor: CORAL + "30" }} />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex gap-6 items-start pl-4">
                  <div className="relative z-10 h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: CORAL }}>
                    {item.year.slice(2)}
                  </div>
                  <div className="bg-white rounded-xl p-4 flex-1 border" style={{ borderColor: "#F5E6D8" }}>
                    <span className="text-xs font-semibold" style={{ color: CORAL }}>{item.year}</span>
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: CORAL }}>Our Framework</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: CHARCOAL }}>Pillars of Bridgepath</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our comprehensive framework for institutional success and human capital excellence.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border hover:shadow-lg transition-shadow" style={{ borderColor: "#F5E6D8" }}>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: CORAL + "15" }}>
                  <span style={{ color: CORAL }}>{p.icon}</span>
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: CHARCOAL }}>{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20" style={{ background: `linear-gradient(135deg, ${CORAL}, #A83510)` }}>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-white/70">Why Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Bridgepath?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start p-5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-white" />
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4" style={{ color: CHARCOAL }}>Ready to Transform Your Organization?</h2>
          <p className="text-gray-500 mb-8">Schedule a free consultation and discover how Bridgepath Africa can revolutionize your people strategy.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link href="/#contact">
              <button className="px-8 py-3.5 font-semibold text-white rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center gap-2" style={{ backgroundColor: CORAL }}>
                Get in Touch <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/services">
              <button className="px-8 py-3.5 font-semibold rounded-xl border-2 hover:bg-orange-50 transition-all" style={{ color: CHARCOAL, borderColor: CHARCOAL + "40" }}>
                View Services
              </button>
            </Link>
          </div>
          <p className="text-xs text-gray-400">Email: <a href="mailto:support@bridgepathnetwork.com" className="underline hover:text-gray-600">support@bridgepathnetwork.com</a></p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

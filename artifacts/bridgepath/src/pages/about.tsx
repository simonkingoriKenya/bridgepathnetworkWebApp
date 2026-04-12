import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Linkedin, Quote, CheckCircle2, Target, Eye, Users, Award, Lightbulb, Handshake, ArrowRight } from "lucide-react";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

const PAMELA_FALLBACK =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=85";

function FounderPhoto() {
  const [src, setSrc] = useState("/pamela.png");
  return (
    <img
      src={src}
      onError={() => setSrc(PAMELA_FALLBACK)}
      alt="Pamela Kuma — Founder, Bridgepath Network"
      className="relative w-full max-w-xs mx-auto rounded-2xl object-cover shadow-2xl"
      style={{ aspectRatio: "3/4" }}
    />
  );
}

const timeline = [
  { year: "2008", event: "Bridgepath Network founded in Accra, Ghana with a focus on HR outsourcing." },
  { year: "2012", event: "Expanded into East Africa — launching operations in Kenya, Uganda, and Tanzania." },
  { year: "2015", event: "Launched our psychometric and talent assessment practice across 12 countries." },
  { year: "2018", event: "Reached 10,000 professionals placed and 100+ client companies." },
  { year: "2021", event: "Launched digital talent platform and AI-powered CV review tool." },
  { year: "2024", event: "Expanded to 45+ African countries with offices in 8 regional hubs." },
  { year: "2026", event: "Serving 150+ businesses and 20,000+ professionals across Africa and the diaspora." },
];

const pillars = [
  { icon: <Users className="h-6 w-6" />, title: "Talent Acquisition", desc: "We help define roles, train hiring teams, and improve interview processes to find the right people — not just fill vacancies." },
  { icon: <Handshake className="h-6 w-6" />, title: "Conflict Resolution & Staff Relations", desc: "We train teams to handle conflict and build trust, because most people quit due to poor manager relationships." },
  { icon: <Lightbulb className="h-6 w-6" />, title: "Staff Training & Development", desc: "Training assessments, workshops, and train-the-trainer programs that boost staff confidence, morale, and empowerment." },
  { icon: <Award className="h-6 w-6" />, title: "Organizational Excellence", desc: "Bringing HR and institutional processes together to create cultures of performance, inclusion, and sustainable growth." },
];

const whyUs = [
  { title: "African HR Expertise", desc: "15+ years of HR experience supporting institutions across Ghana, Nigeria, Kenya, South Africa, and other African countries." },
  { title: "Value-Aligned Partnership", desc: "We partner with organizations that prioritize diversity, inclusion, and excellence." },
  { title: "Flexible Service Delivery", desc: "In-person, virtual, and tailored consulting services to meet you where you are." },
  { title: "Proven Results", desc: "90%+ client satisfaction, measurable ROI on services, and significant staff retention improvements." },
];

const stats = [
  { value: "15+", label: "Years of Experience" },
  { value: "45+", label: "African Countries" },
  { value: "20k+", label: "People Impacted" },
  { value: "90%+", label: "Client Satisfaction" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative py-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #2a4066 100%)` }}>
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: GREEN }}>About Bridgepath Network</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Shaping People.<br />
              <span style={{ color: GREEN }}>Strengthening Institutions.</span>
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              Your roadmap to organizational excellence — through people-first HR solutions across Africa and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10" style={{ backgroundColor: GREEN }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-4xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs font-medium uppercase tracking-wider text-white/80">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row gap-14 items-start">
              <div className="md:w-2/5 shrink-0">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-3xl opacity-20" style={{ background: `linear-gradient(135deg, ${GREEN}, ${DARK})` }} />
                  <FounderPhoto />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[240px] rounded-xl p-3 text-white" style={{ backgroundColor: "rgba(26,35,64,0.92)" }}>
                    <p className="font-bold text-sm">Pamela Kuma</p>
                    <p className="text-xs text-gray-300">Founder & Global HR Director</p>
                    <a href="https://www.linkedin.com/in/pamela-kuma" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs mt-1.5 hover:opacity-80 transition-opacity" style={{ color: GREEN }}>
                      <Linkedin className="h-3 w-3" /> linkedin.com/in/pamela-kuma
                    </a>
                  </div>
                </div>
              </div>

              <div className="md:w-3/5 pt-4">
                <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: GREEN }}>About the Founder</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: DARK }}>Meet Pamela Kuma</h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-base">
                  Pamela Kuma is a seasoned HR professional with over 15 years of experience leading workforce development across African markets — spanning Media, Tech Startups, Fintech, and Gas & Energy sectors.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4 text-base">
                  Drawing from her global expertise and deep understanding of African talent markets, Pamela founded Bridgepath Network with a singular mission: to help organizations hire better, build strong teams, and create cultures of excellence — using global best practices combined with local insight.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 text-base">
                  Her work spans institutional HR transformation, executive recruitment, and capacity building for businesses and organizations across 45+ African countries.
                </p>

                <div className="flex items-start gap-3 p-5 rounded-xl" style={{ backgroundColor: DARK + "06", border: `1px solid ${GREEN}35` }}>
                  <Quote className="h-6 w-6 shrink-0 mt-0.5" style={{ color: GREEN }} />
                  <blockquote className="text-gray-700 italic leading-relaxed font-medium text-base">
                    "Every school has a mission — but it's the people who bring it to life. Let's invest in them."
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20" style={{ backgroundColor: "#f8faf5" }}>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Our Purpose</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: DARK }}>Mission &amp; Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl p-8 text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${DARK}, #2a4066)` }}>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: GREEN + "25" }}>
                <Target className="h-6 w-6" style={{ color: GREEN }} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed text-base">
                To be a trusted HR partner that helps people grow and workplaces improve — empowering organizations to hire better, build strong teams, and create cultures of excellence using global experience and local know-how.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl p-8 border-2 bg-white shadow-sm" style={{ borderColor: GREEN + "50" }}>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: GREEN + "15" }}>
                <Eye className="h-6 w-6" style={{ color: GREEN }} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: DARK }}>Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                To be Africa's most trusted HR partner — connecting the continent's extraordinary talent with the world's best opportunities, while strengthening the institutions that shape Africa's future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Our Journey</p>
            <h2 className="text-3xl font-bold" style={{ color: DARK }}>Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ backgroundColor: GREEN + "30" }} />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex gap-6 items-start pl-4">
                  <div className="relative z-10 h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: GREEN }}>
                    {item.year.slice(2)}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex-1 border border-gray-100">
                    <span className="text-xs font-semibold" style={{ color: GREEN }}>{item.year}</span>
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20" style={{ backgroundColor: "#f8faf5" }}>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Our Framework</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: DARK }}>Pillars of Bridgepath</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our comprehensive framework for institutional success and human capital excellence.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: GREEN + "15" }}>
                  <span style={{ color: GREEN }}>{p.icon}</span>
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: DARK }}>{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20" style={{ background: `linear-gradient(135deg, ${DARK}, #2a4066)` }}>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Why Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Bridgepath?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start p-5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: GREEN }} />
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4" style={{ color: DARK }}>Ready to Transform Your Organization?</h2>
          <p className="text-gray-500 mb-8">Schedule a free consultation and discover how Bridgepath Network can revolutionize your people strategy.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link href="/#contact">
              <button className="px-8 py-3.5 font-semibold text-white rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center gap-2" style={{ backgroundColor: GREEN }}>
                Get in Touch <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/services">
              <button className="px-8 py-3.5 font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all" style={{ color: DARK, borderColor: DARK + "40" }}>
                View Services
              </button>
            </Link>
          </div>
          <p className="text-xs text-gray-400">Email: <a href="mailto:pkumanyc@gmail.com" className="underline hover:text-gray-600">pkumanyc@gmail.com</a></p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

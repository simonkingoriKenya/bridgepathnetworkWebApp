import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Users, FileText, Briefcase, Globe, Award, BarChart3, UserCheck, Calculator, ArrowRight, Phone, Mail, TrendingUp, Shield, Clock, Star } from "lucide-react";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

const serviceData: Record<string, {
  icon: React.ReactNode;
  label: string;
  heroImg: string;
  tagline: string;
  description: string;
  benefits: string[];
  process: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  stats: { v: string; l: string }[];
}> = {
  "employment-of-record": {
    icon: <Users className="h-8 w-8" />,
    label: "Employment of Record",
    heroImg: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=85",
    tagline: "Hire anyone in Africa — without a local entity",
    description: "Our Employment of Record (EoR) service allows businesses to legally employ workers in African countries without establishing a local legal entity. BridgePath becomes the employer of record on paper, handling all local legal obligations including employment contracts, payroll, tax compliance, and statutory benefits — while your team member works exclusively for you.",
    benefits: [
      "Legally compliant employment in 45+ African countries",
      "No need to set up a local subsidiary or entity",
      "Full payroll processing in local currency",
      "Tax filings and statutory deductions handled",
      "Employment contracts drafted under local law",
      "Employee benefits administration",
      "HR support for local employee queries",
      "Fast onboarding — employees live in days",
    ],
    process: [
      { step: "01", title: "Consultation", desc: "We learn your hiring needs, country targets, and team structure." },
      { step: "02", title: "Contract Setup", desc: "We draft compliant employment contracts under local labor law." },
      { step: "03", title: "Onboarding", desc: "Employee is enrolled in local payroll and benefits systems." },
      { step: "04", title: "Ongoing Support", desc: "We handle payroll, compliance, and HR queries month by month." },
    ],
    faqs: [
      { q: "How fast can I hire?", a: "Typically within 5–10 business days from agreement sign-off." },
      { q: "Which countries are covered?", a: "We operate across 45+ African countries including Kenya, Nigeria, Ghana, South Africa, Uganda, Tanzania, Ethiopia, and more." },
      { q: "What happens if I want to end employment?", a: "We manage the offboarding process in compliance with local labor regulations, including severance where applicable." },
    ],
    stats: [
      { v: "45+", l: "Countries" },
      { v: "5–10", l: "Days to hire" },
      { v: "10k+", l: "Employees managed" },
      { v: "15+", l: "Years experience" },
    ],
  },
  "secondment-services": {
    icon: <UserCheck className="h-8 w-8" />,
    label: "Secondment Services",
    heroImg: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=85",
    tagline: "Flexible workforce deployment across borders",
    description: "Our Secondment Services facilitate the temporary transfer of employees from one organization to another while maintaining their original employment relationship. This is ideal for project-based assignments, knowledge transfer, or cross-company collaboration while ensuring full legal compliance.",
    benefits: [
      "Structured secondment agreements",
      "Defined terms and deliverables",
      "HR administration throughout",
      "Tax and immigration guidance",
      "Performance management support",
      "Flexible engagement durations",
      "Cross-border expertise",
      "Compliant worker classification",
    ],
    process: [
      { step: "01", title: "Agreement Design", desc: "Define terms, duration, roles, and deliverables for the secondment." },
      { step: "02", title: "Legal Documentation", desc: "Secondment agreements drafted and signed by all parties." },
      { step: "03", title: "Deployment", desc: "Employee transitions to client organization with ongoing HR support." },
      { step: "04", title: "Completion", desc: "Smooth return to original employer with knowledge transfer documented." },
    ],
    faqs: [
      { q: "How long can a secondment last?", a: "Typically 3 months to 2 years, depending on the project and local labor laws." },
      { q: "Who pays the employee during secondment?", a: "Arrangements vary — we can structure billing through the host organization or originating employer." },
      { q: "Does the employee keep their original benefits?", a: "Yes, the employee retains their original employment benefits and status." },
    ],
    stats: [
      { v: "200+", l: "Secondments managed" },
      { v: "12+", l: "Industries served" },
      { v: "30+", l: "Countries" },
      { v: "98%", l: "Completion rate" },
    ],
  },
  "expatriate-services": {
    icon: <Globe className="h-8 w-8" />,
    label: "Expatriate Services",
    heroImg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85",
    tagline: "Moving talent into Africa — done right",
    description: "BridgePath provides comprehensive support for companies relocating international employees to Africa, or moving African talent globally. Our expatriate services cover every aspect of the relocation lifecycle — from immigration and work permits to housing, schooling, and ongoing HR support.",
    benefits: [
      "Work permit and visa processing",
      "Immigration compliance management",
      "Relocation logistics support",
      "Housing and school search assistance",
      "Cost-of-living analysis and allowances",
      "Tax equalization planning",
      "Cultural integration support",
      "Repatriation planning",
    ],
    process: [
      { step: "01", title: "Pre-move Assessment", desc: "Analyse immigration requirements and cost-of-living factors." },
      { step: "02", title: "Documentation", desc: "Manage all permit and visa applications with local authorities." },
      { step: "03", title: "Relocation", desc: "Coordinate housing, schooling, banking, and settling-in support." },
      { step: "04", title: "Ongoing Support", desc: "Monitor permit renewals, tax obligations, and policy compliance." },
    ],
    faqs: [
      { q: "How long do work permits take?", a: "Processing times vary by country — typically 4–12 weeks. We start the process early to avoid delays." },
      { q: "Do you handle family members?", a: "Yes, we assist with dependent visas and help with schooling and settling-in services for families." },
      { q: "What is tax equalization?", a: "It ensures expatriates pay no more (or less) tax than they would at home, maintaining equity across international assignments." },
    ],
    stats: [
      { v: "500+", l: "Expats supported" },
      { v: "25+", l: "Countries" },
      { v: "4–12", l: "Weeks avg. permit time" },
      { v: "100%", l: "Compliance record" },
    ],
  },
  "hr-consultancy": {
    icon: <Briefcase className="h-8 w-8" />,
    label: "HR Consultancy",
    heroImg: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=85",
    tagline: "Strategic HR guidance for Africa's dynamic market",
    description: "Our HR Consultancy service delivers expert human resources advisory to organizations operating or expanding in Africa. Whether you need to design HR policies, restructure your people operations, or build a high-performance culture, our experienced consultants bring deep regional knowledge to every engagement.",
    benefits: [
      "HR policy and handbook development",
      "Organizational structure design",
      "Performance management systems",
      "Compensation and benefits benchmarking",
      "Culture and employee engagement programs",
      "HR technology selection and implementation",
      "Change management support",
      "Labour law and compliance advisory",
    ],
    process: [
      { step: "01", title: "Diagnostic", desc: "Assess your current HR function, gaps, and organizational objectives." },
      { step: "02", title: "Strategy Design", desc: "Build a tailored HR roadmap aligned to your business goals." },
      { step: "03", title: "Implementation", desc: "Work alongside your team to roll out policies and systems." },
      { step: "04", title: "Review", desc: "Measure outcomes and adjust for sustained improvement." },
    ],
    faqs: [
      { q: "Do you work with small companies?", a: "Yes. We work with startups, SMEs, and multinationals across all sectors." },
      { q: "Can you help with restructuring?", a: "Absolutely — organizational restructuring is one of our most requested services, including workforce planning and rightsizing." },
      { q: "How long does a consulting engagement last?", a: "From a few weeks for a targeted project to ongoing retainer engagements spanning years." },
    ],
    stats: [
      { v: "150+", l: "Clients served" },
      { v: "20+", l: "Industries" },
      { v: "15+", l: "Years experience" },
      { v: "4.9/5", l: "Client satisfaction" },
    ],
  },
  "payroll-tax": {
    icon: <Calculator className="h-8 w-8" />,
    label: "Payroll & Tax Administration",
    heroImg: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=1200&q=85",
    tagline: "Accurate, compliant payroll across Africa",
    description: "Managing payroll across multiple African countries is complex. Each country has its own tax codes, statutory deductions, and filing deadlines. BridgePath's Payroll & Tax Administration service handles all of this seamlessly — ensuring your employees are paid accurately and on time while you remain fully compliant.",
    benefits: [
      "Multi-country payroll processing",
      "Local currency and exchange rate management",
      "PAYE and income tax calculation",
      "Social security and pension deductions",
      "Statutory statutory filing and reporting",
      "Payslip generation and distribution",
      "Year-end tax certificates",
      "Real-time payroll reporting dashboard",
    ],
    process: [
      { step: "01", title: "Data Collection", desc: "Gather employee data, salary structures, and benefit details." },
      { step: "02", title: "Calculation", desc: "Process payroll per local tax laws and statutory requirements." },
      { step: "03", title: "Disbursement", desc: "Funds transferred to employees in local currency on time." },
      { step: "04", title: "Reporting", desc: "Monthly reports and statutory filings delivered to your team." },
    ],
    faqs: [
      { q: "Which currencies do you support?", a: "We process payroll in KES, NGN, GHS, ZAR, UGX, TZS, ETB, RWF, USD, EUR, and more." },
      { q: "What happens if tax laws change?", a: "Our compliance team monitors all legislative changes and updates your payroll automatically." },
      { q: "Can you integrate with our HRIS?", a: "Yes — we integrate with major HR systems including SAP, Workday, BambooHR, and others." },
    ],
    stats: [
      { v: "10k+", l: "Payslips monthly" },
      { v: "30+", l: "Currencies supported" },
      { v: "45+", l: "Countries" },
      { v: "99.9%", l: "Accuracy rate" },
    ],
  },
  "psychometric-assessments": {
    icon: <BarChart3 className="h-8 w-8" />,
    label: "Psychometric Assessments",
    heroImg: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=85",
    tagline: "Hire the right people, every time",
    description: "Our psychometric assessment services use scientifically validated tools to evaluate candidates' cognitive abilities, personality traits, and leadership potential. These insights help employers make informed, objective hiring decisions — reducing turnover and improving team performance.",
    benefits: [
      "Cognitive ability and reasoning tests",
      "Big Five personality profiling",
      "Emotional intelligence assessments",
      "Leadership potential indicators",
      "Team dynamics and compatibility analysis",
      "Role-fit benchmarking",
      "Detailed candidate reports",
      "Expert debriefs and coaching",
    ],
    process: [
      { step: "01", title: "Brief", desc: "Define the role, competency framework, and assessment objectives." },
      { step: "02", title: "Assessment", desc: "Candidates complete validated online assessments at their convenience." },
      { step: "03", title: "Analysis", desc: "Our psychologists interpret results against role benchmarks." },
      { step: "04", title: "Report", desc: "Detailed candidate reports and hiring recommendations delivered." },
    ],
    faqs: [
      { q: "How long do assessments take?", a: "Most assessments take 60–90 minutes and can be completed remotely." },
      { q: "Are the tools validated for African populations?", a: "Yes — we use tools that have been normed and validated for African demographic groups." },
      { q: "Can assessments be used for internal promotions?", a: "Absolutely — psychometrics are equally powerful for succession planning and leadership development." },
    ],
    stats: [
      { v: "5k+", l: "Assessments conducted" },
      { v: "35+", l: "Validated tools" },
      { v: "92%", l: "Hiring accuracy" },
      { v: "60–90", l: "Minutes per test" },
    ],
  },
  "recruitment-services": {
    icon: <FileText className="h-8 w-8" />,
    label: "Recruitment Services",
    heroImg: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=85",
    tagline: "Africa's top talent, delivered to your door",
    description: "BridgePath's Recruitment Services offer end-to-end talent acquisition — from executive search for C-suite roles to high-volume recruitment for operational positions. Our sector specialists and continent-wide networks ensure we find the best candidates faster than any traditional agency.",
    benefits: [
      "Executive and C-suite search",
      "Mid-level and specialist recruitment",
      "High-volume / mass recruitment",
      "Headhunting and talent mapping",
      "Candidate screening and shortlisting",
      "Structured interview design",
      "Background and reference checking",
      "Offer management and onboarding",
    ],
    process: [
      { step: "01", title: "Brief & Research", desc: "Deep dive into the role, team culture, and talent market." },
      { step: "02", title: "Sourcing", desc: "Tap our database, LinkedIn, referrals, and African talent networks." },
      { step: "03", title: "Assessment", desc: "Screen, interview, and shortlist the best-fit candidates." },
      { step: "04", title: "Placement", desc: "Manage offers, negotiations, and post-placement follow-up." },
    ],
    faqs: [
      { q: "What sectors do you specialize in?", a: "Technology, finance, FMCG, healthcare, NGO, manufacturing, logistics, and telecoms — among others." },
      { q: "How long does a search take?", a: "Executive searches typically take 4–8 weeks. Volume recruitment can be faster with dedicated teams." },
      { q: "What is your placement guarantee?", a: "We offer a 3–6 month replacement guarantee on all permanent placements." },
    ],
    stats: [
      { v: "2k+", l: "Placements made" },
      { v: "4–8", l: "Weeks avg. search" },
      { v: "95%", l: "Offer acceptance rate" },
      { v: "6mo", l: "Replacement guarantee" },
    ],
  },
  "staff-outsourcing": {
    icon: <Users className="h-8 w-8" />,
    label: "Staff Outsourcing",
    heroImg: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1200&q=85",
    tagline: "Your workforce, our responsibility",
    description: "Staff Outsourcing allows you to delegate the management of specific workforce functions to BridgePath. We become the employer of your outsourced staff, handling all HR, payroll, compliance, and benefits — while your team focuses on their day-to-day output for your business.",
    benefits: [
      "Significant cost reduction vs. direct employment",
      "Transfer of employment risk and liability",
      "Full HR administration handled",
      "Access to BridgePath's benefits schemes",
      "Scalable up or down based on demand",
      "Performance management support",
      "Disciplinary process management",
      "Regular workforce reporting",
    ],
    process: [
      { step: "01", title: "Scope Definition", desc: "Agree on the scope of outsourced functions and team size." },
      { step: "02", title: "Transition", desc: "Employees transferred to BridgePath payroll with zero disruption." },
      { step: "03", title: "Management", desc: "We manage all HR administration; staff work exclusively for you." },
      { step: "04", title: "Reporting", desc: "Monthly workforce reports and cost summaries provided." },
    ],
    faqs: [
      { q: "Does the team still work for us?", a: "Yes — day-to-day direction comes from you. We simply handle the employer administrative obligations." },
      { q: "Can we scale the team?", a: "Absolutely — adding or removing headcount is managed seamlessly by BridgePath." },
      { q: "What sectors do you outsource in?", a: "Banking, FMCG, retail, logistics, hospitality, telecoms, and many others." },
    ],
    stats: [
      { v: "5k+", l: "Outsourced staff" },
      { v: "20+", l: "Sectors" },
      { v: "30%", l: "Avg. cost saving" },
      { v: "45+", l: "Countries" },
    ],
  },
  "interim-management": {
    icon: <Award className="h-8 w-8" />,
    label: "Interim Management",
    heroImg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=85",
    tagline: "Senior leadership, when you need it most",
    description: "Interim Management provides organizations with experienced senior executives on a temporary basis — for crisis management, leadership gaps, major transitions, or strategic projects. BridgePath's network of battle-tested African executives can step in and deliver results quickly.",
    benefits: [
      "C-suite and senior leadership roles covered",
      "Rapid deployment within 2–4 weeks",
      "Africa-experienced executives",
      "Objective, fresh perspectives",
      "Defined deliverables and exit criteria",
      "Knowledge transfer to permanent team",
      "Stakeholder management expertise",
      "Flexible engagement terms",
    ],
    process: [
      { step: "01", title: "Needs Analysis", desc: "Define the interim brief, deliverables, and duration." },
      { step: "02", title: "Shortlisting", desc: "Match from our vetted pool of African senior executives." },
      { step: "03", title: "Deployment", desc: "Interim manager onboarded and integrated into your team." },
      { step: "04", title: "Handover", desc: "Structured exit with knowledge transfer and succession briefing." },
    ],
    faqs: [
      { q: "How quickly can an interim start?", a: "Most of our interim managers can be deployed within 2–4 weeks of brief confirmation." },
      { q: "What levels do you cover?", a: "CEO, CFO, CHRO, COO, CTO, Country Manager, and other senior director roles." },
      { q: "Can an interim become permanent?", a: "Yes — many of our interim assignments convert to permanent appointments after a successful engagement." },
    ],
    stats: [
      { v: "100+", l: "Interim executives" },
      { v: "2–4", l: "Weeks to deploy" },
      { v: "C-suite", l: "Level coverage" },
      { v: "40+", l: "Industries" },
    ],
  },
};

export default function ServiceDetail() {
  const [match, params] = useRoute("/services/:slug");
  const slug = params?.slug || "";
  const service = serviceData[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Service not found</h2>
          <Link href="/services">
            <button className="px-6 py-3 font-semibold text-white rounded-xl" style={{ backgroundColor: GREEN }}>
              View All Services
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="relative min-h-[420px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${service.heroImg}')` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,35,64,0.96) 0%, rgba(26,35,64,0.55) 60%, rgba(26,35,64,0.25) 100%)" }} />
        <div className="relative z-10 container mx-auto px-4 md:px-8 pb-12 pt-24">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-5 transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Services
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: GREEN }}>
              <div className="text-white">{service.icon}</div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: GREEN }}>BridgePath Service</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{service.label}</h1>
            </div>
          </div>
          <p className="text-xl text-gray-200 max-w-2xl">{service.tagline}</p>
        </div>
      </section>

      <section className="py-8" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {service.stats.map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-bold text-white">{s.v}</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold mb-5" style={{ color: DARK }}>About this service</h2>
              <p className="text-gray-600 leading-relaxed text-base mb-8">{service.description}</p>
              <Link href="/#contact">
                <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: GREEN }}>
                  Request a Consultation <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold mb-5" style={{ color: DARK }}>What's included</h2>
              <ul className="space-y-3">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: GREEN }} />
                    <span className="text-gray-700 text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: DARK }}>How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {service.process.map((p, i) => (
              <motion.div
                key={p.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="h-12 w-12 rounded-full text-white font-bold text-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: GREEN }}>
                  {p.step}
                </div>
                <h3 className="font-bold mb-2 text-sm" style={{ color: DARK }}>{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: DARK }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started with {service.label}?</h2>
          <p className="text-gray-400 mb-8">Our team will respond within 24 hours to discuss your specific needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@bridgepath.africa" className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-xl border border-white/20 hover:bg-white/10 transition-colors">
              <Mail className="h-4 w-4" /> Email Us
            </a>
            <a href="tel:+254700000000" className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: GREEN }}>
              <Phone className="h-4 w-4" /> Call Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

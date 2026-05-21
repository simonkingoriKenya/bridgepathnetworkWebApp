import { Link } from "wouter";
import { Twitter, Linkedin, Facebook, Youtube, Mail, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

const CORAL = "#D94F20";
const GOLD = "#F0A820";
const DARK = "#18110C";
const BORDER = "rgba(255,255,255,0.08)";

const serviceLinks = [
  { label: "Employment of Record", href: "/services/employment-of-record" },
  { label: "HR Consultancy", href: "/services/hr-consultancy" },
  { label: "Recruitment Services", href: "/services/recruitment-services" },
  { label: "Payroll & Tax Admin", href: "/services/payroll-tax" },
  { label: "Psychometric Assessments", href: "/services/psychometric-assessments" },
  { label: "Staff Outsourcing", href: "/services/staff-outsourcing" },
];

const publicQuickLinks = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "All Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Insights & News", href: "/blog" },
];

const regions = [
  { label: "West Africa", countries: "Ghana · Nigeria · Senegal · Ivory Coast" },
  { label: "East Africa", countries: "Kenya · Uganda · Tanzania · Rwanda · Ethiopia" },
  { label: "Southern Africa", countries: "South Africa · Zambia · Zimbabwe" },
  { label: "Central Africa", countries: "DRC · Cameroon · and more" },
];

export function Footer() {
  const { isAuthenticated, user } = useAuth();
  const quickLinks = [
    ...publicQuickLinks,
    {
      label: "AI CV Review",
      href: !isAuthenticated
        ? "/auth/signup?role=job_seeker"
        : user?.role === "job_seeker"
          ? "/cv-review"
          : "/dashboard/employer",
    },
  ];

  return (
    <footer style={{ backgroundColor: DARK }} className="text-gray-400">

      {/* TOP GRID */}
      <div style={{ borderBottom: `1px solid ${BORDER}` }} className="grid grid-cols-1 md:grid-cols-4">

        {/* Col 1 – Brand */}
        <div className="p-8 md:p-10 flex flex-col gap-5" style={{ borderRight: `1px solid ${BORDER}` }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CORAL }}>
              <img src="/logo-new.png" alt="Bridgepath Africa" className="h-7 w-7 object-contain" />
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span className="font-bold text-base tracking-tight text-white">
                Bridgepath<span style={{ color: CORAL }}> Africa</span>
              </span>
              <span className="text-[10px] italic" style={{ color: "rgba(255,255,255,0.35)" }}>Shaping People. Strengthening Institutions.</span>
            </div>
          </Link>

          <p className="text-xs leading-relaxed text-gray-500 max-w-[200px]">
            A people-first HR and talent platform built on 20+ years of African workforce experience, launching from Ghana and Kenya.
          </p>

          <div className="flex items-center gap-2.5 pt-1">
            {[
              { icon: <Twitter className="h-3.5 w-3.5" />, href: "https://twitter.com" },
              { icon: <Facebook className="h-3.5 w-3.5" />, href: "https://facebook.com" },
              { icon: <Linkedin className="h-3.5 w-3.5" />, href: "https://linkedin.com" },
              { icon: <Youtube className="h-3.5 w-3.5" />, href: "https://youtube.com" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                className="h-7 w-7 flex items-center justify-center rounded-lg border transition-colors hover:text-white hover:border-white/25"
                style={{ borderColor: BORDER }}>
                {s.icon}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-4 space-y-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <a href="mailto:support@bridgepathnetwork.com" className="flex items-center gap-2 text-xs hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: CORAL }} />
              support@bridgepathnetwork.com
            </a>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: CORAL }} />
              Accra, Ghana (HQ)
            </div>
          </div>
        </div>

        {/* Col 2 – Services */}
        <div className="p-8 md:p-10 flex flex-col gap-5" style={{ borderRight: `1px solid ${BORDER}` }}>
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Our Services</h4>
          <nav aria-label="HR services">
            <ul className="space-y-3">
              {serviceLinks.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-xs text-gray-500 hover:text-white transition-colors">{s.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Col 3 – Quick Links */}
        <div className="p-8 md:p-10 flex flex-col gap-5" style={{ borderRight: `1px solid ${BORDER}` }}>
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Quick Links</h4>
          <nav aria-label="Site links">
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-gray-500 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Col 4 – Pan-African Reach */}
        <div className="p-8 md:p-10 flex flex-col gap-5">
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Pan-African Reach</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            We support hiring and HR operations across all major regions of Africa — with local expertise that makes the difference.
          </p>
          <ul className="space-y-3.5 mt-1">
            {regions.map((r) => (
              <li key={r.label}>
                <div className="text-xs font-semibold text-gray-300 mb-0.5">{r.label}</div>
                <div className="text-xs text-gray-600">{r.countries}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: `1px solid ${BORDER}` }}>

        {/* CTA box */}
        <div className="p-8 md:p-10 flex flex-col justify-between gap-6 relative overflow-hidden" style={{ borderRight: `1px solid ${BORDER}` }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${CORAL}20 0%, transparent 70%)` }} />
          <div className="relative z-10">
            <h3 className="text-white font-bold text-lg mb-3">The bottom line</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              With Bridgepath Africa, you get focused launch access in Ghana and Kenya, practical HR guidance, and a dedicated team building toward a pan-African future.
            </p>
          </div>
          <Link href="/auth/signup" className="relative z-10">
            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl border transition-all hover:opacity-90"
              style={{ borderColor: CORAL, backgroundColor: CORAL + "25" }}>
              Get started <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {/* Insights */}
        <div className="p-8 md:p-10 flex flex-col gap-5" style={{ borderRight: `1px solid ${BORDER}` }}>
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Insights</h4>
          <ul className="space-y-4">
            {[
              "Hiring across Africa: What global companies need to know",
              "Employment of Record vs. Direct Hire — which is right for you?",
              "Top talent hubs in West Africa for tech and finance",
            ].map((title) => (
              <li key={title}>
                <Link href="/blog" className="text-xs text-gray-500 hover:text-white transition-colors leading-relaxed block">{title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get In Touch */}
        <div className="p-8 md:p-10 flex flex-col gap-5">
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Get in Touch</h4>
          <ul className="space-y-4">
            {[
              { label: "Post a Job", href: "/auth/signup?role=employer" },
              { label: "Find Talent", href: "/auth/signup?role=employer" },
              { label: "HR Outsourcing", href: "/services" },
              { label: "Contact Us", href: "/#contact" },
              { label: "Partnership Enquiry", href: "/#contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-xs text-gray-500 hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-8 md:px-10 py-5">
        <p className="text-xs text-gray-700">© {new Date().getFullYear()} Bridgepath Africa. All rights reserved.</p>
        <div className="flex gap-6 text-xs">
          <Link href="/privacy" className="text-gray-700 hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-700 hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="text-gray-700 hover:text-gray-400 transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}

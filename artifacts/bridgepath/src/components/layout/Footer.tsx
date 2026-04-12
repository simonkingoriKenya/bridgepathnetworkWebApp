import { Link } from "wouter";
import { Twitter, Linkedin, Facebook, Youtube, Mail, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

const GREEN = "#8CC63F";
const DARK = "#111814";
const BORDER = "rgba(255,255,255,0.09)";

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

      {/* ── TOP GRID: 4 columns separated by lines ── */}
      <div
        style={{ borderBottom: `1px solid ${BORDER}` }}
        className="grid grid-cols-1 md:grid-cols-4"
      >
        {/* Col 1 – Brand */}
        <div
          className="p-8 md:p-10 flex flex-col gap-5"
          style={{ borderRight: `1px solid ${BORDER}` }}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Bridgepath Network" className="h-8 w-8 object-contain" />
            <span className="font-bold text-lg text-white tracking-tight">
              Bridgepath<span style={{ color: GREEN }}>Network</span>
            </span>
          </Link>

          <p className="text-xs leading-relaxed text-gray-500 max-w-[200px]">
            A people-first HR and talent platform launching from Ghana and Kenya, built on 15+ years of African workforce experience.
          </p>

          <div className="flex items-center gap-3 pt-1">
            {[
              { icon: <Twitter className="h-3.5 w-3.5" />, href: "https://twitter.com" },
              { icon: <Facebook className="h-3.5 w-3.5" />, href: "https://facebook.com" },
              { icon: <Linkedin className="h-3.5 w-3.5" />, href: "https://linkedin.com" },
              { icon: <Youtube className="h-3.5 w-3.5" />, href: "https://youtube.com" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 flex items-center justify-center rounded border transition-colors hover:text-white hover:border-white/30"
                style={{ borderColor: BORDER }}
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-4 space-y-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <a href="mailto:info@bridgepathnetwork.com" className="flex items-center gap-2 text-xs hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
              info@bridgepathnetwork.com
            </a>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
              Accra, Ghana (HQ)
            </div>
          </div>
        </div>

        {/* Col 2 – Our Services */}
        <div
          className="p-8 md:p-10 flex flex-col gap-5"
          style={{ borderRight: `1px solid ${BORDER}` }}
        >
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Our Services</h4>
          <ul className="space-y-3">
            {serviceLinks.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 – Quick Links */}
        <div
          className="p-8 md:p-10 flex flex-col gap-5"
          style={{ borderRight: `1px solid ${BORDER}` }}
        >
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 – Pan-African Footprint */}
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

      {/* ── BOTTOM GRID: 3 columns ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        {/* Col 1 – CTA highlight box */}
        <div
          className="p-8 md:p-10 flex flex-col justify-between gap-6 relative overflow-hidden"
          style={{
            borderRight: `1px solid ${BORDER}`,
            background: "linear-gradient(135deg, #1a3a1a 0%, #1c2d1c 40%, #0d1f0d 100%)",
          }}
        >
          {/* Subtle green glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, ${GREEN}18 0%, transparent 70%)`,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-white font-bold text-lg mb-3">The Bottom Line</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              With BridgePath, you get focused launch access in Ghana and Kenya, practical HR guidance, and a dedicated team building toward pan-African reach.
            </p>
          </div>
          <Link href="/auth/signup" className="relative z-10">
            <button
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg border transition-all hover:opacity-90"
              style={{ borderColor: GREEN, backgroundColor: GREEN + "22" }}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {/* Col 2 – Insights */}
        <div
          className="p-8 md:p-10 flex flex-col gap-5"
          style={{ borderRight: `1px solid ${BORDER}` }}
        >
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Insights</h4>
          <ul className="space-y-4">
            {[
              "Hiring across Africa: What global companies need to know",
              "Employment of Record vs. Direct Hire — which is right for you?",
              "Top talent hubs in West Africa for tech and finance",
            ].map((title) => (
              <li key={title}>
                <Link href="/blog" className="text-xs text-gray-500 hover:text-white transition-colors leading-relaxed block">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 – Sign Up / Contact */}
        <div className="p-8 md:p-10 flex flex-col gap-5">
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">Get In Touch</h4>
          <ul className="space-y-4">
            {[
              { label: "Post a Job", href: "/auth/signup?role=employer" },
              { label: "Find Talent", href: "/auth/signup?role=employer" },
              { label: "HR Outsourcing", href: "/services" },
              { label: "Contact Us", href: "/#contact" },
              { label: "Partnership", href: "/#contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-xs text-gray-500 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── COPYRIGHT BAR ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-8 md:px-10 py-5">
        <p className="text-xs text-gray-700">
          © {new Date().getFullYear()} Bridgepath Network. All Rights Reserved.
        </p>
        <div className="flex gap-6 text-xs">
          <Link href="/privacy" className="text-gray-700 hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-700 hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="text-gray-700 hover:text-gray-400 transition-colors">Cookie Policy</Link>
        </div>
      </div>

    </footer>
  );
}

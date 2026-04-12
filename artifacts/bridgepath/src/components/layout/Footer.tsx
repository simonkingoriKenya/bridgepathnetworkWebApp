import { Link } from "wouter";
import { Twitter, Linkedin, Facebook, Youtube, Mail, MapPin } from "lucide-react";

const GREEN = "#8CC63F";
const DARK = "#1a1a1a";
const logoImg = "/logo.svg";

const countries = [
  "Ghana", "Kenya", "Nigeria", "Tanzania", "Uganda",
  "Rwanda", "Ethiopia", "South Africa", "Senegal",
  "Zambia", "Zimbabwe", "Ivory Coast",
];

const serviceLinks = [
  { label: "Employment of Record", href: "/services/employment-of-record" },
  { label: "HR Consultancy", href: "/services/hr-consultancy" },
  { label: "Recruitment Services", href: "/services/recruitment-services" },
  { label: "Payroll & Tax Admin", href: "/services/payroll-tax" },
  { label: "Psychometric Assessments", href: "/services/psychometric-assessments" },
  { label: "Staff Outsourcing", href: "/services/staff-outsourcing" },
  { label: "Interim Management", href: "/services/interim-management" },
  { label: "Secondment Services", href: "/services/secondment-services" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: DARK }} className="text-gray-400">
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          <div className="space-y-5 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <img src={logoImg} alt="Bridgepath Network" className="h-9 w-9 object-contain" />
              <span className="font-bold text-xl text-white">
                Bridgepath<span style={{ color: GREEN }}>Network</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Africa's premier HR solutions and talent marketplace. Connecting people and businesses across 45+ countries since 2008.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-2.5 text-sm">
              {serviceLinks.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-white transition-colors text-gray-400 hover:underline">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Find Jobs", href: "/jobs" },
                { label: "All Services", href: "/services" },
                { label: "About Us", href: "/about" },
                { label: "Insights & News", href: "/blog" },
                { label: "AI CV Review", href: "/cv-review" },
                { label: "Sign Up", href: "/auth/signup" },
                { label: "Sign In", href: "/auth/login" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Countries We Serve</h4>
            <ul className="space-y-2 text-sm columns-2">
              {countries.map((c) => (
                <li key={c} className="text-gray-400 hover:text-white transition-colors cursor-pointer">{c}</li>
              ))}
            </ul>
            <div className="pt-4 space-y-3 border-t border-gray-800">
              <a href="mailto:info@bridgepathnetwork.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail className="h-4 w-4 shrink-0" style={{ color: GREEN }} />
                info@bridgepathnetwork.com
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: GREEN }} />
                Accra, Ghana (Headquarters)
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Bridgepath Network. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-gray-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

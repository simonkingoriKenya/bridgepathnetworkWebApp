import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LogOut, User as UserIcon, Mail, Menu, X, ChevronDown, LayoutDashboard,
  Briefcase, Search, FileText, Building2, Users, Sparkles
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

const professionalLinks = [
  { href: "/jobs", icon: <Search className="h-4 w-4" />, label: "Browse Jobs", desc: "Find opportunities across Africa" },
  { href: "/cv-review", icon: <Sparkles className="h-4 w-4" />, label: "AI CV Review", desc: "Get expert feedback on your CV" },
  { href: "/auth/signup", icon: <FileText className="h-4 w-4" />, label: "Create Profile", desc: "Join the talent network" },
];

const employerLinks = [
  { href: "/employers", icon: <Building2 className="h-4 w-4" />, label: "Post a Job", desc: "Reach top African talent" },
  { href: "/candidates", icon: <Users className="h-4 w-4" />, label: "Browse Candidates", desc: "Search pre-screened profiles" },
  { href: "/services", icon: <Briefcase className="h-4 w-4" />, label: "HR Services", desc: "EOR, payroll, outsourcing & more" },
];

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="w-full">
      {/* Top bar */}
      <div style={{ backgroundColor: DARK }} className="py-2 hidden md:block">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="font-medium text-gray-300">Bridgepath Network</span>
            <span className="text-gray-600">·</span>
            <span>Accra, Ghana HQ</span>
            <span className="text-gray-600">·</span>
            <a href="mailto:info@bridgepathnetwork.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="h-3 w-3" /> info@bridgepathnetwork.com
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: GREEN + "25", color: GREEN }}>
              Now accepting early access — Ghana &amp; Kenya
            </span>
            <Link href="/auth/signup" className="text-xs font-semibold hover:text-white transition-colors" style={{ color: GREEN }}>
              Join the network →
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${scrolled ? "shadow-md border-b border-gray-100" : "border-b border-gray-100"}`}>
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.svg" alt="Bridgepath Network" className="h-9 w-9 object-contain shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-2xl tracking-tight" style={{ color: DARK }}>
                Bridgepath<span style={{ color: GREEN }}>Network</span>
              </span>
              <span className="text-[9px] sm:text-[10px] italic text-gray-400 font-light tracking-tight mt-0.5">
                Shaping People. Strengthening Institutions.
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">

            {/* For Professionals dropdown */}
            <div className="relative" onMouseEnter={() => setProfOpen(true)} onMouseLeave={() => setProfOpen(false)}>
              <button
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded transition-colors hover:text-green-600"
                style={{ color: location === "/jobs" || location === "/cv-review" ? GREEN : "#444444" }}
              >
                <Search className="h-3.5 w-3.5" />
                For Professionals
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${profOpen ? "rotate-180" : ""}`} />
              </button>
              {profOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50">
                  <div className="px-4 pb-2 mb-1 border-b border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GREEN }}>Job Seekers &amp; Professionals</p>
                  </div>
                  {professionalLinks.map((l) => (
                    <Link key={l.href} href={l.href}>
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-green-50 transition-colors cursor-pointer group">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: GREEN + "15", color: GREEN }}>
                          {l.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700">{l.label}</p>
                          <p className="text-xs text-gray-500">{l.desc}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* For Employers dropdown */}
            <div className="relative" onMouseEnter={() => setEmpOpen(true)} onMouseLeave={() => setEmpOpen(false)}>
              <button
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded transition-colors hover:text-green-600"
                style={{ color: location === "/employers" || location === "/candidates" ? GREEN : "#444444" }}
              >
                <Building2 className="h-3.5 w-3.5" />
                For Employers
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${empOpen ? "rotate-180" : ""}`} />
              </button>
              {empOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50">
                  <div className="px-4 pb-2 mb-1 border-b border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: DARK }}>Hire &amp; Grow Your Team</p>
                  </div>
                  {employerLinks.map((l) => (
                    <Link key={l.href} href={l.href}>
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: DARK + "12", color: DARK }}>
                          {l.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">{l.label}</p>
                          <p className="text-xs text-gray-500">{l.desc}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-2 px-4 pb-1">
                    <Link href="/auth/signup?role=employer" className="text-xs font-semibold hover:underline" style={{ color: GREEN }}>
                      Create employer account →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Static links */}
            {[
              { href: "/about", label: "About" },
              { href: "/blog", label: "Insights" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:text-green-600"
                style={{ color: location.startsWith(link.href) ? GREEN : "#444444" }}>
                {link.label}
              </Link>
            ))}

            <a href="#contact"
              className="px-4 py-2 text-sm font-medium rounded transition-colors hover:text-green-600"
              style={{ color: "#444444" }}>
              Contact
            </a>
          </div>

          {/* Auth buttons / user menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-green-300 transition-colors">
                    <Avatar className="h-7 w-7">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <AvatarFallback style={{ backgroundColor: GREEN + "20", color: GREEN, fontSize: "11px" }}>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-3 border-b">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-wide mt-1 inline-block px-2 py-0.5 rounded-full" style={{ backgroundColor: GREEN + "20", color: GREEN }}>
                      {user.role === "employer" ? "Employer" : "Professional"}
                    </span>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"} className="cursor-pointer flex items-center w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" /><span>My Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center w-full">
                      <UserIcon className="mr-2 h-4 w-4" /><span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /><span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hidden sm:block" style={{ color: DARK }}>Sign In</button>
                </Link>
                <Link href="/auth/signup">
                  <button className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 shadow-sm" style={{ backgroundColor: GREEN }}>Get Started</button>
                </Link>
              </>
            )}
            <button className="md:hidden ml-1 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-widest px-2 pt-1 pb-2" style={{ color: GREEN }}>For Professionals</p>
            <Link href="/jobs" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-green-700 rounded-lg hover:bg-green-50">
              <Search className="h-4 w-4" /> Browse Jobs
            </Link>
            <Link href="/cv-review" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-green-700 rounded-lg hover:bg-green-50">
              <Sparkles className="h-4 w-4" /> AI CV Review
            </Link>

            <div className="border-t border-gray-100 pt-2 mt-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest px-2 pt-1 pb-2" style={{ color: DARK }}>For Employers</p>
            <Link href="/employers" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50">
              <Building2 className="h-4 w-4" /> Post a Job / Hire Talent
            </Link>
            <Link href="/candidates" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50">
              <Users className="h-4 w-4" /> Browse Candidates
            </Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50">
              <Briefcase className="h-4 w-4" /> HR Services
            </Link>

            <div className="border-t border-gray-100 pt-2 mt-2" />
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">About</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">Insights</Link>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">Contact</a>

            {isAuthenticated && user && (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link href={user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"} onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">My Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2.5 px-2 text-sm font-medium text-red-500 w-full text-left">Log out</button>
              </div>
            )}
            {!isAuthenticated && (
              <div className="border-t border-gray-100 pt-3 mt-2 flex gap-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <button className="w-full py-2.5 text-sm font-medium border border-gray-200 rounded-lg" style={{ color: DARK }}>Sign In</button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                  <button className="w-full py-2.5 text-sm font-semibold text-white rounded-lg" style={{ backgroundColor: GREEN }}>Get Started</button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

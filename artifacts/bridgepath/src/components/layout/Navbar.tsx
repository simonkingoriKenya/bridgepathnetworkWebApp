import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LogOut, User as UserIcon, Mail, Menu, X, ChevronDown, LayoutDashboard,
  Briefcase, Search, FileText, Building2, Users, Sparkles
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const CORAL = "#C8461A";
const GOLD = "#E8962A";
const CHARCOAL = "#1C1917";

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
      {/* Top bar — warm cream */}
      <div className="py-2 hidden md:block" style={{ backgroundColor: "#FFF8F2", borderBottom: "1px solid #F5E6D8" }}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs" style={{ color: "#78614E" }}>
            <span className="font-semibold" style={{ color: CHARCOAL }}>BridgePath Africa</span>
            <span style={{ color: "#D4B8A0" }}>·</span>
            <span>Accra, Ghana HQ</span>
            <span style={{ color: "#D4B8A0" }}>·</span>
            <a href="mailto:pkumanyc@gmail.com" className="flex items-center gap-1.5 transition-colors hover:opacity-70">
              <Mail className="h-3 w-3" /> pkumanyc@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: CORAL + "18", color: CORAL, border: `1px solid ${CORAL}30` }}>
              Now accepting early access — Ghana &amp; Kenya
            </span>
            <Link href="/auth/signup" className="text-xs font-semibold transition-colors hover:opacity-70" style={{ color: CORAL }}>
              Join the network →
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${scrolled ? "shadow-md border-b border-orange-50" : "border-b border-orange-50/60"}`}>
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
              <img src="/logo-bridgepath.png" alt="BridgePath Africa" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="font-extrabold text-[17px] tracking-tight leading-none">
                <span style={{ color: CHARCOAL }}>BridgePath</span><span style={{ color: CORAL }}> Africa</span>
              </div>
              <span className="text-[9px] font-medium tracking-[0.08em] uppercase mt-0.5" style={{ color: "#A08060" }}>
                Global Talent. African Opportunity.
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">

            {/* Home link */}
            <Link href="/"
              className="px-4 py-2 text-sm font-medium rounded transition-colors"
              style={{ color: "#555555" }}>
              Home
            </Link>

            {/* For Professionals dropdown */}
            <div className="relative" onMouseEnter={() => setProfOpen(true)} onMouseLeave={() => setProfOpen(false)}>
              <button
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded transition-colors"
                style={{ color: location === "/jobs" || location === "/cv-review" ? CORAL : "#555555" }}
              >
                <Search className="h-3.5 w-3.5" />
                For Professionals
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${profOpen ? "rotate-180" : ""}`} />
              </button>
              {profOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl py-3 z-50" style={{ border: "1px solid #F5E6D8" }}>
                  <div className="px-4 pb-2 mb-1" style={{ borderBottom: "1px solid #F5E6D8" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: CORAL }}>Job Seekers &amp; Professionals</p>
                  </div>
                  {professionalLinks.map((l) => (
                    <Link key={l.href} href={l.href}>
                      <div className="flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer group hover:bg-orange-50">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: CORAL + "15", color: CORAL }}>
                          {l.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-700">{l.label}</p>
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
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded transition-colors"
                style={{ color: location === "/employers" || location === "/candidates" ? CORAL : "#555555" }}
              >
                <Building2 className="h-3.5 w-3.5" />
                For Employers
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${empOpen ? "rotate-180" : ""}`} />
              </button>
              {empOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl py-3 z-50" style={{ border: "1px solid #F5E6D8" }}>
                  <div className="px-4 pb-2 mb-1" style={{ borderBottom: "1px solid #F5E6D8" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: CHARCOAL }}>Hire &amp; Grow Your Team</p>
                  </div>
                  {employerLinks.map((l) => (
                    <Link key={l.href} href={l.href}>
                      <div className="flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer group hover:bg-orange-50">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: CHARCOAL + "12", color: CHARCOAL }}>
                          {l.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">{l.label}</p>
                          <p className="text-xs text-gray-500">{l.desc}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-2 px-4 pb-1 mt-1" style={{ borderTop: "1px solid #F5E6D8" }}>
                    <Link href="/auth/signup?role=employer" className="text-xs font-semibold hover:underline" style={{ color: CORAL }}>
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
                className="px-4 py-2 text-sm font-medium rounded transition-colors"
                style={{ color: location.startsWith(link.href) ? CORAL : "#555555" }}>
                {link.label}
              </Link>
            ))}

            <a href="#contact"
              className="px-4 py-2 text-sm font-medium rounded transition-colors"
              style={{ color: "#555555" }}>
              Contact
            </a>
          </div>

          {/* Auth buttons / user menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-100 hover:border-orange-300 transition-colors">
                    <Avatar className="h-7 w-7">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <AvatarFallback style={{ backgroundColor: CORAL + "20", color: CORAL, fontSize: "11px" }}>
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
                    <span className="text-[10px] font-semibold uppercase tracking-wide mt-1 inline-block px-2 py-0.5 rounded-full" style={{ backgroundColor: CORAL + "20", color: CORAL }}>
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
                  <button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-orange-50 transition-colors hidden sm:block" style={{ color: CHARCOAL, borderColor: "#E8D5C4" }}>Sign In</button>
                </Link>
                <Link href="/auth/signup">
                  <button className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 shadow-sm" style={{ backgroundColor: CORAL }}>Get Started</button>
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
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-1 shadow-lg" style={{ borderColor: "#F5E6D8" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest px-2 pt-1 pb-2" style={{ color: CORAL }}>For Professionals</p>
            <Link href="/jobs" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-orange-700 rounded-lg hover:bg-orange-50">
              <Search className="h-4 w-4" /> Browse Jobs
            </Link>
            <Link href="/cv-review" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-orange-700 rounded-lg hover:bg-orange-50">
              <Sparkles className="h-4 w-4" /> AI CV Review
            </Link>

            <div className="border-t pt-2 mt-2" style={{ borderColor: "#F5E6D8" }} />
            <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-bold text-gray-900">← Home</Link>
            <div className="border-t pt-2 mt-1" style={{ borderColor: "#F5E6D8" }} />
            <p className="text-[10px] font-bold uppercase tracking-widest px-2 pt-1 pb-2" style={{ color: CHARCOAL }}>For Employers</p>
            <Link href="/employers" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-orange-50">
              <Building2 className="h-4 w-4" /> Post a Job / Hire Talent
            </Link>
            <Link href="/candidates" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-orange-50">
              <Users className="h-4 w-4" /> Browse Candidates
            </Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-orange-50">
              <Briefcase className="h-4 w-4" /> HR Services
            </Link>

            <div className="border-t pt-2 mt-2" style={{ borderColor: "#F5E6D8" }} />
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">About</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">Insights</Link>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">Contact</a>

            {isAuthenticated && user && (
              <div className="border-t pt-2 mt-2" style={{ borderColor: "#F5E6D8" }}>
                <Link href={user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"} onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">My Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2.5 px-2 text-sm font-medium text-red-500 w-full text-left">Log out</button>
              </div>
            )}
            {!isAuthenticated && (
              <div className="border-t pt-3 mt-2 flex gap-2" style={{ borderColor: "#F5E6D8" }}>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <button className="w-full py-2.5 text-sm font-medium border rounded-lg" style={{ color: CHARCOAL, borderColor: "#E8D5C4" }}>Sign In</button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                  <button className="w-full py-2.5 text-sm font-semibold text-white rounded-lg" style={{ backgroundColor: CORAL }}>Get Started</button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

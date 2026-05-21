import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LogOut, User as UserIcon, Menu, X, ChevronDown, LayoutDashboard,
  Briefcase, Search, FileText, Building2, Users, Sparkles
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CORAL = "#C8461A";
const CHARCOAL = "#1C1917";

const professionalLinks = [
  { href: "/jobs",        icon: <Search    className="h-4 w-4" />, label: "Browse Jobs",    desc: "Find opportunities across Africa" },
  { href: "/cv-review",  icon: <Sparkles  className="h-4 w-4" />, label: "AI CV Review",   desc: "Get expert feedback on your CV" },
  { href: "/auth/signup", icon: <FileText  className="h-4 w-4" />, label: "Create Profile", desc: "Join the talent network" },
];

const employerLinks = [
  { href: "/employers",   icon: <Building2 className="h-4 w-4" />, label: "Post a Job",        desc: "Reach top African talent" },
  { href: "/candidates",  icon: <Users     className="h-4 w-4" />, label: "Browse Candidates", desc: "Search pre-screened profiles" },
  { href: "/services",    icon: <Briefcase className="h-4 w-4" />, label: "HR Services",        desc: "EOR, payroll, outsourcing & more" },
];

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);

  const isHome = location === "/";

  // Transparent overlay mode only on home page while at the top
  const isOverlay = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // initialise on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Derived text colours
  const linkColor    = isOverlay ? "rgba(254,249,244,0.92)" : "#444444";
  const activeLinkColor = CORAL;

  return (
    <header className="w-full">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isOverlay
            ? "bg-transparent border-b border-white/10 backdrop-blur-sm"
            : "bg-white shadow-md border-b border-orange-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
              <img src="/logo-bridgepath.webp" alt="Bridgepath Africa" width="40" height="40" decoding="async" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="font-extrabold text-[17px] tracking-tight leading-none">
                <span style={{ color: isOverlay ? "#FEF9F4" : CHARCOAL }}>BridgePath</span>
                <span style={{ color: CORAL }}> Africa</span>
              </div>
              <span
                className="text-[9px] font-medium tracking-[0.08em] uppercase mt-0.5"
                style={{ color: isOverlay ? "rgba(254,249,244,0.55)" : "#A08060" }}
              >
                Global Talent. African Opportunity.
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/"
              className="px-4 py-2 text-sm font-medium rounded transition-colors hover:text-primary"
              style={{ color: location === "/" ? activeLinkColor : linkColor }}
            >
              Home
            </Link>

            {/* For Professionals */}
            <div className="relative" onMouseEnter={() => setProfOpen(true)} onMouseLeave={() => setProfOpen(false)}>
              <button
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded transition-colors hover:text-primary"
                style={{ color: location === "/jobs" || location === "/cv-review" ? activeLinkColor : linkColor }}
              >
                <Search className="h-3.5 w-3.5" />
                For Professionals
                <motion.span animate={{ rotate: profOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>
              <AnimatePresence>
                {profOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl py-3 z-50"
                    style={{ border: "1px solid #F5E6D8" }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* For Employers */}
            <div className="relative" onMouseEnter={() => setEmpOpen(true)} onMouseLeave={() => setEmpOpen(false)}>
              <button
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded transition-colors hover:text-primary"
                style={{ color: location === "/employers" || location === "/candidates" ? activeLinkColor : linkColor }}
              >
                <Building2 className="h-3.5 w-3.5" />
                For Employers
                <motion.span animate={{ rotate: empOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>
              <AnimatePresence>
                {empOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl py-3 z-50"
                    style={{ border: "1px solid #F5E6D8" }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Static links */}
            {[
              { href: "/about",    label: "About" },
              { href: "/blog",     label: "Insights" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:text-primary"
                style={{ color: location.startsWith(link.href) ? activeLinkColor : linkColor }}
              >
                {link.label}
              </Link>
            ))}

            <a href="#contact"
              className="px-4 py-2 text-sm font-medium rounded transition-colors hover:text-primary"
              style={{ color: linkColor }}
            >
              Contact
            </a>
          </div>

          {/* ── Auth buttons / user menu ── */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-100 hover:border-orange-300 transition-colors bg-white/90">
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
                  <button
                    className="px-4 py-2 text-sm font-medium border rounded-lg transition-colors hidden sm:block"
                    style={{
                      color: isOverlay ? "#FEF9F4" : CHARCOAL,
                      borderColor: isOverlay ? "rgba(254,249,244,0.35)" : "#E8D5C4",
                      backgroundColor: isOverlay ? "rgba(254,249,244,0.08)" : "transparent",
                    }}
                  >
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 shadow-sm" style={{ backgroundColor: CORAL }}>
                    Get Started
                  </button>
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <motion.button
              className="md:hidden ml-1 p-2 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X className="h-5 w-5" style={{ color: isOverlay ? "#FEF9F4" : CHARCOAL }} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu className="h-5 w-5" style={{ color: isOverlay ? "#FEF9F4" : CHARCOAL }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden", borderTop: "1px solid #F5E6D8" }}
              className="md:hidden bg-white shadow-xl"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.28, delay: 0.05 }}
                className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest px-2 pt-2 pb-2" style={{ color: CORAL }}>For Professionals</p>
                {professionalLinks.map((l, i) => (
                  <motion.div key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.04 }}>
                    <Link href={l.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-orange-700 rounded-lg hover:bg-orange-50 transition-colors">
                      <span style={{ color: CORAL }}>{l.icon}</span> {l.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t my-2" style={{ borderColor: "#F5E6D8" }} />
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}>
                  <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-bold" style={{ color: CHARCOAL }}>← Home</Link>
                </motion.div>
                <div className="border-t my-2" style={{ borderColor: "#F5E6D8" }} />

                <p className="text-[10px] font-bold uppercase tracking-widest px-2 pt-1 pb-2" style={{ color: CHARCOAL }}>For Employers</p>
                {employerLinks.map((l, i) => (
                  <motion.div key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 + i * 0.04 }}>
                    <Link href={l.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-orange-50 transition-colors">
                      <span style={{ color: CHARCOAL }}>{l.icon}</span> {l.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t my-2" style={{ borderColor: "#F5E6D8" }} />
                {[
                  { href: "/about", label: "About" },
                  { href: "/blog",  label: "Insights" },
                ].map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 + i * 0.04 }}>
                    <Link href={link.href} onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-orange-700 rounded-lg hover:bg-orange-50">
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 }}>
                  <a href="#contact" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-orange-700 rounded-lg hover:bg-orange-50">
                    Contact
                  </a>
                </motion.div>

                {isAuthenticated && user && (
                  <div className="border-t pt-2 mt-2" style={{ borderColor: "#F5E6D8" }}>
                    <Link href={user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"} onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-gray-700">My Dashboard</Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2.5 px-2 text-sm font-medium text-red-500 w-full text-left">Log out</button>
                  </div>
                )}
                {!isAuthenticated && (
                  <motion.div className="border-t pt-3 mt-2 flex gap-2" style={{ borderColor: "#F5E6D8" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                      <button className="w-full py-3 text-sm font-medium border rounded-xl" style={{ color: CHARCOAL, borderColor: "#E8D5C4" }}>Sign In</button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                      <button className="w-full py-3 text-sm font-semibold text-white rounded-xl shadow-md" style={{ backgroundColor: CORAL }}>Get Started</button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

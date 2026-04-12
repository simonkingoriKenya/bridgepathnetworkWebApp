import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LogOut, User as UserIcon, Mail, Menu, X, ChevronDown, LayoutDashboard
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

const services = [
  { href: "/services/employment-of-record", label: "Employment of Record" },
  { href: "/services/hr-consultancy", label: "HR Consultancy" },
  { href: "/services/recruitment-services", label: "Recruitment Services" },
  { href: "/services/payroll-tax", label: "Payroll & Tax Admin" },
  { href: "/services/psychometric-assessments", label: "Psychometric Assessments" },
  { href: "/services/staff-outsourcing", label: "Staff Outsourcing" },
  { href: "/services/interim-management", label: "Interim Management" },
  { href: "/services/secondment-services", label: "Secondment Services" },
  { href: "/services/expatriate-services", label: "Expatriate Services" },
];

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/jobs", label: "Find Jobs" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Insights" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="w-full">
      {/* Top bar */}
      <div style={{ backgroundColor: DARK }} className="py-2 hidden md:block">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="font-medium text-gray-300">Bridgepath Network</span>
            <span className="text-gray-600">·</span>
            <span>Accra, Ghana HQ</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <a href="mailto:info@bridgepathnetwork.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="h-3 w-3" /> info@bridgepathnetwork.com
            </a>
            <Link href="/auth/signup" className="text-xs font-semibold" style={{ color: GREEN }}>
              Become a Member
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${scrolled ? "shadow-md border-b border-gray-100" : "border-b border-gray-100"}`}>
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
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

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href !== "/" && link.href !== "/#contact" && location.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:text-green-600"
                  style={{ color: isActive ? GREEN : "#444444" }}>
                  {link.label}
                </Link>
              );
            })}

            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <Link href="/services">
                <button className="px-4 py-2 text-sm font-medium rounded transition-colors flex items-center gap-1 hover:text-green-600"
                  style={{ color: location.startsWith("/services") ? GREEN : "#444444" }}>
                  Services <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
              </Link>
              {servicesOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {services.map((s) => (
                    <Link key={s.href} href={s.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                      {s.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2 px-4 pb-1">
                    <Link href="/services" className="text-xs font-semibold hover:underline" style={{ color: GREEN }}>View all services →</Link>
                  </div>
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <Link href="/auth/signup?role=employer">
                <button className="px-4 py-2 text-sm font-medium rounded transition-colors hover:text-green-600" style={{ color: "#444444" }}>Hire Talent</button>
              </Link>
            )}
          </div>

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
                  <button className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" style={{ color: DARK }}>Sign In</button>
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

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 shadow-lg">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700">Home</Link>
            <Link href="/jobs" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700">Find Jobs</Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700">Services</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700">About</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700">Insights</Link>
            <Link href="/#contact" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700">Contact</Link>
            {isAuthenticated && user && (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link href={user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"} onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700">Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2.5 text-sm font-medium text-red-500 w-full text-left">Log out</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

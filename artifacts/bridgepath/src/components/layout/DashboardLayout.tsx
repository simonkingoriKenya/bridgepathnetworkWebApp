import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Briefcase, FileText, User, LogOut,
  Settings, ChevronLeft, Menu, PlusCircle, Bell, Home, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  navItems: NavItem[];
  user: { name: string; email?: string };
  isEmployer: boolean;
  location: string;
  /** show collapsed icons-only mode (desktop only) */
  collapsed?: boolean;
  /** collapse toggle button handler (desktop) */
  onCollapse?: () => void;
  /** close drawer handler (mobile) */
  onClose?: () => void;
  logout: () => void;
}

function Sidebar({
  navItems, user, isEmployer, location, collapsed = false, onCollapse, onClose, logout,
}: SidebarProps) {
  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(`${href}/`));

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: DARK }}>

      {/* Header row */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 shrink-0">
        {!collapsed && (
          <Link href="/" onClick={onClose} className="flex items-center gap-2 min-w-0">
            <img src="/logo.svg" alt="Logo" className="h-7 w-7 object-contain shrink-0" />
            <span className="font-bold text-sm text-white tracking-tight truncate">
              Bridgepath<span style={{ color: GREEN }}>Network</span>
            </span>
          </Link>
        )}
        {/* Mobile: X button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-auto shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {/* Desktop: collapse toggle */}
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-auto shrink-0"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* User badge */}
      <div className="px-3 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ backgroundColor: GREEN }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-gray-400 text-xs">{isEmployer ? "Employer" : "Professional"}</p>
            </div>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 pt-4 pb-1 shrink-0">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">
            {isEmployer ? "Employer Tools" : "Career Tools"}
          </p>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item, idx) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={`${item.href}-${idx}`}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/8"
              }`}
              style={active ? { backgroundColor: GREEN + "28" } : {}}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                style={active ? { color: GREEN } : {}}
              />
              {!collapsed && (
                <>
                  <span style={active ? { color: GREEN } : {}}>{item.label}</span>
                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GREEN }} />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-white/10 pt-3 shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/8 transition-all"
          title={collapsed ? "Back to Home" : undefined}
        >
          <Home className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to Home</span>}
        </Link>
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/8 transition-all"
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={() => { logout(); onClose?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (!user) return null;

  const isEmployer = user.role === "employer";

  const navItems: NavItem[] = isEmployer
    ? [
        { href: "/dashboard/employer", label: "Overview", icon: LayoutDashboard },
        { href: "/jobs/new", label: "Post a Job", icon: PlusCircle },
        { href: "/jobs", label: "Job Board", icon: Briefcase },
        { href: "/profile", label: "Company Profile", icon: User },
      ]
    : [
        { href: "/dashboard/jobseeker", label: "Overview", icon: LayoutDashboard },
        { href: "/jobs", label: "Find Jobs", icon: Briefcase },
        { href: "/cv-review", label: "AI CV Review", icon: FileText },
        { href: "/profile", label: "My Profile", icon: User },
      ];

  const getPageTitle = () => {
    if (location === "/dashboard/jobseeker") return "Professional Dashboard";
    if (location === "/dashboard/employer") return "Employer Dashboard";
    if (location === "/jobs") return "Job Board";
    if (location === "/jobs/new") return "Post a Job";
    if (location === "/cv-review") return "AI CV Review";
    if (location === "/profile") return isEmployer ? "Company Profile" : "My Profile";
    return isEmployer ? "Employer Dashboard" : "Professional Dashboard";
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f0f2f5" }}>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:block shrink-0 transition-all duration-300 shadow-lg"
        style={{ width: collapsed ? 68 : 240, position: "sticky", top: 0, height: "100vh" }}
      >
        <Sidebar
          navItems={navItems}
          user={user}
          isEmployer={isEmployer}
          location={location}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          logout={logout}
        />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed left-0 top-0 bottom-0 z-50 w-72 md:hidden shadow-2xl"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <Sidebar
                navItems={navItems}
                user={user}
                isEmployer={isEmployer}
                location={location}
                collapsed={false}
                onClose={() => setMobileOpen(false)}
                logout={logout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">{getPageTitle()}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Welcome back, {user.name.split(" ")[0]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: GREEN }} />
            </button>
            {isEmployer ? (
              <Link href="/jobs/new">
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90" style={{ backgroundColor: GREEN }}>
                  <PlusCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Post a Job</span>
                </button>
              </Link>
            ) : (
              <Link href="/jobs">
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90" style={{ backgroundColor: GREEN }}>
                  <Briefcase className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Find Jobs</span>
                </button>
              </Link>
            )}
            <div
              className="md:hidden h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
              style={{ backgroundColor: GREEN }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 p-4 md:p-6 overflow-auto"
          style={{ background: "radial-gradient(circle at top right, rgba(140,198,63,0.10), transparent 34%), #f5f7fb" }}
        >
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

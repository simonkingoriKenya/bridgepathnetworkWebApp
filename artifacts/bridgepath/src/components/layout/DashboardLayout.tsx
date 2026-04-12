import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Briefcase, FileText, User, LogOut,
  Settings, ChevronLeft, Menu, PlusCircle,
  Bell, Home
} from "lucide-react";
import { motion } from "framer-motion";
const logoImg = "/logo.svg";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const isEmployer = user.role === "employer";

  const navItems = isEmployer
    ? [
        { href: "/dashboard/employer", label: "Overview", icon: LayoutDashboard },
        { href: "/jobs/new", label: "Post a Job", icon: PlusCircle },
        { href: "/jobs", label: "Browse Jobs", icon: Briefcase },
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
    if (location === "/profile") return "Profile Settings";
    return isEmployer ? "Employer Dashboard" : "Professional Dashboard";
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f0f2f5" }}>
      <aside
        className="shrink-0 flex flex-col transition-all duration-300 shadow-lg"
        style={{
          width: collapsed ? 68 : 240,
          backgroundColor: DARK,
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <img src={logoImg} alt="Logo" className="h-7 w-7 object-contain" />
              <span className="font-bold text-sm text-white tracking-tight whitespace-nowrap">
                Bridgepath<span style={{ color: GREEN }}>Network</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-auto"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="px-3 py-4 border-b border-white/10">
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
                <p className="text-gray-400 text-xs truncate">{isEmployer ? "Employer" : "Professional"}</p>
              </div>
            )}
          </div>
        </div>

        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">
              {isEmployer ? "Employer Tools" : "Career Tools"}
            </p>
          </div>
        )}

        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {navItems.map((item, idx) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/8"
                }`}
                style={isActive ? { backgroundColor: GREEN + "28" } : {}}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" style={isActive ? { color: GREEN } : {}} />
                {!collapsed && <span style={isActive ? { color: GREEN } : {}}>{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GREEN }} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 pb-4 space-y-0.5 border-t border-white/10 pt-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/8 transition-all"
            title={collapsed ? "Back to Home" : undefined}
          >
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Back to Home</span>}
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/8 transition-all"
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-base font-semibold text-gray-900">{getPageTitle()}</h1>
            <p className="text-xs text-gray-400">Welcome back, {user.name.split(" ")[0]} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: GREEN }} />
            </button>
            {isEmployer ? (
              <Link href="/jobs/new">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: GREEN }}
                >
                  <PlusCircle className="h-4 w-4" /> Post a Job
                </button>
              </Link>
            ) : (
              <Link href="/jobs">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: GREEN }}
                >
                  <Briefcase className="h-4 w-4" /> Find Jobs
                </button>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto" style={{ background: "radial-gradient(circle at top right, rgba(140, 198, 63, 0.12), transparent 32%), #f5f7fb" }}>
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

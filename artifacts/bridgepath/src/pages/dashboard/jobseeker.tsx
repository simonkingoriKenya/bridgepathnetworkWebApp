import { useGetDashboardStats, useGetMyApplications } from "@workspace/api-client-react";
import { isDemoEmail, getDemoApplications } from "@/lib/demoAuth";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { FileText, Send, CheckCircle2, Clock, ArrowRight, Eye, Bot, ShieldCheck, Lock, TrendingUp, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const GREEN = "#8CC63F";
const DARK = "#1a2340";
const GOLD = "#f59e0b";
const PURPLE = "#8b5cf6";

const activityData = [
  { week: "Wk 1", applications: 2, views: 7 },
  { week: "Wk 2", applications: 4, views: 13 },
  { week: "Wk 3", applications: 3, views: 9 },
  { week: "Wk 4", applications: 7, views: 21 },
  { week: "Wk 5", applications: 5, views: 16 },
  { week: "Wk 6", applications: 9, views: 28 },
];

const pieData = [
  { name: "Applied", value: 9, color: DARK },
  { name: "Shortlisted", value: 3, color: GREEN },
  { name: "Reviewing", value: 2, color: GOLD },
  { name: "Rejected", value: 1, color: "#ef4444" },
];

const mockApplications = [
  { id: 1, job: { title: "Software Engineer (Full Stack)", employer: { name: "Andela" } }, status: "shortlisted", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 2, job: { title: "Backend Engineer (Python)", employer: { name: "Flutterwave" } }, status: "reviewing", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 3, job: { title: "Mobile App Developer (Android)", employer: { name: "M-KOPA" } }, status: "applied", createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 4, job: { title: "HR Business Partner", employer: { name: "Safaricom" } }, status: "shortlisted", createdAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 5, job: { title: "Digital Marketing Specialist", employer: { name: "Jumia" } }, status: "rejected", createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: 6, job: { title: "Sales Director – East Africa", employer: { name: "SAP Africa" } }, status: "applied", createdAt: new Date(Date.now() - 18 * 86400000).toISOString() },
];

const blurredProfiles = [
  { initials: "A.K.", title: "Senior HR Manager", company: "TechCorp Africa", location: "Nairobi, Kenya", skills: ["HR Strategy", "Recruitment", "L&D"] },
  { initials: "L.R.", title: "Product Director", company: "PayFintech", location: "Lagos, Nigeria", skills: ["Product Mgmt", "Agile", "B2B SaaS"] },
  { initials: "N.D.", title: "Data Scientist", company: "Andela", location: "Accra, Ghana", skills: ["Python", "ML", "Analytics"] },
];

const recommendedJobs = [
  { title: "UX Designer", company: "Ogilvy Africa", location: "Accra, GH", salary: "$35k–55k" },
  { title: "Frontend Engineer", company: "Andela", location: "Remote", salary: "$60k–90k" },
  { title: "Product Manager", company: "M-KOPA", location: "Nairobi, KE", salary: "$55k–80k" },
];

function StatCard({ label, value, icon, color, sub, trend }: { label: string; value: string | number; icon: React.ReactNode; color: string; sub?: string; trend?: string }) {
  return (
    <div className="dashboard-card rounded-2xl p-5 border border-white/80">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="text-2xl font-bold mb-0.5" style={{ color: DARK }}>{value}</div>
      <div className="flex items-center gap-1.5">
        {trend && <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{trend}</span>}
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'accepted': return { backgroundColor: "#dcfce7", color: "#16a34a" };
    case 'rejected': return { backgroundColor: "#fee2e2", color: "#dc2626" };
    case 'shortlisted': return { backgroundColor: "#dbeafe", color: "#2563eb" };
    case 'reviewing': return { backgroundColor: "#fef3c7", color: "#d97706" };
    default: return { backgroundColor: "#f3f4f6", color: "#6b7280" };
  }
}

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const isDemo = isDemoEmail(user?.email);
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: { queryKey: ["dashboardStats"], enabled: !isDemo }
  });
  const { data: apiApplications } = useGetMyApplications({
    query: { queryKey: ["myApplications"], enabled: !isDemo }
  });

  const [demoApps, setDemoApps] = useState(() => isDemo ? getDemoApplications() : []);
  useEffect(() => {
    if (!isDemo) return;
    setDemoApps(getDemoApplications());
    const handler = () => setDemoApps(getDemoApplications());
    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handler);
    };
  }, [isDemo]);

  const applications = isDemo
    ? [...demoApps, ...mockApplications]
    : (apiApplications && apiApplications.length > 0) ? apiApplications : mockApplications;
  const totalApps = isDemo
    ? applications.length
    : statsLoading ? 15 : (stats?.totalApplications || 15);
  const shortlisted = isDemo
    ? applications.filter((a: any) => a.status === "shortlisted").length
    : statsLoading ? 3 : (stats?.shortlistedApplications || 3);
  const pending = isDemo
    ? applications.filter((a: any) => a.status === "applied" || a.status === "reviewing").length
    : statsLoading ? 6 : (stats?.pendingApplications || 6);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-sm premium-grid-bg-dark" style={{ background: `linear-gradient(135deg, ${DARK}, #27375f)` }}>
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20" style={{ backgroundColor: GREEN }} />
        <div className="absolute right-12 bottom-0 h-24 w-24 rounded-full opacity-10" style={{ backgroundColor: GREEN }} />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: GREEN }}>Career command center</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome, {user?.name?.split(" ")[0] || "Professional"}</h1>
            <p className="text-gray-300 leading-relaxed">
              Track applications, improve your CV, and discover Africa-focused roles from one dashboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/jobs" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: GREEN }}>
              <Briefcase className="h-4 w-4" /> Browse Jobs
            </Link>
            <Link href="/cv-review" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border border-white/20 bg-white/10 hover:bg-white/15">
              <FileText className="h-4 w-4" /> Review CV
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Applications" value={totalApps} icon={<Send className="h-4 w-4" />} color={DARK} sub="All time" trend="+2 this week" />
        <StatCard label="Shortlisted" value={shortlisted} icon={<CheckCircle2 className="h-4 w-4" />} color={GREEN} sub="Employers interested" />
        <StatCard label="Pending Review" value={pending} icon={<Clock className="h-4 w-4" />} color={GOLD} sub="Awaiting response" />
        <StatCard label="Profile Views" value="47" icon={<Eye className="h-4 w-4" />} color={PURPLE} sub="Last 30 days" trend="+12%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 dashboard-card rounded-2xl p-5 border border-white/80">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Activity Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Applications & profile views</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: GREEN + "15", color: GREEN }}>Last 6 weeks</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={DARK} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={DARK} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Area type="monotone" dataKey="applications" stroke={GREEN} strokeWidth={2} fill="url(#appGrad)" name="Applications" />
              <Area type="monotone" dataKey="views" stroke={DARK} strokeWidth={2} fill="url(#viewGrad)" name="Profile Views" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card rounded-2xl p-5 border border-white/80">
          <h2 className="font-semibold text-gray-900 text-sm mb-1">Application Status</h2>
          <p className="text-xs text-gray-400 mb-3">Breakdown of your {totalApps} applications</p>
          <div className="flex justify-center">
            <PieChart width={140} height={140}>
              <Pie data={pieData} cx={70} cy={70} innerRadius={42} outerRadius={65} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-1.5 mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-gray-500 text-xs">{entry.name}</span>
                </div>
                <span className="font-semibold text-gray-700 text-xs">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 dashboard-card rounded-2xl border border-white/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Applications</h2>
            <Link href="/jobs">
              <button className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: GREEN }}>
                Browse jobs <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {applications.slice(0, 6).map((app: any) => (
              <div key={app.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: DARK + "10", color: DARK }}>
                    {(app.job?.title || "J")[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{app.job?.title || "Position"}</p>
                    <p className="text-xs text-gray-400">{app.job?.employer?.name || "Company"} · {format(new Date(app.createdAt), 'MMM d')}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={getStatusStyle(app.status)}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="dashboard-card rounded-2xl p-5 border border-white/80">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Career Tools</h2>
            <div className="space-y-2.5">
              <Link href="/cv-review">
                <div className="p-3.5 rounded-xl border border-gray-100 hover:border-green-200 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN + "15" }}>
                      <Bot className="h-4 w-4" style={{ color: GREEN }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">AI CV Review</p>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ backgroundColor: GREEN + "20", color: GREEN }}>Free</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Instant AI analysis with actionable insights</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </Link>

              <Link href="/cv-review">
                <div className="p-3.5 rounded-xl border border-gray-100 hover:border-amber-200 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-50">
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">Human HR Review</p>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">$15</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Expert recruiter gives personalized feedback</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="dashboard-card rounded-2xl p-5 border border-white/80">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Recommended Jobs</h2>
            <div className="space-y-2.5">
              {recommendedJobs.map((job, i) => (
                <Link key={i} href="/jobs">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold" style={{ backgroundColor: GREEN + "15", color: GREEN }}>
                      {job.company[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{job.title}</p>
                      <p className="text-[11px] text-gray-400">{job.company} · {job.location}</p>
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">{job.salary}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/jobs">
              <button className="mt-3 w-full text-xs font-semibold py-2 rounded-lg border transition-colors" style={{ borderColor: GREEN + "40", color: GREEN }}>
                View All Jobs →
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-900 text-sm">Talent Profiles</h2>
              <Lock className="h-4 w-4 text-gray-300" />
            </div>
            <p className="text-xs text-gray-500 mb-3">Benchmark your career against top professionals</p>
            <div className="space-y-2">
              {blurredProfiles.map((p, i) => (
                <div key={i} className="relative p-2.5 rounded-xl bg-gray-50 overflow-hidden">
                  <div className="filter blur-sm pointer-events-none select-none">
                    <p className="text-xs font-bold text-gray-800">{p.initials}</p>
                    <p className="text-[11px] text-gray-600">{p.title} · {p.company}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {p.skills.map(s => <span key={s} className="text-[9px] bg-gray-200 px-1.5 py-0.5 rounded">{s}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full text-xs font-semibold py-2 rounded-lg text-white transition-opacity hover:opacity-90" style={{ backgroundColor: DARK }}>
              Unlock Profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

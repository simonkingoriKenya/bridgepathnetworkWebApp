import { Link } from "wouter";
import { useGetDashboardStats, useListJobs } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { PlusCircle, Briefcase, Users, Clock, CheckCircle2, TrendingUp, Lock, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const GREEN = "#8CC63F";
const DARK = "#1a2340";
const GOLD = "#f59e0b";
const PURPLE = "#8b5cf6";

const hiringFunnel = [
  { stage: "Applied", count: 47 },
  { stage: "Reviewed", count: 28 },
  { stage: "Shortlisted", count: 12 },
  { stage: "Interviewed", count: 6 },
  { stage: "Hired", count: 2 },
];

const trendData = [
  { month: "Nov", applications: 8 },
  { month: "Dec", applications: 14 },
  { month: "Jan", applications: 22 },
  { month: "Feb", applications: 18 },
  { month: "Mar", applications: 31 },
  { month: "Apr", applications: 47 },
];

const mockJobs = [
  { id: 201, title: "Senior Software Engineer", location: "Remote", applicantCount: 18, isActive: true, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 202, title: "Product Manager", location: "Nairobi, KE", applicantCount: 12, isActive: true, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 203, title: "HR Business Partner", location: "Lagos, NG", applicantCount: 9, isActive: true, createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 204, title: "Data Analyst", location: "Accra, GH", applicantCount: 8, isActive: false, createdAt: new Date(Date.now() - 21 * 86400000).toISOString() },
];

const blurredCandidates = [
  { initials: "A.M.", title: "Senior Software Engineer", location: "Nairobi, KE", exp: "6 yrs", skills: ["React", "Node.js", "AWS"], score: 92 },
  { initials: "P.R.", title: "Product Manager", location: "Lagos, NG", exp: "4 yrs", skills: ["Agile", "Roadmapping", "Analytics"], score: 88 },
  { initials: "L.O.", title: "UX Designer", location: "Accra, GH", exp: "5 yrs", skills: ["Figma", "User Research", "Systems"], score: 85 },
  { initials: "S.N.", title: "Data Analyst", location: "Cape Town, ZA", exp: "3 yrs", skills: ["SQL", "Python", "Tableau"], score: 81 },
];

const recentActivity = [
  { text: "Amina M. applied for Senior Software Engineer", time: "2h ago", dot: GREEN },
  { text: "Kwame O. shortlisted for Product Manager", time: "5h ago", dot: GOLD },
  { text: "Rosa L. accepted interview for HR Business Partner", time: "1d ago", dot: PURPLE },
  { text: "New application received for Data Analyst", time: "2d ago", dot: DARK },
];

function StatCard({ label, value, icon, color, sub, trend }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
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

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({ query: { queryKey: ["dashboardStats"] } });
  const { data: jobsResponse, isLoading: jobsLoading } = useListJobs({ limit: 5 }, { query: { queryKey: ["dashboardJobs"] } });

  const jobs = (!jobsLoading && jobsResponse?.jobs && jobsResponse.jobs.length > 0) ? jobsResponse.jobs : mockJobs;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Jobs" value={statsLoading ? 4 : (stats?.activeJobs || 4)} icon={<Briefcase className="h-4 w-4" />} color={GREEN} sub="Currently live" />
        <StatCard label="Total Applicants" value={statsLoading ? 47 : (stats?.totalApplicants || 47)} icon={<Users className="h-4 w-4" />} color={DARK} sub="Across all jobs" trend="+8 this week" />
        <StatCard label="Shortlisted" value="12" icon={<CheckCircle2 className="h-4 w-4" />} color={PURPLE} sub="Ready to interview" />
        <StatCard label="Avg. Time to Hire" value="18d" icon={<Clock className="h-4 w-4" />} color={GOLD} sub="Industry avg: 24d" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Application Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly applications received</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: GREEN + "15", color: GREEN }}>Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Line type="monotone" dataKey="applications" stroke={GREEN} strokeWidth={2.5} dot={{ fill: GREEN, r: 3, strokeWidth: 0 }} name="Applications" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm mb-1">Hiring Funnel</h2>
          <p className="text-xs text-gray-400 mb-4">All open positions</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hiringFunnel} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Bar dataKey="count" fill={DARK} radius={[0, 4, 4, 0]} name="Candidates" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Active Job Listings</h2>
            <Link href="/jobs/new">
              <button className="flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor: GREEN }}>
                <PlusCircle className="h-3.5 w-3.5" /> Post Job
              </button>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {jobs.map((job: any) => (
              <div key={job.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: GREEN + "15", color: GREEN }}>
                    {job.title[0]}
                  </div>
                  <div>
                    <Link href={`/jobs/${job.id}`}>
                      <p className="font-medium text-gray-900 text-sm hover:text-green-600 transition-colors cursor-pointer">{job.title}</p>
                    </Link>
                    <p className="text-xs text-gray-400">{job.location} · {format(new Date(job.createdAt), 'MMM d')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-bold" style={{ color: DARK }}>{job.applicantCount}</div>
                    <div className="text-[10px] text-gray-400">applicants</div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={job.isActive ? { backgroundColor: GREEN + "20", color: GREEN } : { backgroundColor: "#f3f4f6", color: "#6b7280" }}>
                    {job.isActive ? "Active" : "Closed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm">Candidate Profiles</h2>
              <Lock className="h-4 w-4 text-gray-300" />
            </div>
            <div className="divide-y divide-gray-50">
              {blurredCandidates.map((c, i) => (
                <div key={i} className="relative px-4 py-3 overflow-hidden">
                  <div className="filter blur-[3px] pointer-events-none select-none">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: DARK + "15", color: DARK }}>
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                        <p className="text-xs text-gray-500">{c.location} · {c.exp}</p>
                      </div>
                      <div className="ml-auto text-sm font-bold" style={{ color: GREEN }}>{c.score}</div>
                    </div>
                    <div className="flex gap-1 flex-wrap mt-1.5">
                      {c.skills.map(s => <span key={s} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">{s}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-gray-500 text-center mb-2.5">Unlock to view profiles & contact details</p>
              <button className="w-full text-sm font-semibold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90" style={{ backgroundColor: DARK }}>
                Unlock Talent Pool
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" style={{ color: GREEN }} />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.dot }} />
                  <div>
                    <p className="text-xs text-gray-700 leading-snug">{item.text}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

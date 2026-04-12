import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListJobs } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { useDebounce } from "@/hooks/use-debounce";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

const mockJobs = [
  { id: 101, title: "Software Engineer (Full Stack)", employer: { name: "Andela" }, location: "Remote", country: "Kenya", type: "remote", salaryMin: 70000, salaryMax: 110000, currency: "USD", industry: "Technology", skills: ["React", "Node.js", "PostgreSQL", "TypeScript"], createdAt: new Date().toISOString(), isActive: true },
  { id: 102, title: "Finance Manager", employer: { name: "Equity Bank" }, location: "Nairobi", country: "Kenya", type: "full_time", salaryMin: 45000, salaryMax: 70000, currency: "USD", industry: "Banking & Finance", skills: ["Financial Analysis", "IFRS", "Excel", "Budgeting"], createdAt: new Date(Date.now() - 86400000).toISOString(), isActive: true },
  { id: 103, title: "Digital Marketing Specialist", employer: { name: "Jumia" }, location: "Lagos", country: "Nigeria", type: "full_time", salaryMin: 30000, salaryMax: 50000, currency: "USD", industry: "E-Commerce", skills: ["SEO", "Social Media", "Google Ads", "Analytics"], createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), isActive: true },
  { id: 104, title: "Supply Chain Analyst", employer: { name: "Dangote Group" }, location: "Abuja", country: "Nigeria", type: "full_time", salaryMin: 38000, salaryMax: 58000, currency: "USD", industry: "Manufacturing", skills: ["Supply Chain", "ERP", "Data Analysis", "Logistics"], createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), isActive: true },
  { id: 105, title: "Clinical Pharmacist", employer: { name: "Aga Khan University Hospital" }, location: "Nairobi", country: "Kenya", type: "full_time", salaryMin: 40000, salaryMax: 62000, currency: "USD", industry: "Healthcare", skills: ["Clinical Pharmacy", "Patient Care", "Drug Management"], createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), isActive: true },
  { id: 106, title: "Civil Engineer", employer: { name: "AECOM Africa" }, location: "Johannesburg", country: "South Africa", type: "full_time", salaryMin: 55000, salaryMax: 85000, currency: "USD", industry: "Engineering", skills: ["AutoCAD", "Project Management", "Structural Design", "Civil Works"], createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), isActive: true },
  { id: 107, title: "HR Business Partner", employer: { name: "Safaricom" }, location: "Nairobi", country: "Kenya", type: "full_time", salaryMin: 42000, salaryMax: 65000, currency: "USD", industry: "Telecommunications", skills: ["HR Strategy", "Employee Relations", "Change Management"], createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), isActive: true },
  { id: 108, title: "Sales Director – East Africa", employer: { name: "SAP Africa" }, location: "Nairobi", country: "Kenya", type: "full_time", salaryMin: 80000, salaryMax: 130000, currency: "USD", industry: "Technology", skills: ["Enterprise Sales", "CRM", "B2B", "Deal Closing"], createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), isActive: true },
  { id: 109, title: "Graphic Designer", employer: { name: "Ogilvy Africa" }, location: "Accra", country: "Ghana", type: "contract", salaryMin: 20000, salaryMax: 35000, currency: "USD", industry: "Advertising", skills: ["Adobe Creative Suite", "Figma", "Branding", "Typography"], createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), isActive: true },
  { id: 110, title: "Mobile App Developer (Android)", employer: { name: "M-KOPA" }, location: "Kampala", country: "Uganda", type: "full_time", salaryMin: 50000, salaryMax: 80000, currency: "USD", industry: "FinTech", skills: ["Kotlin", "Android SDK", "REST APIs", "Firebase"], createdAt: new Date(Date.now() - 9 * 86400000).toISOString(), isActive: true },
  { id: 111, title: "Country Director – Tanzania", employer: { name: "IRC – International Rescue Committee" }, location: "Dar es Salaam", country: "Tanzania", type: "full_time", salaryMin: 90000, salaryMax: 130000, currency: "USD", industry: "NGO / Development", skills: ["Program Management", "Fundraising", "Leadership", "Reporting"], createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), isActive: true },
  { id: 112, title: "Backend Engineer (Python)", employer: { name: "Flutterwave" }, location: "Remote", country: "Multiple", type: "remote", salaryMin: 65000, salaryMax: 105000, currency: "USD", industry: "FinTech", skills: ["Python", "Django", "PostgreSQL", "AWS", "Redis"], createdAt: new Date(Date.now() - 11 * 86400000).toISOString(), isActive: true },
];

function ApplyModal({ open, onClose, jobTitle }: { open: boolean; onClose: () => void; jobTitle: string }) {
  const [, setLocation] = useLocation();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
        <div className="relative">
          <div className="h-36 flex items-center justify-center" style={{ backgroundColor: DARK }}>
            <div className="text-center">
              <div className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: GREEN }}>
                <Briefcase className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2" style={{ color: DARK }}>Create an account to apply</h2>
          <p className="text-gray-500 text-sm mb-6">
            Sign up free and apply to <span className="font-semibold text-gray-700">"{jobTitle}"</span> in seconds. Track all your applications from your dashboard.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setLocation("/auth/signup")}
              className="w-full py-3 font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: GREEN }}
            >
              Create Free Account
            </button>
            <button
              onClick={() => setLocation("/auth/login")}
              className="w-full py-3 font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              I already have an account
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Free to join • No credit card required</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function JobsList() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<string>("all");
  const [applyJob, setApplyJob] = useState<{ id: number; title: string } | null>(null);

  const { isAuthenticated } = useAuth();
  const debouncedSearch = useDebounce(search, 400);
  const debouncedLocation = useDebounce(location, 400);

  const { data: apiData, isLoading } = useListJobs({
    search: debouncedSearch || undefined,
    location: debouncedLocation || undefined,
    type: type !== "all" ? type : undefined,
    limit: 20
  }, { query: { queryKey: ["jobs", debouncedSearch, debouncedLocation, type] } });

  const apiJobs = apiData?.jobs || [];

  const filteredMock = mockJobs.filter(j => {
    const matchSearch = !debouncedSearch || j.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || j.employer.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || j.skills.some(s => s.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const matchLocation = !debouncedLocation || j.location.toLowerCase().includes(debouncedLocation.toLowerCase()) || j.country.toLowerCase().includes(debouncedLocation.toLowerCase());
    const matchType = type === "all" || j.type === type;
    return matchSearch && matchLocation && matchType;
  });

  const allJobs = [...apiJobs, ...filteredMock];
  const totalCount = allJobs.length;

  const handleApply = (job: { id: number; title: string }) => {
    if (!isAuthenticated) {
      setApplyJob(job);
    } else {
      navigate(`/jobs/${job.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="py-16" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #2d4a7a 100%)` }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Find Jobs Across Africa</h1>
            <p className="text-gray-300 text-lg">Discover opportunities at leading companies on the continent and globally</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-2xl shadow-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Job title, skills, or company"
                  className="pl-10 h-12 border-0 bg-gray-50 focus-visible:ring-0 rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative flex-1 md:max-w-xs">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  placeholder="City, country, or Remote"
                  className="pl-10 h-12 border-0 bg-gray-50 focus-visible:ring-0 rounded-xl"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-12 w-full md:w-44 border-0 bg-gray-50 rounded-xl focus:ring-0">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              <button className="h-12 px-8 font-semibold text-white rounded-xl shrink-0 hover:opacity-90 transition-opacity" style={{ backgroundColor: GREEN }}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {isLoading ? "Loading..." : <><span style={{ color: GREEN }} className="font-bold">{totalCount}</span> Jobs Found</>}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <select className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1">
              <option>Most Recent</option>
              <option>Salary (High–Low)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse h-28" />
            ))
          ) : allJobs.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try different keywords or broaden your search filters</p>
            </div>
          ) : (
            allJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all p-6 group">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="h-12 w-12 rounded-xl shrink-0 flex items-center justify-center font-bold text-lg" style={{ backgroundColor: DARK + "10", color: DARK }}>
                    {job.employer?.name?.[0] || "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors cursor-pointer">{job.title}</h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{job.employer?.name}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.type.replace('_', ' ')}</span>
                      {job.salaryMin && job.salaryMax && (
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.currency} {(job.salaryMin / 1000).toFixed(0)}k–{(job.salaryMax / 1000).toFixed(0)}k</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills?.slice(0, 4).map(skill => (
                        <span key={skill} className="text-xs px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-gray-50">{skill}</span>
                      ))}
                      {job.skills && job.skills.length > 4 && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-400">+{job.skills.length - 4}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {format(new Date(job.createdAt), 'MMM d')}
                    </span>
                    <button
                      onClick={() => handleApply({ id: job.id, title: job.title })}
                      className="px-5 py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: GREEN }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />

      {applyJob && (
        <ApplyModal
          open={!!applyJob}
          onClose={() => setApplyJob(null)}
          jobTitle={applyJob.title}
        />
      )}
    </div>
  );
}

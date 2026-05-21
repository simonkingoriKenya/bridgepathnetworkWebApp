import { Link, useRoute } from "wouter";
import { ArrowLeft, Briefcase, MapPin, MessageSquare, FileText } from "lucide-react";

const TERRACOTTA = "#C04020";
const INK = "#1E1511";

const candidates = [
  {
    id: "1",
    name: "Amina Mensah",
    role: "Senior Software Engineer",
    experience: "6 years",
    location: "Nairobi, Kenya",
    skills: ["React", "Node.js", "AWS", "Fintech", "API design"],
    summary: "Full-stack engineer with experience building scalable products for African and global teams. Strong background in product-led engineering, payments, and cloud deployment.",
    cv: "CV summary available after candidate approval",
    history: ["Senior Software Engineer at fintech startup", "Frontend Engineer supporting distributed product teams", "Built dashboard, payment, and onboarding workflows"],
  },
  {
    id: "2",
    name: "Peter Rono",
    role: "Product Manager",
    experience: "4 years",
    location: "Accra, Ghana",
    skills: ["Roadmapping", "Agile", "Analytics", "SaaS", "Customer research"],
    summary: "Product leader experienced in customer discovery, roadmap planning, and cross-functional delivery across African growth markets.",
    cv: "CV summary available after candidate approval",
    history: ["Product Manager for B2B platform", "Led market expansion research", "Managed analytics-backed prioritization"],
  },
  {
    id: "3",
    name: "Lydia Osei",
    role: "HR Operations Lead",
    experience: "5 years",
    location: "Remote",
    skills: ["HRIS", "People Ops", "Compliance", "Payroll", "Onboarding"],
    summary: "People operations specialist helping distributed companies scale compliant HR systems and employee support processes.",
    cv: "CV summary available after candidate approval",
    history: ["HR Operations Lead for distributed teams", "Implemented onboarding and HRIS workflows", "Supported payroll and compliance processes"],
  },
  {
    id: "4",
    name: "Samuel Njoroge",
    role: "Data Analyst",
    experience: "3 years",
    location: "Nairobi, Kenya",
    skills: ["SQL", "Python", "Tableau", "Reporting", "Data quality"],
    summary: "Analyst turning operational and customer data into clear hiring and business decisions for growing companies.",
    cv: "CV summary available after candidate approval",
    history: ["Data Analyst for operations team", "Built KPI dashboards", "Improved reporting and data quality processes"],
  },
];

export default function CandidateProfilePage() {
  const [, params] = useRoute("/candidates/:id");
  const candidate = candidates.find((item) => item.id === params?.id) ?? candidates[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <Link href="/candidates" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to candidates
      </Link>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: TERRACOTTA }}>Candidate Profile</p>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: INK }}>{candidate.name}</h1>
            <p className="text-gray-600 mt-2">{candidate.role}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {candidate.experience}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {candidate.location}</span>
            </div>
          </div>
          <Link href="/messages" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: TERRACOTTA }}>
            <MessageSquare className="h-4 w-4" /> Message Candidate
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">Professional Summary</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{candidate.summary}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Experience</h2>
            <div className="space-y-3">
              {candidate.history.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="h-2 w-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: TERRACOTTA }} />
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{skill}</span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: TERRACOTTA + "20", color: TERRACOTTA }}>
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-gray-900 mb-2">CV Summary</h2>
            <p className="text-sm text-gray-500">{candidate.cv}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

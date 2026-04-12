import { Link } from "wouter";
import { Search, MapPin, Briefcase, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

const candidates = [
  {
    id: 1,
    name: "Amina Mensah",
    role: "Senior Software Engineer",
    experience: "6 years",
    location: "Nairobi, Kenya",
    skills: ["React", "Node.js", "AWS", "Fintech"],
    summary: "Full-stack engineer with experience building scalable products for African and global teams.",
  },
  {
    id: 2,
    name: "Peter Rono",
    role: "Product Manager",
    experience: "4 years",
    location: "Accra, Ghana",
    skills: ["Roadmapping", "Agile", "Analytics", "SaaS"],
    summary: "Product leader experienced in customer discovery, roadmap planning, and cross-functional delivery.",
  },
  {
    id: 3,
    name: "Lydia Osei",
    role: "HR Operations Lead",
    experience: "5 years",
    location: "Remote",
    skills: ["HRIS", "People Ops", "Compliance", "Payroll"],
    summary: "People operations specialist helping distributed companies scale compliant HR systems.",
  },
  {
    id: 4,
    name: "Samuel Njoroge",
    role: "Data Analyst",
    experience: "3 years",
    location: "Nairobi, Kenya",
    skills: ["SQL", "Python", "Tableau", "Reporting"],
    summary: "Analyst turning operational and customer data into clear hiring and business decisions.",
  },
];

export default function CandidatesPage() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GREEN }}>Talent Pool</p>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: DARK }}>Browse Candidates</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-2xl">
              Review diaspora and local professionals across Ghana, Kenya, and remote roles. Candidate data is sample V1 content while the live talent pool is being onboarded.
            </p>
          </div>
          <Link href="/messages" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: GREEN }}>
            <MessageSquare className="h-4 w-4" /> View Messages
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search by role, skill, or location" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-gray-900">{candidate.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{candidate.role}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: GREEN + "20", color: GREEN }}>
                {candidate.name.split(" ").map((part) => part[0]).join("")}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {candidate.experience}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {candidate.location}</span>
            </div>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">{candidate.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {candidate.skills.map((skill) => (
                <span key={skill} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{skill}</span>
              ))}
            </div>
            <Link href={`/candidates/${candidate.id}`} className="inline-flex mt-5 text-sm font-semibold" style={{ color: GREEN }}>
              View Profile →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Briefcase, Search, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

export default function EmployersPage() {
  const { isAuthenticated, user } = useAuth();
  const employerHref = (path: string) =>
    !isAuthenticated
      ? "/auth/signup?role=employer"
      : user?.role === "employer"
        ? path
        : "/dashboard/jobseeker";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 md:py-28" style={{ backgroundColor: "#f5f7fb" }}>
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4" style={{ color: GREEN }}>For Employers</p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: DARK }}>Hire the Right Talent Across Africa</h1>
                <p className="text-gray-600 mt-5 leading-relaxed text-lg">
                  BridgePath helps employers connect with diaspora and local professionals across Ghana, Kenya, and remote African markets.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link href={employerHref("/jobs/new")} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: GREEN }}>
                    <Briefcase className="h-4 w-4" /> Post a Job
                  </Link>
                  <Link href={employerHref("/candidates")} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border" style={{ color: DARK, borderColor: "#d1d5db" }}>
                    <Search className="h-4 w-4" /> Browse Candidates
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: GREEN + "20", color: GREEN }}>
                  <Users className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold" style={{ color: DARK }}>Simple V1 hiring workflow</h2>
                <div className="space-y-4 mt-6">
                  {["Post focused roles for Ghana, Kenya, or remote teams", "Review candidate profiles and shortlists", "Message promising professionals directly"].map((item, index) => (
                    <div key={item} className="flex gap-3">
                      <span className="h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center text-white shrink-0" style={{ backgroundColor: GREEN }}>{index + 1}</span>
                      <p className="text-sm text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

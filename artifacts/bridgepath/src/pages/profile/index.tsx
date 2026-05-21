import { useEffect, useState, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth";
import { fetchProfile, upsertProfile, type ProfileRow } from "@/lib/supabaseProfile";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, User, Building2, MapPin, Briefcase, GraduationCap,
  Linkedin, Globe, X, Plus, CheckCircle2, Link as LinkIcon,
  ChevronRight, Save,
} from "lucide-react";

const TERRACOTTA = "#C04020";
const INK = "#1E1511";
const TEAL = "#1e3d3a";

const INDUSTRIES = [
  "Technology", "Banking & Finance", "FinTech", "Healthcare",
  "Engineering", "Telecommunications", "E-Commerce", "Manufacturing",
  "Advertising & Media", "NGO / Development", "Education", "Other",
];

const AFRICAN_COUNTRIES = [
  "Ghana", "Kenya", "Nigeria", "South Africa", "Tanzania", "Uganda",
  "Ethiopia", "Rwanda", "Senegal", "Côte d'Ivoire", "Cameroon", "Egypt",
  "Morocco", "Other",
];

const COMPANY_SIZES = [
  "1–10", "11–50", "51–200", "201–500", "501–1000", "1000+",
];

const jobSeekerSchema = z.object({
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  experience: z.string().optional(),
  education: z.string().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const employerSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  location: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  bio: z.string().max(800).optional(),
});

type Tab = "info" | "skills" | "links";

function ProfileStrength({ pct, label }: { pct: number; label: string }) {
  const color = pct < 40 ? "#f59e0b" : pct < 75 ? "#3b82f6" : TERRACOTTA;
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-medium text-gray-500">Profile strength</span>
        <span className="font-bold" style={{ color }}>{label}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function SkillChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all group"
      style={{ borderColor: TERRACOTTA + "60", backgroundColor: TERRACOTTA + "12", color: TEAL }}>
      {label}
      <button onClick={onRemove} className="rounded-full p-0.5 hover:bg-red-100 hover:text-red-500 transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("info");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [savedOk, setSavedOk] = useState(false);

  const isEmployer = user?.role === "employer";

  const form = useForm({
    resolver: zodResolver((isEmployer ? employerSchema : jobSeekerSchema) as never),
    defaultValues: {
      bio: "", location: "", country: "", experience: "", education: "",
      linkedinUrl: "", portfolioUrl: "", companyName: "", companyWebsite: "",
      industry: "", companySize: "",
    },
  });

  const watchedValues = form.watch();

  /* ── Load profile ── */
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const row = await fetchProfile(user.id);
      if (cancelled) return;
      if (row) {
        form.reset({
          bio: row.bio || "",
          location: row.location || "",
          country: row.country || "",
          experience: row.experience || "",
          education: row.education || "",
          linkedinUrl: row.linkedin_url || "",
          portfolioUrl: (row as any).portfolioUrl || "",
          companyName: row.company_name || "",
          companyWebsite: row.company_website || "",
          industry: row.industry || "",
          companySize: row.company_size || "",
        });
        setSkills(row.skills || []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  /* ── Profile completeness ── */
  const completeness = (() => {
    const v = watchedValues as Record<string, string>;
    if (isEmployer) {
      const fields = [v.companyName, v.country, v.bio, v.industry, v.companyWebsite, v.location];
      const filled = fields.filter(Boolean).length;
      return Math.round((filled / fields.length) * 100);
    }
    const fields = [v.bio, v.location, v.country, v.experience, v.education, v.linkedinUrl];
    const filled = fields.filter(Boolean).length + (skills.length > 0 ? 1 : 0);
    return Math.round((filled / 7) * 100);
  })();

  const strengthLabel = completeness < 40 ? "Starter" : completeness < 70 ? "Good" : completeness < 90 ? "Strong" : "All Star";

  /* ── Skills input ── */
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills(prev => [...prev, s]);
    setSkillInput("");
  };

  const handleSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); }
    if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      setSkills(prev => prev.slice(0, -1));
    }
  };

  /* ── Submit ── */
  const onSubmit = async (data: Record<string, string>) => {
    if (!user) return;
    setSaving(true);
    try {
      const base: Partial<ProfileRow> & { id: string } = { id: user.id };
      if (isEmployer) {
        await upsertProfile({
          ...base,
          company_name: data.companyName,
          company_website: data.companyWebsite || null,
          industry: data.industry || null,
          company_size: data.companySize || null,
          location: data.location || null,
          country: data.country,
          bio: data.bio || null,
        });
      } else {
        await upsertProfile({
          ...base,
          bio: data.bio || null,
          location: data.location || null,
          country: data.country,
          skills,
          experience: data.experience || null,
          education: data.education || null,
          linkedin_url: data.linkedinUrl || null,
        });
      }
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2500);
      toast({ title: "Profile saved", description: "Your changes are live." });
    } catch {
      toast({ variant: "destructive", title: "Save failed", description: "Could not update your profile." });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-40 rounded-2xl bg-gray-200" />
        <div className="h-64 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = isEmployer
    ? [
        { id: "info", label: "Company Info", icon: Building2 },
        { id: "links", label: "Links", icon: LinkIcon },
      ]
    : [
        { id: "info", label: "Personal Info", icon: User },
        { id: "skills", label: "Skills & Experience", icon: Briefcase },
        { id: "links", label: "Links", icon: LinkIcon },
      ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── Profile header card ── */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
        {/* Banner gradient */}
        <div className="h-24 w-full" style={{ background: `linear-gradient(135deg, ${INK} 0%, ${TEAL} 100%)` }} />

        <div className="px-6 pb-6 -mt-10">
          {/* Avatar */}
          <div
            className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-white mb-4"
            style={{ backgroundColor: TERRACOTTA }}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
              <span
                className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: TERRACOTTA + "18", color: TEAL }}
              >
                {isEmployer ? "Employer Account" : "Professional Account"}
              </span>
            </div>

            <div className="sm:w-56 shrink-0">
              <ProfileStrength pct={completeness} label={strengthLabel} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors"
                style={active
                  ? { borderColor: TERRACOTTA, color: TEAL }
                  : { borderColor: "transparent", color: "#9ca3af" }}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit as any)}>
          <div className="p-6 space-y-5">

            {/* ── TAB: Info ── */}
            {tab === "info" && (
              <>
                {isEmployer ? (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Company Name" required error={form.formState.errors.companyName?.message as string}>
                        <input className={inputCls} placeholder="Acme Corp" {...form.register("companyName")} />
                      </Field>
                      <Field label="Industry">
                        <select className={inputCls} {...form.register("industry")}>
                          <option value="">Select industry…</option>
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </Field>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="City / Region">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input className={inputCls + " pl-9"} placeholder="Accra" {...form.register("location")} />
                        </div>
                      </Field>
                      <Field label="Country" required error={form.formState.errors.country?.message as string}>
                        <select className={inputCls} {...form.register("country")}>
                          <option value="">Select country…</option>
                          {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </Field>
                    </div>

                    <Field label="Company Size">
                      <div className="flex flex-wrap gap-2">
                        {COMPANY_SIZES.map(s => {
                          const active = form.watch("companySize") === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => form.setValue("companySize", active ? "" : s)}
                              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                              style={active
                                ? { backgroundColor: INK, borderColor: INK, color: "white" }
                                : { borderColor: "#e5e7eb", color: "#6b7280" }}
                            >
                              {s} employees
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field label="Company Description" hint="Max 800 characters">
                      <textarea
                        className={inputCls + " min-h-[130px] resize-none"}
                        placeholder="Tell candidates what makes your company a great place to work…"
                        {...form.register("bio")}
                      />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Professional Summary" hint="Max 500 characters">
                      <textarea
                        className={inputCls + " min-h-[110px] resize-none"}
                        placeholder="A brief summary of your career goals and strengths…"
                        {...form.register("bio")}
                      />
                      <span className="text-xs text-gray-400 mt-1 block text-right">
                        {(form.watch("bio") || "").length}/500
                      </span>
                    </Field>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="City / Region">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input className={inputCls + " pl-9"} placeholder="Accra" {...form.register("location")} />
                        </div>
                      </Field>
                      <Field label="Country" required error={form.formState.errors.country?.message as string}>
                        <select className={inputCls} {...form.register("country")}>
                          <option value="">Select country…</option>
                          {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </Field>
                    </div>

                    <Field label="Education" hint="Degree, institution, year">
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          className={inputCls + " pl-9"}
                          placeholder="BSc Computer Science, University of Ghana, 2020"
                          {...form.register("education")}
                        />
                      </div>
                    </Field>
                  </>
                )}
              </>
            )}

            {/* ── TAB: Skills & Experience (job seekers only) ── */}
            {tab === "skills" && !isEmployer && (
              <>
                <Field label="Skills" hint="Press Enter or comma to add each skill">
                  <div className="flex flex-wrap gap-2 p-3 min-h-[52px] rounded-xl border border-gray-200 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-white">
                    {skills.map(skill => (
                      <SkillChip key={skill} label={skill} onRemove={() => setSkills(prev => prev.filter(s => s !== skill))} />
                    ))}
                    <input
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKey}
                      onBlur={addSkill}
                      placeholder={skills.length === 0 ? "Type a skill and press Enter…" : "Add another…"}
                      className="flex-1 min-w-[140px] outline-none text-sm bg-transparent placeholder:text-gray-400"
                    />
                  </div>
                  {skills.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{skills.length} skill{skills.length !== 1 ? "s" : ""} added</p>
                  )}
                </Field>

                <Field label="Experience Summary" hint="Walk employers through your work history">
                  <textarea
                    className={inputCls + " min-h-[160px] resize-none"}
                    placeholder={"e.g. 3 years at Tech Startup as Lead Engineer, built a platform that scaled to 50k users.\n\n2 years at Agency X as Frontend Developer, working with React and Vue."}
                    {...form.register("experience")}
                  />
                </Field>

                {/* Suggested skills */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested skills</p>
                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "Python", "React", "SQL", "Figma", "Project Management", "Data Analysis", "Communication"]
                      .filter(s => !skills.includes(s))
                      .map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSkills(prev => [...prev, s])}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          <Plus className="h-3 w-3" />{s}
                        </button>
                      ))}
                  </div>
                </div>
              </>
            )}

            {/* ── TAB: Links ── */}
            {tab === "links" && (
              <>
                <div className="space-y-4">
                  {!isEmployer && (
                    <Field label="LinkedIn Profile">
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a66c2]" />
                        <input
                          className={inputCls + " pl-9"}
                          placeholder="https://linkedin.com/in/yourname"
                          {...form.register("linkedinUrl")}
                        />
                      </div>
                      {form.formState.errors.linkedinUrl && (
                        <p className="text-xs text-red-500 mt-1">{form.formState.errors.linkedinUrl.message as string}</p>
                      )}
                    </Field>
                  )}

                  <Field label={isEmployer ? "Company Website" : "Portfolio / Personal Website"}>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        className={inputCls + " pl-9"}
                        placeholder="https://"
                        {...form.register(isEmployer ? "companyWebsite" : "portfolioUrl")}
                      />
                    </div>
                    {(form.formState.errors as any)[isEmployer ? "companyWebsite" : "portfolioUrl"]?.message && (
                      <p className="text-xs text-red-500 mt-1">
                        {(form.formState.errors as any)[isEmployer ? "companyWebsite" : "portfolioUrl"].message}
                      </p>
                    )}
                  </Field>
                </div>

                {/* Visibility hint */}
                <div className="mt-4 rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: TERRACOTTA + "0d" }}>
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: TERRACOTTA }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: TEAL }}>Boost your visibility</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Profiles with LinkedIn and portfolio links get 3× more employer views on Bridgepath Africa.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Save footer ── */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {savedOk && (
                <span className="flex items-center gap-1.5 text-primary font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                  <CheckCircle2 className="h-4 w-4" /> Saved successfully
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Tab navigation shortcuts */}
              {tab !== (isEmployer ? "links" : "links") && (
                <button
                  type="button"
                  onClick={() => {
                    const ids = tabs.map(t => t.id);
                    const next = ids[ids.indexOf(tab) + 1];
                    if (next) setTab(next);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: TERRACOTTA }}
              >
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  : <><Save className="h-4 w-4" /> Save Changes</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Danger zone ── */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Account</h3>
        <p className="text-xs text-gray-400 mb-3">Manage your account settings and data.</p>
        <div className="flex flex-wrap gap-2">
          <a href="mailto:support@bridgepathnetwork.com" className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            Contact Support
          </a>
          <button className="text-xs px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
            Request Data Export
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Small helpers ── */

const inputCls =
  "w-full h-11 px-3.5 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition placeholder:text-gray-400";

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && <span className="ml-2 text-xs font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

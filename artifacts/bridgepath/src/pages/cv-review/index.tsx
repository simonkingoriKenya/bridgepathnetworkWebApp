import { useState, useEffect } from "react";
import { useGetMyCvReviews, useCreateCvReview } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText, Bot, ShieldCheck, CheckCircle2, AlertCircle,
  Loader2, Sparkles, ArrowRight, Star, Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAuth } from "@/lib/auth";
import { isDemoEmail, getDemoCv, setDemoCv } from "@/lib/demoAuth";

const GREEN = "#8CC63F";
const DARK = "#0D1B2A";

function buildDemoReview(fileName: string, text: string) {
  return {
    id: 1,
    cvFileName: fileName,
    status: "completed" as const,
    paymentStatus: "free" as const,
    aiReview: {
      overallScore: 82,
      summary:
        "Strong all-round profile with proven leadership experience and African market expertise. Quantify outcomes more boldly and tailor the summary to each role to push the score higher.",
      strengths: [
        "Clear progression of leadership responsibility across recent roles",
        "Strong cross-functional skill set spanning HR, operations and stakeholder management",
        "Demonstrated impact in African markets, with measurable team outcomes",
      ],
      improvements: [
        "Add specific KPIs and percentages to each accomplishment bullet",
        "Move the most recent role and key wins into the top third of page one",
        "Tighten the professional summary to 3 lines and align it to your target role",
      ],
      recommendedRoles: ["HR Business Partner", "Talent Acquisition Lead", "People Operations Manager", "L&D Specialist"],
      jobReadinessScore: 84,
      formattingScore: 78,
      skillsScore: 86,
      experienceScore: 88,
      industryAlignmentScore: 80,
    },
  };
}

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={GREEN} strokeWidth="8"
          strokeDasharray={`${pct} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-extrabold" style={{ color: DARK }}>{score}</div>
        <div className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">Score</div>
      </div>
    </div>
  );
}

export default function CvReview() {
  const [cvText, setCvText] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const { user } = useAuth();
  const isDemo = isDemoEmail(user?.email);

  const { toast } = useToast();

  const { data: reviews, isLoading, refetch } = useGetMyCvReviews({
    query: { queryKey: ["myCvReviews"], enabled: !isDemo },
  });

  const createReviewMutation = useCreateCvReview();

  const [demoReviewData, setDemoReviewData] = useState<ReturnType<typeof buildDemoReview> | null>(null);
  useEffect(() => {
    if (!isDemo) return;
    const stored = getDemoCv();
    if (stored) {
      setDemoReviewData(buildDemoReview(stored.fileName, stored.text || ""));
    }
  }, [isDemo]);

  const handleSubmit = () => {
    if (!cvText.trim()) {
      toast({ variant: "destructive", title: "Missing content", description: "Please paste your CV content to proceed." });
      return;
    }

    if (isDemo) {
      const fileName = cvFileName || "Resume.txt";
      const review = buildDemoReview(fileName, cvText);
      setDemoCv({
        fileName, text: cvText,
        uploadedAt: new Date().toISOString(),
        aiScore: review.aiReview.overallScore,
        summary: review.aiReview.summary,
      });
      setDemoReviewData(review);
      toast({ title: "CV Analyzed!", description: "Your AI review is ready below." });
      setCvText("");
      setCvFileName("");
      return;
    }

    createReviewMutation.mutate(
      { data: { cvFileName: cvFileName || "Resume.txt", cvText } },
      {
        onSuccess: () => {
          toast({ title: "CV Submitted!", description: "Our AI is now analyzing your profile." });
          setCvText("");
          setCvFileName("");
          refetch();
        },
        onError: (err) => {
          toast({ variant: "destructive", title: "Submission failed", description: getApiErrorMessage(err, "Could not submit CV for review.") });
        },
      }
    );
  };

  const handleUpgrade = async () => {
    if (isDemo) {
      toast({ title: "Demo mode", description: "Create a real account to unlock the Human HR Review service." });
      return;
    }

    const reviewId = (latestReview as any)?.id;
    if (!reviewId) {
      toast({ variant: "destructive", title: "No review found", description: "Submit your CV first to request a human review." });
      return;
    }

    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bridgepath_token") || ""}`,
        },
        body: JSON.stringify({
          reviewId,
          successUrl: `${window.location.origin}/cv-review?payment=success`,
          cancelUrl: `${window.location.origin}/cv-review`,
        }),
      });

      if (res.status === 503) {
        // Stripe not configured — fallback to contact
        toast({
          title: "Human Review — Contact Us",
          description: "Our payment system is being set up. Email pkumanyc@gmail.com to arrange your expert review.",
        });
        return;
      }

      if (!res.ok) throw new Error("Failed to create checkout session");

      const data: { url?: string } = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast({
        title: "Request received",
        description: "Email pkumanyc@gmail.com to schedule your expert HR CV review for $15.",
      });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const latestReview: any = isDemo
    ? demoReviewData
    : reviews && reviews.length > 0 ? reviews[0] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: DARK }}>AI CV Analysis</h1>
          <p className="text-gray-500 mt-1 text-sm">Get instant AI feedback on your resume — then upgrade for a human expert review.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: GREEN + "15", color: GREEN }}>
          <Sparkles className="h-3.5 w-3.5" /> AI Powered
        </div>
      </div>

      {/* Submit form */}
      {!latestReview || latestReview.status === "failed" ? (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: GREEN + "15" }}>
                <Bot className="h-4.5 w-4.5" style={{ color: GREEN }} />
              </div>
              Submit your CV
            </CardTitle>
            <CardDescription>Paste your resume text below for immediate AI analysis. No file upload needed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="filename">Resume Title (Optional)</Label>
              <Input
                id="filename"
                placeholder="e.g. Software Engineer Resume 2025"
                value={cvFileName}
                onChange={(e) => setCvFileName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Resume Content</Label>
              <Textarea
                id="content"
                placeholder="Paste the full text of your CV here..."
                className="min-h-[260px] font-mono text-sm"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
              <p className="text-xs text-gray-400">{cvText.length > 0 ? `${cvText.split(/\s+/).filter(Boolean).length} words` : "Tip: the more detail you include, the better the analysis."}</p>
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={createReviewMutation.isPending || !cvText.trim()}
            >
              {createReviewMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Bot className="mr-2 h-4 w-4" /> Analyze My CV</>
              )}
            </Button>
            <p className="text-xs text-gray-400">Free · Instant · No credit card needed</p>
          </CardFooter>
        </Card>

      ) : latestReview.status === "ai_processing" || latestReview.status === "pending" ? (
        <Card className="border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: GREEN + "15" }}>
            <Bot className="h-8 w-8 animate-pulse" style={{ color: GREEN }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: DARK }}>Analyzing your CV</h2>
          <p className="text-gray-500 mb-8 text-sm">Our AI is reviewing your experience, skills, and formatting...</p>
          <Progress value={65} className="w-full max-w-md mx-auto h-2" />
          <Button variant="outline" className="mt-8" onClick={() => refetch()}>
            Refresh Status
          </Button>
        </Card>

      ) : latestReview.aiReview ? (
        <div className="space-y-6">

          {/* Score banner */}
          <div className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-6" style={{ backgroundColor: DARK }}>
            <ScoreRing score={latestReview.aiReview.overallScore} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>AI Analysis Complete</p>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{latestReview.cvFileName}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{latestReview.aiReview.summary}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">

            {/* Main analysis card */}
            <div className="md:col-span-2 space-y-5">

              {/* Strengths + Improvements */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "#16a34a" }}>
                      <CheckCircle2 className="h-4 w-4" /> Strengths
                    </h3>
                    <ul className="space-y-2.5">
                      {latestReview.aiReview.strengths.map((strength: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" /> Improvements
                    </h3>
                    <ul className="space-y-2.5">
                      {latestReview.aiReview.improvements.map((imp: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommended roles */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-sm mb-3" style={{ color: DARK }}>Recommended Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {latestReview.aiReview.recommendedRoles.map((role: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ backgroundColor: GREEN + "10", color: GREEN, borderColor: GREEN + "30" }}>
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scores sidebar */}
            <div className="space-y-5">

              {/* Score breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-sm mb-4" style={{ color: DARK }}>Score Breakdown</h3>
                <div className="space-y-3.5">
                  {[
                    { label: "Job Readiness", score: latestReview.aiReview.jobReadinessScore },
                    { label: "Formatting", score: latestReview.aiReview.formattingScore },
                    { label: "Skills Impact", score: latestReview.aiReview.skillsScore },
                    { label: "Experience", score: latestReview.aiReview.experienceScore },
                    { label: "Industry Fit", score: latestReview.aiReview.industryAlignmentScore },
                  ].map(({ label, score }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-bold" style={{ color: DARK }}>{score}/100</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: GREEN }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade card */}
              {latestReview.paymentStatus !== "paid" && (
                <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: DARK }}>
                  <div className="px-5 pt-5 pb-4" style={{ backgroundColor: DARK }}>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-5 w-5" style={{ color: GREEN }} />
                      <h3 className="font-bold text-white text-sm">Human HR Review</h3>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Get personalised, actionable feedback from a certified African HR specialist.
                    </p>
                  </div>
                  <div className="bg-white px-5 py-4 space-y-3">
                    {[
                      "Reviewed by a senior HR recruiter",
                      "Tailored career path guidance",
                      "Salary benchmarking for Africa",
                    ].map((point) => (
                      <div key={point} className="flex items-start gap-2">
                        <Star className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: GREEN }} />
                        <p className="text-xs text-gray-600">{point}</p>
                      </div>
                    ))}
                    <button
                      onClick={handleUpgrade}
                      disabled={upgradeLoading}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white mt-2 transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ backgroundColor: GREEN }}
                    >
                      {upgradeLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                      ) : (
                        <>Upgrade for $15 <ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>
                    <p className="text-[11px] text-gray-400 text-center">One-time payment · 48h turnaround</p>
                  </div>
                </div>
              )}

              {latestReview.paymentStatus === "paid" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                  <div className="h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: GREEN + "15" }}>
                    <CheckCircle2 className="h-5 w-5" style={{ color: GREEN }} />
                  </div>
                  <p className="font-bold text-sm" style={{ color: DARK }}>Expert review requested</p>
                  <p className="text-xs text-gray-400 mt-1">Our HR specialist will review within 48 hours.</p>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Phone className="h-3.5 w-3.5" />
                    <span>pkumanyc@gmail.com</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="text-sm font-semibold underline text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => { setCvText(""); setCvFileName(""); if (isDemo) setDemoReviewData(null); }}
            >
              Submit Another CV
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

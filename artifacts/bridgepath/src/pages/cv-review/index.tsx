import { useState } from "react";
import { useGetMyCvReviews, useCreateCvReview } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Bot, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getApiErrorMessage } from "@/lib/api-error";

export default function CvReview() {
  const [cvText, setCvText] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  
  const { toast } = useToast();
  
  const { data: reviews, isLoading, refetch } = useGetMyCvReviews({
    query: { queryKey: ["myCvReviews"] }
  });

  const createReviewMutation = useCreateCvReview();

  const handleSubmit = () => {
    if (!cvText.trim()) {
      toast({
        variant: "destructive",
        title: "Missing content",
        description: "Please paste your CV content to proceed.",
      });
      return;
    }

    createReviewMutation.mutate({
      data: {
        cvFileName: cvFileName || "Resume.txt",
        cvText
      }
    }, {
      onSuccess: () => {
        toast({
          title: "CV Submitted!",
          description: "Our AI is now analyzing your profile.",
        });
        setCvText("");
        setCvFileName("");
        refetch();
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: getApiErrorMessage(err, "Could not submit CV for review."),
        });
      }
    });
  };

  const latestReview = reviews && reviews.length > 0 ? reviews[0] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI CV Analysis</h1>
        <p className="text-muted-foreground mt-2">Get instant feedback on your resume to improve your chances of landing global roles.</p>
      </div>

      {!latestReview || latestReview.status === 'failed' ? (
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle>Submit your CV</CardTitle>
            <CardDescription>Paste your resume text below for immediate AI analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filename">Resume Title (Optional)</Label>
              <Input 
                id="filename" 
                placeholder="e.g. Software Engineer Resume 2024" 
                value={cvFileName}
                onChange={(e) => setCvFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Resume Content</Label>
              <Textarea 
                id="content" 
                placeholder="Paste the full text of your CV here..." 
                className="min-h-[300px] font-mono text-sm"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={createReviewMutation.isPending || !cvText.trim()}
              className="w-full sm:w-auto"
            >
              {createReviewMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Bot className="mr-2 h-4 w-4" /> Analyze My CV</>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : latestReview.status === 'ai_processing' || latestReview.status === 'pending' ? (
        <Card className="border-primary/20 p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Bot className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing your CV</h2>
          <p className="text-muted-foreground mb-8">Our AI is reviewing your experience, skills, and formatting...</p>
          <Progress value={65} className="w-full max-w-md mx-auto" />
          <Button variant="outline" className="mt-8" onClick={() => refetch()}>
            Refresh Status
          </Button>
        </Card>
      ) : latestReview.aiReview ? (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-primary/20 shadow-md">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      Analysis Results
                    </CardTitle>
                    <CardDescription className="mt-1">For {latestReview.cvFileName}</CardDescription>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{latestReview.aiReview.overallScore}</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Overall Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">{latestReview.aiReview.summary}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" /> Strengths
                    </h3>
                    <ul className="space-y-2">
                      {latestReview.aiReview.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-amber-500">
                      <AlertCircle className="h-5 w-5" /> Improvements
                    </h3>
                    <ul className="space-y-2">
                      {latestReview.aiReview.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Recommended Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {latestReview.aiReview.recommendedRoles.map((role, i) => (
                      <Badge key={i} variant="secondary">{role}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>Job Readiness</span>
                      <span className="font-medium">{latestReview.aiReview.jobReadinessScore}/100</span>
                    </div>
                    <Progress value={latestReview.aiReview.jobReadinessScore} className="h-2" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>Formatting</span>
                      <span className="font-medium">{latestReview.aiReview.formattingScore}/100</span>
                    </div>
                    <Progress value={latestReview.aiReview.formattingScore} className="h-2" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>Skills Impact</span>
                      <span className="font-medium">{latestReview.aiReview.skillsScore}/100</span>
                    </div>
                    <Progress value={latestReview.aiReview.skillsScore} className="h-2" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>Experience</span>
                      <span className="font-medium">{latestReview.aiReview.experienceScore}/100</span>
                    </div>
                    <Progress value={latestReview.aiReview.experienceScore} className="h-2" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>Industry Alignment</span>
                      <span className="font-medium">{latestReview.aiReview.industryAlignmentScore}/100</span>
                    </div>
                    <Progress value={latestReview.aiReview.industryAlignmentScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {latestReview.paymentStatus !== 'paid' && (
                <Card className="bg-primary text-primary-foreground border-none">
                  <CardContent className="p-6 text-center space-y-4">
                    <ShieldCheck className="h-10 w-10 mx-auto text-accent" />
                    <h3 className="font-bold text-xl">Get Expert Review</h3>
                    <p className="text-sm text-primary-foreground/80">
                      Upgrade to a human HR review to get personalized, actionable feedback from seasoned global recruiters.
                    </p>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                      Upgrade for $20
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => { setCvText(""); setCvFileName(""); }}>Submit Another CV</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
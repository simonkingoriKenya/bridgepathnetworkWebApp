import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useGetJob, useCreateApplication, useGetMyApplications } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Briefcase, Globe, Calendar, DollarSign, Send, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function JobDetail() {
  const [match, params] = useRoute("/jobs/:id");
  const jobId = params?.id ? parseInt(params.id) : 0;
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const { data: job, isLoading, error } = useGetJob(jobId, {
    query: {
      enabled: !!jobId,
      queryKey: ["job", jobId]
    }
  });

  const { data: myApps } = useGetMyApplications({
    query: {
      enabled: isAuthenticated && user?.role === 'job_seeker',
      queryKey: ["myApplications"]
    }
  });

  const applyMutation = useCreateApplication();

  const hasApplied = myApps?.some(app => app.jobId === jobId);

  const handleApply = () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?redirect=/jobs/${jobId}`;
      return;
    }

    applyMutation.mutate({
      data: { jobId }
    }, {
      onSuccess: () => {
        toast({
          title: "Application Submitted!",
          description: "You have successfully applied for this position.",
        });
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Application failed",
          description: err.data?.message || "Could not submit application.",
        });
      }
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button asChild><Link href="/jobs">Back to Jobs</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-primary/5 py-12 border-b border-border">
          <div className="container mx-auto px-4 md:px-8">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ) : job && (
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="bg-background">{job.type.replace('_', ' ')}</Badge>
                    {!job.isActive && <Badge variant="destructive">Closed</Badge>}
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-foreground mb-4">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm sm:text-base">
                    <div className="flex items-center font-medium text-foreground">
                      <Briefcase className="w-5 h-5 mr-2 text-primary" />
                      {job.employer?.name || 'Company Name'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      {job.location}
                    </div>
                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        {job.currency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Posted {format(new Date(job.createdAt), 'MMMM d, yyyy')}
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 w-full md:w-auto">
                  {user?.role === 'employer' ? (
                    <Button size="lg" className="w-full md:w-auto" disabled>
                      Employers cannot apply
                    </Button>
                  ) : hasApplied ? (
                    <Button size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700" disabled>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Applied
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto text-base h-14 px-8 shadow-lg"
                      onClick={handleApply}
                      disabled={!job.isActive || applyMutation.isPending}
                    >
                      {applyMutation.isPending ? "Submitting..." : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Apply Now
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : job && (
                <>
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {job.description.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </section>

                  {job.requirements && (
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                      <div className="prose dark:prose-invert max-w-none">
                        {job.requirements.split('\n').map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills && job.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm">{skill}</Badge>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : job && (
                <Card className="border-border shadow-sm sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    <h3 className="font-bold text-lg border-b pb-4">Company Overview</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Industry</div>
                          <div className="text-muted-foreground">{job.employerProfile?.industry || job.industry || 'Not specified'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-muted-foreground">{job.employerProfile?.country || job.country}</div>
                        </div>
                      </div>
                    </div>

                    {job.employerProfile?.companyWebsite && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={job.employerProfile.companyWebsite} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Temporary import for CheckCircle2
import { CheckCircle2 } from "lucide-react";
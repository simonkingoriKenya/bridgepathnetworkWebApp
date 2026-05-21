import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { BackToTop } from "@/components/ui/BackToTop";
import { ChatSupport } from "@/components/ui/ChatSupport";
import { setAuthTokenGetter } from "@workspace/api-client-react";

setAuthTokenGetter(() => localStorage.getItem("bridgepath_token"));

import Home from "@/pages/home";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Login               = lazy(() => import("@/pages/auth/login"));
const Signup              = lazy(() => import("@/pages/auth/signup"));
const NotFound            = lazy(() => import("@/pages/not-found"));
const JobSeekerDashboard  = lazy(() => import("@/pages/dashboard/jobseeker"));
const EmployerDashboard   = lazy(() => import("@/pages/dashboard/employer"));
const JobsList            = lazy(() => import("@/pages/jobs/index"));
const JobDetail           = lazy(() => import("@/pages/jobs/[id]"));
const PostJob             = lazy(() => import("@/pages/jobs/new"));
const CvReview            = lazy(() => import("@/pages/cv-review/index"));
const Profile             = lazy(() => import("@/pages/profile/index"));
const ServicesPage        = lazy(() => import("@/pages/services/index"));
const ServiceDetail       = lazy(() => import("@/pages/services/[slug]"));
const AboutPage           = lazy(() => import("@/pages/about"));
const BlogIndex           = lazy(() => import("@/pages/blog/index"));
const BlogPost            = lazy(() => import("@/pages/blog/[slug]"));
const LegalPage           = lazy(() => import("@/pages/legal"));
const EmployersPage       = lazy(() => import("@/pages/employers"));
const AuthCallback        = lazy(() => import("@/pages/auth/callback"));
const ForgotPassword      = lazy(() => import("@/pages/auth/forgot-password"));
const ResetPassword       = lazy(() => import("@/pages/auth/reset-password"));
const VerifyEmail         = lazy(() => import("@/pages/auth/verify-email"));
const OAuthCallback       = lazy(() => import("@/pages/auth/oauth-callback"));
const MagicLinkVerify     = lazy(() => import("@/pages/auth/magic-link-verify"));
const JobSeekerOnboarding = lazy(() => import("@/pages/onboarding/jobseeker"));
const EmployerOnboarding  = lazy(() => import("@/pages/onboarding/employer"));
const CandidatesPage      = lazy(() => import("@/pages/candidates"));
const CandidateProfilePage= lazy(() => import("@/pages/candidates/[id]"));
const MessagesPage        = lazy(() => import("@/pages/messages"));
const DashboardJobs       = lazy(() => import("@/pages/dashboard/jobs"));
const PipelinePage        = lazy(() => import("@/pages/dashboard/pipeline"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

function ProtectedRoute({ component: Component, allowedRoles, useLayout = true }: { component: any; allowedRoles?: string[]; useLayout?: boolean }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <PageFallback />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/auth/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Redirect to={user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"} />;
  }

  if (useLayout) {
    return (
      <DashboardLayout>
        <Component />
      </DashboardLayout>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/signup" component={Signup} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/auth/forgot-password" component={ForgotPassword} />
        <Route path="/auth/reset-password" component={ResetPassword} />
        <Route path="/auth/verify-email" component={VerifyEmail} />
        <Route path="/auth/oauth/callback" component={OAuthCallback} />
        <Route path="/auth/magic-link/verify" component={MagicLinkVerify} />
        <Route path="/onboarding/jobseeker">
          {() => <ProtectedRoute component={JobSeekerOnboarding} allowedRoles={["job_seeker"]} useLayout={false} />}
        </Route>
        <Route path="/onboarding/employer">
          {() => <ProtectedRoute component={EmployerOnboarding} allowedRoles={["employer"]} useLayout={false} />}
        </Route>
        <Route path="/about" component={AboutPage} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/privacy">{() => <LegalPage type="privacy" />}</Route>
        <Route path="/terms">{() => <LegalPage type="terms" />}</Route>
        <Route path="/cookies">{() => <LegalPage type="cookies" />}</Route>
        <Route path="/employers" component={EmployersPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/services/:slug" component={ServiceDetail} />
        <Route path="/jobs" component={JobsList} />
        <Route path="/jobs/new">
          {() => <ProtectedRoute component={PostJob} allowedRoles={["employer"]} />}
        </Route>
        <Route path="/jobs/:id" component={JobDetail} />
        <Route path="/dashboard/jobseeker">
          {() => <ProtectedRoute component={JobSeekerDashboard} allowedRoles={["job_seeker"]} />}
        </Route>
        <Route path="/dashboard/employer">
          {() => <ProtectedRoute component={EmployerDashboard} allowedRoles={["employer"]} />}
        </Route>
        <Route path="/dashboard/pipeline">
          {() => <ProtectedRoute component={PipelinePage} allowedRoles={["employer"]} />}
        </Route>
        <Route path="/dashboard/jobs">
          {() => <ProtectedRoute component={DashboardJobs} allowedRoles={["employer"]} />}
        </Route>
        <Route path="/candidates">
          {() => <ProtectedRoute component={CandidatesPage} allowedRoles={["employer"]} />}
        </Route>
        <Route path="/candidates/:id">
          {() => <ProtectedRoute component={CandidateProfilePage} allowedRoles={["employer"]} />}
        </Route>
        <Route path="/messages">
          {() => <ProtectedRoute component={MessagesPage} allowedRoles={["employer"]} />}
        </Route>
        <Route path="/cv-review">
          {() => <ProtectedRoute component={CvReview} allowedRoles={["job_seeker"]} />}
        </Route>
        <Route path="/profile">
          {() => <ProtectedRoute component={Profile} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <BackToTop />
            <ChatSupport />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

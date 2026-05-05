import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { BackToTop } from "@/components/ui/BackToTop";
import { ChatSupport } from "@/components/ui/ChatSupport";
import { setAuthTokenGetter } from "@workspace/api-client-react";

setAuthTokenGetter(() => localStorage.getItem("bridgepath_token"));

import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import NotFound from "@/pages/not-found";
import JobSeekerDashboard from "@/pages/dashboard/jobseeker";
import EmployerDashboard from "@/pages/dashboard/employer";
import JobsList from "@/pages/jobs/index";
import JobDetail from "@/pages/jobs/[id]";
import PostJob from "@/pages/jobs/new";
import CvReview from "@/pages/cv-review/index";
import Profile from "@/pages/profile/index";
import ServicesPage from "@/pages/services/index";
import ServiceDetail from "@/pages/services/[slug]";
import AboutPage from "@/pages/about";
import BlogIndex from "@/pages/blog/index";
import BlogPost from "@/pages/blog/[slug]";
import LegalPage from "@/pages/legal";
import EmployersPage from "@/pages/employers";
import AuthCallback from "@/pages/auth/callback";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import JobSeekerOnboarding from "@/pages/onboarding/jobseeker";
import EmployerOnboarding from "@/pages/onboarding/employer";
import CandidatesPage from "@/pages/candidates";
import CandidateProfilePage from "@/pages/candidates/[id]";
import MessagesPage from "@/pages/messages";
import DashboardJobs from "@/pages/dashboard/jobs";
import PipelinePage from "@/pages/dashboard/pipeline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function ProtectedRoute({ component: Component, allowedRoles, useLayout = true }: { component: any; allowedRoles?: string[]; useLayout?: boolean }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
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
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={Signup} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/auth/forgot-password" component={ForgotPassword} />
      <Route path="/auth/reset-password" component={ResetPassword} />
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

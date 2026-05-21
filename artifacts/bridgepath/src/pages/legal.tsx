import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Link } from "wouter";

const TERRACOTTA = "#C04020";
const INK = "#1E1511";

const content = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "How Bridgepath Africa protects your data",
    intro: "We collect only the information needed to connect professionals, employers, and HR service enquiries across Africa.",
    sections: [
      {
        title: "Information we collect",
        body: "Account details such as your name, email, role, profile information, job applications, employer hiring preferences, CV review submissions, and contact enquiries.",
      },
      {
        title: "How we use it",
        body: "We use your information to manage authentication, personalize dashboards, match professionals with opportunities, process employer enquiries, improve our services, and communicate important account updates.",
      },
      {
        title: "Data protection",
        body: "We use role-based access controls and profile records to keep professional and employer experiences separate and secure. All data is encrypted in transit.",
      },
      {
        title: "Your choices",
        body: "You can update your profile from your dashboard, sign out at any time, or contact Bridgepath Africa at support@bridgepathnetwork.com to request account support or deletion.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "Using Bridgepath Africa",
    intro: "These terms explain the expectations for professionals, employers, and visitors using Bridgepath Africa.",
    sections: [
      {
        title: "Platform purpose",
        body: "Bridgepath Africa provides HR solutions, recruitment support, job discovery, profile management, and employer hiring workflows for African markets.",
      },
      {
        title: "User responsibilities",
        body: "Users must provide accurate information, keep login details secure, and use the platform for genuine career, hiring, or HR service needs.",
      },
      {
        title: "Employer responsibilities",
        body: "Employers are responsible for posting accurate roles, treating candidates fairly, and complying with applicable employment and data protection laws.",
      },
      {
        title: "Service changes",
        body: "Bridgepath Africa may update platform features, service pages, dashboard tools, and content as the business expands across African countries.",
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    eyebrow: "Session and preference storage",
    intro: "Bridgepath Africa uses essential browser storage to keep users signed in and remember role-specific preferences.",
    sections: [
      {
        title: "Essential storage",
        body: "Authentication tokens are stored securely in localStorage so confirmed users can sign in and access the correct dashboard without re-entering credentials.",
      },
      {
        title: "Preference storage",
        body: "We store small role and name preferences locally to route new users to the correct job seeker or employer experience after account creation.",
      },
      {
        title: "Analytics and improvements",
        body: "Future analytics may be used to understand aggregate platform usage, improve navigation, and strengthen hiring workflows.",
      },
      {
        title: "Managing cookies",
        body: "You can clear browser storage from your browser settings. Doing so may sign you out and reset saved role preferences.",
      },
    ],
  },
};

export default function LegalPage({ type }: { type: keyof typeof content }) {
  const page = content[type];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSEO
        title={`${page.title} | Bridgepath Africa`}
        description={`Bridgepath Africa ${page.title.toLowerCase()} — our commitment to protecting your data and ensuring fair, transparent use of our platform.`}
        path={`/${type}`}
        noIndex={true}
      />
      <Navbar />
      <main className="flex-1">
        <section className="py-20 section-ink">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] mb-4 text-accent">
              {page.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{page.title}</h1>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-2xl">{page.intro}</p>
          </div>
        </section>
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="grid gap-5">
              {page.sections.map((section) => (
                <article key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-3" style={{ color: INK }}>{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              style={{ backgroundColor: TERRACOTTA + "14", border: `1px solid ${TERRACOTTA}30` }}>
              <div>
                <h3 className="font-bold text-foreground">Need help with your account?</h3>
                <p className="text-sm text-muted-foreground mt-1">Contact our team for privacy, access, or platform support.</p>
              </div>
              <Link href="/#contact"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-white font-semibold shrink-0"
                style={{ backgroundColor: TERRACOTTA }}>
                Contact Bridgepath
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

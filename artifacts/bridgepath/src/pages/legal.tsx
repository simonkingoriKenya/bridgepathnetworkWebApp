import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

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
        body: "Authentication is handled through Supabase. We use role-based access patterns and profile records to keep professional and employer experiences separate.",
      },
      {
        title: "Your choices",
        body: "You can update your profile from your dashboard, sign out at any time, or contact Bridgepath Africa to request account support.",
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
        body: "Supabase authentication stores secure session details so confirmed users can sign in and access the correct dashboard.",
      },
      {
        title: "Preference storage",
        body: "We store small role and name preferences locally to route new users to the correct job seeker or employer experience after email confirmation.",
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #243154 100%)` }}>
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: GREEN }}>
              {page.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{page.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">{page.intro}</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="grid gap-5">
              {page.sections.map((section) => (
                <article key={section.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-3" style={{ color: DARK }}>{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ backgroundColor: GREEN + "14" }}>
              <div>
                <h3 className="font-bold" style={{ color: DARK }}>Need help with your account?</h3>
                <p className="text-sm text-gray-600 mt-1">Contact our team for privacy, access, or platform support.</p>
              </div>
              <Link href="/#contact" className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: GREEN }}>
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
import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Citizen Services",
    links: [
      { to: "/services", label: "All Services" },
      { to: "/certificates", label: "Certificates" },
      { to: "/payments", label: "Pay Bills & Tax" },
      { to: "/complaints", label: "File a Complaint" },
      { to: "/rti", label: "RTI Portal" },
    ],
  },
  {
    title: "Discover",
    links: [
      { to: "/schemes", label: "Government Schemes" },
      { to: "/rights", label: "Citizen Rights" },
      { to: "/bookings", label: "Facility Bookings" },
      { to: "/maps", label: "Ward Map" },
      { to: "/notifications", label: "Public Notices" },
    ],
  },
  {
    title: "For Government",
    links: [
      { to: "/officer/dashboard", label: "Officer Portal" },
      { to: "/admin", label: "Admin Console" },
      { to: "/resources", label: "Case Studies" },
      { to: "/ai-assistant", label: "AI Modules" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/help-center", label: "Help Center" },
      { to: "/resources", label: "Guides" },
      { to: "/help-center", label: "Contact" },
      { to: "/help-center", label: "Grievance Redressal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-saffron-gradient text-white font-display text-xl font-bold">
                N
              </div>
              <div>
                <div className="font-display text-xl font-semibold">
                  NagarSeva
                </div>
                <div className="text-[10px] uppercase tracking-widest opacity-70">
                  Digital Governance
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm opacity-80">
              A unified digital front door connecting citizens with Urban Local
              Bodies across India — powered by AI, built for accessibility,
              designed for trust.
            </p>
            <div className="mt-6 flex gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                WCAG 2.2
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                ISO 27001
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                MeitY Certified
              </span>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-accent">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="opacity-75 hover:opacity-100 hover:text-accent transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} NagarSeva Platform. An original GovTech
            reference project. Not affiliated with any government body.
          </div>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Accessibility</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

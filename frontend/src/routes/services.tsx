import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowRight,
  Clock,
  IndianRupee,
  FileCheck,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services · NagarSeva" },
      {
        name: "description",
        content:
          "Browse every municipal service — filter by category, department and city.",
      },
      { property: "og:title", content: "Services · NagarSeva" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const categories = [
  "All",
  "Certificates",
  "Taxes",
  "Utilities",
  "Complaints",
  "Licenses",
  "Building",
  "Bookings",
  "RTI",
  "Schemes",
  "Emergency",
];
const departments = [
  "Revenue",
  "Public Health",
  "Water Works",
  "Engineering",
  "Fire",
  "Town Planning",
  "Solid Waste",
  "Legal",
];

const services = [
  {
    cat: "Certificates",
    name: "Birth Certificate",
    dept: "Public Health",
    fee: "₹50",
    sla: "7 days",
    desc: "Certified copy of birth record with digital signature.",
  },
  {
    cat: "Certificates",
    name: "Marriage Certificate",
    dept: "Revenue",
    fee: "₹200",
    sla: "15 days",
    desc: "Register a marriage solemnised within municipal limits.",
  },
  {
    cat: "Taxes",
    name: "Property Tax Assessment",
    dept: "Revenue",
    fee: "As per rules",
    sla: "Instant",
    desc: "Self-assessment with online receipt.",
  },
  {
    cat: "Utilities",
    name: "New Water Connection",
    dept: "Water Works",
    fee: "₹1,500",
    sla: "30 days",
    desc: "Application for a new domestic connection with meter.",
  },
  {
    cat: "Complaints",
    name: "Streetlight Not Working",
    dept: "Engineering",
    fee: "Free",
    sla: "48 hours",
    desc: "Report a non-functional streetlight with location pin.",
  },
  {
    cat: "Complaints",
    name: "Garbage Not Collected",
    dept: "Solid Waste",
    fee: "Free",
    sla: "24 hours",
    desc: "Report missed collection or overflowing bin.",
  },
  {
    cat: "Licenses",
    name: "Trade License Renewal",
    dept: "Revenue",
    fee: "As per slab",
    sla: "10 days",
    desc: "Renew an existing trade license before expiry.",
  },
  {
    cat: "Building",
    name: "Plan Approval",
    dept: "Town Planning",
    fee: "Per sqm",
    sla: "45 days",
    desc: "Approval of building plans for construction.",
  },
  {
    cat: "Bookings",
    name: "Community Hall Booking",
    dept: "Engineering",
    fee: "Slot based",
    sla: "Instant",
    desc: "Book municipal halls for weddings and events.",
  },
  {
    cat: "RTI",
    name: "File RTI Request",
    dept: "Legal",
    fee: "₹10",
    sla: "30 days",
    desc: "Right to Information request under RTI Act 2005.",
  },
  {
    cat: "Emergency",
    name: "Fire NOC",
    dept: "Fire",
    fee: "As per rules",
    sla: "21 days",
    desc: "No-objection certificate for commercial premises.",
  },
  {
    cat: "Schemes",
    name: "Awas Yojana Application",
    dept: "Revenue",
    fee: "Free",
    sla: "60 days",
    desc: "Apply for affordable housing scheme benefits.",
  },
];

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Catalogue"
        title="Every municipal service, in one searchable place."
        intro="1,240+ services across 412 ULBs. Filter by category, department or city — apply, pay and track without leaving the page."
      >
        <div className="mt-4 flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services…"
              className="pl-10 h-11 bg-background"
            />
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Search
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5 lg:flex-col">
                {categories.map((c, i) => (
                  <button
                    key={c}
                    className={`rounded-md px-3 py-1.5 text-sm text-left ${i === 0 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Department
              </h3>
              <div className="mt-3 space-y-1.5">
                {departments.map((d) => (
                  <label
                    key={d}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <input type="checkbox" className="rounded border-border" />{" "}
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Language
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["EN", "हिं", "ગુ", "मराठी", "தமிழ்", "తెలుగు"].map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </aside>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {services.length}
                </span>{" "}
                services found
              </div>
              <select className="rounded-md border border-border bg-background px-3 py-1.5 text-sm">
                <option>Most requested</option>
                <option>Fastest SLA</option>
                <option>A–Z</option>
              </select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((s) => (
                <Card
                  key={s.name}
                  className="p-5 transition hover:shadow-elevated hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {s.cat}
                      </Badge>
                      <h3 className="font-display text-lg font-semibold text-primary">
                        {s.name}
                      </h3>
                    </div>
                    <FileCheck className="h-5 w-5 text-accent shrink-0" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <Building2 className="inline h-3 w-3 mr-1 text-muted-foreground" />
                      {s.dept}
                    </div>
                    <div>
                      <IndianRupee className="inline h-3 w-3 mr-1 text-muted-foreground" />
                      {s.fee}
                    </div>
                    <div>
                      <Clock className="inline h-3 w-3 mr-1 text-muted-foreground" />
                      {s.sla}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Apply now
                    </Button>
                    <Link to="/ai-assistant">
                      <Button size="sm" variant="outline">
                        Ask AI
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

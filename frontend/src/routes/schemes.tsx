import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceForm, type FieldDef } from "@/components/site/ServiceForm";
import {
  Home,
  Baby,
  GraduationCap,
  Heart,
  Sparkles,
  Users,
  Wheat,
  HandHeart,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes · CivicHub" },
      {
        name: "description",
        content:
          "Discover Central, State and Municipal schemes with AI eligibility check.",
      },
      { property: "og:url", content: "/schemes" },
    ],
    links: [{ rel: "canonical", href: "/schemes" }],
  }),
  component: SchemesPage,
});

const commonFields: FieldDef[] = [
  { name: "applicantName", label: "Applicant name", required: true },
  { name: "aadhaar", label: "Aadhaar (last 4 digits)", required: true },
  { name: "mobile", label: "Mobile", type: "tel", required: true },
  {
    name: "annualIncome",
    label: "Annual household income (₹)",
    type: "number",
    required: true,
  },
  { name: "address", label: "Address", type: "textarea", required: true },
  { name: "reason", label: "Why do you need this benefit?", type: "textarea" },
];

const groups = [
  {
    label: "Central",
    items: [
      {
        icon: Home,
        name: "PM Awas Yojana (Urban)",
        desc: "Affordable housing subsidy for eligible urban families.",
        tag: "Housing",
        docs: ["Aadhaar (PDF)", "Income cert (PDF)", "Land / rent doc (PDF)"],
      },
      {
        icon: Heart,
        name: "Ayushman Bharat PMJAY",
        desc: "Health cover of ₹5L per family per year.",
        tag: "Health",
        docs: ["Aadhaar (PDF)", "Ration card (PDF)"],
      },
      {
        icon: GraduationCap,
        name: "PM Vidya Lakshmi",
        desc: "Single-window higher-education loans.",
        tag: "Education",
        docs: [
          "Aadhaar (PDF)",
          "10th/12th marksheet (PDF)",
          "Admission letter (PDF)",
        ],
      },
      {
        icon: Wheat,
        name: "PM Garib Kalyan Anna",
        desc: "Free foodgrains for eligible beneficiaries.",
        tag: "Welfare",
        docs: ["Aadhaar (PDF)", "BPL certificate (PDF)"],
      },
    ],
  },
  {
    label: "State",
    items: [
      {
        icon: HandHeart,
        name: "Mukhyamantri Mahila Utthan",
        desc: "Skilling and micro-credit for women entrepreneurs.",
        tag: "Livelihood",
        docs: ["Aadhaar (PDF)", "Bank passbook (PDF)"],
      },
      {
        icon: Baby,
        name: "Balika Samruddhi Yojana",
        desc: "Direct cash benefit at girl-child milestones.",
        tag: "Girl Child",
        docs: ["Aadhaar (PDF)", "Birth certificate (PDF)"],
      },
      {
        icon: Users,
        name: "Senior Citizen Pension",
        desc: "Monthly pension for senior citizens below poverty line.",
        tag: "Elderly",
        docs: ["Aadhaar (PDF)", "Age proof (PDF)", "BPL cert (PDF)"],
      },
    ],
  },
  {
    label: "Municipal",
    items: [
      {
        icon: Home,
        name: "Slum Redevelopment Scheme",
        desc: "In-situ rehabilitation for notified slum dwellers.",
        tag: "Housing",
        docs: ["Aadhaar (PDF)", "Slum survey ID (PDF)"],
      },
      {
        icon: Heart,
        name: "Mohalla Clinic Initiative",
        desc: "Free primary healthcare in every ward.",
        tag: "Health",
        docs: ["Aadhaar (PDF)"],
      },
      {
        icon: Users,
        name: "Sanitation Worker Welfare",
        desc: "Insurance, education & housing benefits.",
        tag: "Welfare",
        docs: ["Aadhaar (PDF)", "Employment ID (PDF)"],
      },
    ],
  },
];

function SchemesPage() {
  const [active, setActive] = useState<{ name: string; docs: string[] } | null>(
    null,
  );

  return (
    <>
      <PageHero
        eyebrow="Schemes"
        title="Find every benefit you qualify for."
        intro="Central, State and Municipal schemes — one AI eligibility check reveals what's yours to claim."
      />
      <Section>
        <Card className="p-6 md:p-8 bg-hero-gradient text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Sparkles className="h-4 w-4 text-accent" /> Seva AI eligibility
                check
              </div>
              <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
                Answer 4 questions. See every scheme you can apply for.
              </h2>
            </div>
            <a href="/ai/schemes">
              <Button className="bg-accent text-primary hover:bg-accent/90">
                Start eligibility check
              </Button>
            </a>
          </div>
        </Card>
      </Section>

      {groups.map((g) => (
        <Section
          key={g.label}
          eyebrow={g.label}
          title={`${g.label} Government schemes`}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {g.items.map((i) => (
              <Card
                key={i.name}
                className={`p-5 transition hover:-translate-y-0.5 hover:shadow-elevated ${active?.name === i.name ? "ring-2 ring-accent" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-saffron-gradient text-white">
                    <i.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{i.tag}</Badge>
                </div>
                <h3 className="mt-4 font-display font-semibold text-primary">
                  {i.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setActive({ name: i.name, docs: i.docs });
                      setTimeout(
                        () =>
                          document
                            .getElementById("scheme-form")
                            ?.scrollIntoView({ behavior: "smooth" }),
                        50,
                      );
                    }}
                  >
                    Apply
                  </Button>
                  <Button size="sm" variant="ghost">
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      ))}

      {active && (
        <Section eyebrow="Application" title={`Apply for ${active.name}`}>
          <div id="scheme-form">
            <ServiceForm
              service={active.name}
              category="scheme"
              idPrefix="SCH"
              requiredDocs={active.docs}
              fields={commonFields}
              intro="Attach the listed PDFs. Officers verify eligibility before disbursal."
            />
          </div>
        </Section>
      )}
    </>
  );
}

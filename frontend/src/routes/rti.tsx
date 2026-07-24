import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceForm } from "@/components/site/ServiceForm";
import { FileText, Scale } from "lucide-react";

export const Route = createFileRoute("/rti")({
  head: () => ({
    meta: [
      { title: "RTI Portal · CivicHub" },
      {
        name: "description",
        content:
          "File RTI applications, first and second appeals under the RTI Act, 2005.",
      },
      { property: "og:url", content: "/rti" },
    ],
    links: [{ rel: "canonical", href: "/rti" }],
  }),
  component: RtiPage,
});

function RtiPage() {
  return (
    <>
      <PageHero
        eyebrow="RTI"
        title="Right to Information, made accessible."
        intro="File an RTI request in your language. Track responses. Escalate to First and Second Appeal — all in one place."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <ServiceForm
            service="RTI Application"
            category="rti"
            idPrefix="RTI"
            fee="₹10"
            requiredDocs={["BPL certificate (PDF, if seeking fee waiver)"]}
            fields={[
              {
                name: "publicAuthority",
                label: "Public Authority",
                type: "select",
                required: true,
                options: [
                  "Ahmedabad Municipal Corp.",
                  "Water Works Dept",
                  "Town Planning",
                  "Revenue Dept",
                  "Public Health",
                ],
              },
              {
                name: "language",
                label: "Language",
                type: "select",
                required: true,
                options: ["English", "हिन्दी", "ગુજરાતી"],
              },
              {
                name: "subject",
                label: "Subject",
                required: true,
                col: 2,
                placeholder:
                  "e.g. Details of pothole repair works in Ward 12 (2023–24)",
              },
              { name: "period", label: "Time period covered", required: true },
              {
                name: "isBpl",
                label: "BPL applicant?",
                type: "select",
                options: ["No", "Yes — waiver requested"],
              },
              {
                name: "questions",
                label: "Your questions (numbered)",
                type: "textarea",
                required: true,
                placeholder:
                  "1. Total funds allocated…\n2. List of contractors…",
              },
              {
                name: "email",
                label: "Email for delivery",
                type: "email",
                required: true,
              },
              {
                name: "postalAddress",
                label: "Postal address (for hard copy)",
                type: "textarea",
                required: true,
              },
            ]}
            intro="Reply within 30 days (48 hrs for life/liberty matters). ₹10 fee via UPI."
          />

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                <h3 className="font-display font-semibold text-primary">
                  Your RTIs
                </h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["RTI/2025/0091", "Awaiting reply", "Day 12 / 30"],
                  ["RTI/2024/1187", "Replied", "First appeal filed"],
                  ["RTI/2024/0902", "Closed", "Received"],
                ].map(([id, s, meta]) => (
                  <li key={id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{id}</div>
                      <Badge variant="secondary" className="text-[10px]">
                        {s}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {meta}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-accent" />
                <h3 className="font-display font-semibold">Appeals</h3>
              </div>
              <p className="mt-2 text-sm opacity-80">
                If your RTI is delayed beyond 30 days or the answer is
                inadequate, you have 30 days to file a First Appeal.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 bg-transparent border-white/40 text-white hover:bg-white/10"
              >
                File First Appeal
              </Button>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
